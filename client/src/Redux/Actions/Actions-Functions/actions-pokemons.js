import axios from "axios";
import {
    GET_POKEMONS,
    GET_DETAILS,
    REMOVE_POKEMON,
    POKEMONS_REQUEST,
    POKEMONS_REQUEST_FINISHED,
    POKEMONS_REQUEST_FAILED,
} from "../Actions-Types/action-types";

export const DEFAULT_POKEMON_PAGE_SIZE = 20;
const MIN_POKEMON_PAGE_LOADING_MS = 800;
const pokemonPageRequests = new Map();
const pokemonPageCache = new Map();
const pokemonDetailsRequestPromises = new Map();
const recentPokemonDetails = new Map();
let nextRequestId = 0;
const DETAIL_CACHE_TTL = 1000;
const MAX_CACHED_PAGES = 40;

const readQueryState = (state = {}) => ({
    searchTerm: state.searchTerm || "",
    selectedTypes: state.selectedTypes || [],
    originFilter: state.originFilter || "all",
    sortName: state.sortName || "all",
    sortAttack: state.sortAttack || "all",
});

const buildRequestParams = ({ page, limit, query }) => {
    const params = { page, limit };
    const name = String(query.searchTerm || "").trim();
    const types = (query.selectedTypes || []).map((type) => {
        const value = typeof type === "object" ? type?.name : type;
        return String(value || "").trim().toLowerCase();
    }).filter(Boolean);

    if (name) params.name = name;
    if (types.length) params.type = types.join(",");
    if (query.originFilter === "data base") params.origin = "created";
    if (query.originFilter === "api") params.origin = "api";
    if (query.sortName && query.sortName !== "all") params.sortName = query.sortName;
    if (query.sortAttack && query.sortAttack !== "all") params.sortAttack = query.sortAttack;
    return params;
};

const requestKey = (params) => JSON.stringify(params);

const requestPokemonPage = (params, { force = false } = {}) => {
    const key = requestKey(params);
    if (!force && pokemonPageCache.has(key)) {
        return Promise.resolve(pokemonPageCache.get(key));
    }
    if (pokemonPageRequests.has(key)) return pokemonPageRequests.get(key);

    const request = axios.get("/pokemon", { params })
        .then((response) => {
            const result = response.data;
            if (!result || !Array.isArray(result.data) || !result.pagination) {
                throw new Error("The PokÃ©mon API returned an invalid paginated response.");
            }
            pokemonPageCache.set(key, result);
            while (pokemonPageCache.size > MAX_CACHED_PAGES) {
                pokemonPageCache.delete(pokemonPageCache.keys().next().value);
            }
            return result;
        })
        .finally(() => pokemonPageRequests.delete(key));

    pokemonPageRequests.set(key, request);
    return request;
};

const waitUntilMinimumLoadingTime = async (startedAt, minimumMs) => {
    const remaining = Math.max(0, minimumMs - (Date.now() - startedAt));
    if (remaining > 0) await new Promise((resolve) => setTimeout(resolve, remaining));
};

export const getPokemons = ({
    page = 1,
    limit,
    silent = false,
    force = false,
    query: queryOverrides = {},
    preserveOnEmpty = false,
    minLoadingMs = MIN_POKEMON_PAGE_LOADING_MS,
} = {}) => {
    return async (dispatch, getState) => {
        const state = getState();
        const baseQuery = state.pokemonPendingQuery || readQueryState(state);
        const query = {
            ...baseQuery,
            ...queryOverrides,
            selectedTypes: queryOverrides.selectedTypes ?? baseQuery.selectedTypes,
        };
        const params = buildRequestParams({
            page,
            limit: limit || state.pagination?.limit || DEFAULT_POKEMON_PAGE_SIZE,
            query,
        });
        const requestId = ++nextRequestId;
        const startedAt = Date.now();

        dispatch({
            type: POKEMONS_REQUEST,
            payload: { requestId, query },
        });

        try {
            const result = await requestPokemonPage(params, { force });
            await waitUntilMinimumLoadingTime(startedAt, minLoadingMs);

            if (preserveOnEmpty && result.pagination.total === 0) {
                dispatch({ type: POKEMONS_REQUEST_FINISHED, payload: { requestId } });
                return result;
            }

            dispatch({
                type: GET_POKEMONS,
                payload: result,
                meta: { requestId, query },
            });
            return result;
        } catch (error) {
            await waitUntilMinimumLoadingTime(startedAt, minLoadingMs);
            dispatch({
                type: POKEMONS_REQUEST_FAILED,
                payload: { requestId, message: error.message },
            });
            console.error("Error obtaining PokÃ©mon page:", error);
            if (!silent) alert("Error obtaining PokÃ©mons.");
            throw error;
        }
    };
};

const requestPokemonDetails = (id) => {
    const key = String(id);
    const cached = recentPokemonDetails.get(key);
    if (cached && Date.now() - cached.timestamp < DETAIL_CACHE_TTL) {
        return Promise.resolve(cached.data);
    }

    if (!pokemonDetailsRequestPromises.has(key)) {
        const request = axios(`/pokemon/${id}`)
            .then((response) => {
                const data = response.data;
                recentPokemonDetails.set(key, { data, timestamp: Date.now() });
                return data;
            })
            .finally(() => pokemonDetailsRequestPromises.delete(key));
        pokemonDetailsRequestPromises.set(key, request);
    }
    return pokemonDetailsRequestPromises.get(key);
};

export const deletePokemon = (id) => {
    return async (dispatch) => {
        try {
            await axios.delete(`/pokemon/${id}`);
            pokemonPageCache.clear();
            recentPokemonDetails.delete(String(id));
            dispatch({ type: REMOVE_POKEMON, payload: id });
            return true;
        } catch (error) {
            console.error("Error deleting Pokemon:", error);
            throw error;
        }
    };
};

export const getPokemonDetails = (id) => {
    return async (dispatch) => {
        try {
            const response = await requestPokemonDetails(id);
            dispatch({ type: GET_DETAILS, payload: response });
            return response;
        } catch (error) {
            alert("Error obtaining details.", error.message);
            throw error;
        }
    };
};
