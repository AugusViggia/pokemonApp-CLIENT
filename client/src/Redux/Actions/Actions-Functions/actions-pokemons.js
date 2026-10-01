import axios from "axios";
import { GET_POKEMONS, GET_DETAILS, REMOVE_POKEMON } from "../Actions-Types/action-types";

let pokemonsRequestPromise = null;
let cachedPokemons = null;
const pokemonDetailsRequestPromises = new Map();
const recentPokemonDetails = new Map();
const DETAIL_CACHE_TTL = 1000;

const requestPokemons = ({ force = false } = {}) => {
    if (force) {
        cachedPokemons = null;
    }

    if (!force && cachedPokemons) {
        return Promise.resolve(cachedPokemons);
    }

    if (!force && pokemonsRequestPromise) {
        return pokemonsRequestPromise;
    }

    const request = axios("/pokemon")
        .then((response) => {
            cachedPokemons = response.data;
            return cachedPokemons;
        })
        .finally(() => {
            if (pokemonsRequestPromise === request) {
                pokemonsRequestPromise = null;
            }
        });

    if (!force) {
        pokemonsRequestPromise = request;
    }

    return request;
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
                recentPokemonDetails.set(key, {
                    data,
                    timestamp: Date.now(),
                });
                return data;
            })
            .finally(() => {
                pokemonDetailsRequestPromises.delete(key);
            });

        pokemonDetailsRequestPromises.set(key, request);
    }

    return pokemonDetailsRequestPromises.get(key);
};

export const getPokemons = ({ silent = false, force = false } = {}) => {
    return async function (dispatch) {
        try {
            const response = await requestPokemons({ force });
            dispatch({ type: GET_POKEMONS, payload: response });
            return response;
        } catch (error) {
            console.error("Error obtaining Pokemons:", error);
            if (!silent) {
                alert("Error obtaining Pokemons.");
            }
            throw error;
        }
    };
};

export const deletePokemon = (id) => {
    return async (dispatch) => {
        try {
            await axios.delete(`/pokemon/${id}`);
            cachedPokemons = cachedPokemons
                ? cachedPokemons.filter((pokemon) => String(pokemon?.id) !== String(id))
                : null;
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
