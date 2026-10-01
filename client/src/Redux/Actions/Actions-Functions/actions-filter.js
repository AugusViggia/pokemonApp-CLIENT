import { getPokemons } from "./actions-pokemons";

const normalizeType = (type) => {
    const value = typeof type === "object" ? type?.name : type;
    return String(value || "").trim().toLowerCase();
};

const getCurrentQuery = (state) => {
    const source = state.pokemonPendingQuery || state;
    return {
        searchTerm: source.searchTerm || "",
        selectedTypes: (source.selectedTypes || []).map(normalizeType).filter(Boolean).slice(0, 2),
        originFilter: source.originFilter || "all",
        sortName: source.sortName || "all",
        sortAttack: source.sortAttack || "all",
    };
};

const fetchWithQuery = (query, { preserveOnEmpty = false } = {}) => async (dispatch) => {
    try {
        return await dispatch(getPokemons({
            page: 1,
            query,
            preserveOnEmpty,
            silent: true,
        }));
    } catch (error) {
        return false;
    }
};

export const filterByType = (types) => (dispatch, getState) => {
    const selectedTypes = (Array.isArray(types) ? types : [types])
        .map(normalizeType)
        .filter(Boolean)
        .slice(0, 2);
    return dispatch(fetchWithQuery({
        ...getCurrentQuery(getState()),
        selectedTypes,
    }));
};

export const sortByAttack = (sortAttack) => (dispatch, getState) =>
    dispatch(fetchWithQuery({
        ...getCurrentQuery(getState()),
        sortAttack,
    }));

export const sortByName = (sortName) => (dispatch, getState) =>
    dispatch(fetchWithQuery({
        ...getCurrentQuery(getState()),
        sortName,
    }));

export const filterByOrigin = (originFilter) => async (dispatch, getState) => {
    const result = await dispatch(fetchWithQuery({
        ...getCurrentQuery(getState()),
        originFilter,
    }, { preserveOnEmpty: true }));
    return result === false || result?.pagination?.total === 0 ? false : result;
};

export const resetFilters = () => (dispatch) =>
    dispatch(fetchWithQuery({
        searchTerm: "",
        selectedTypes: [],
        originFilter: "all",
        sortName: "all",
        sortAttack: "all",
    }));
