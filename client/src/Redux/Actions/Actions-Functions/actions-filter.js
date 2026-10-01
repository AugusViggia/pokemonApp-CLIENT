import {
    FILTER_TYPE,
    SORT_ATTACK,
    SORT_NAME,
    FILTER_ORIGIN,
    RESET_FILTERS,
} from "../Actions-Types/action-types";

const normalizeType = (type) => {
    const value = typeof type === "object" ? type?.name : type;
    return String(value || "").trim().toLowerCase();
};

const matchesOrigin = (pokemon, origin) => {
    if (origin === "data base") return pokemon.created === true;
    if (origin === "api") return pokemon.created === false;
    return true;
};

const matchesTypes = (pokemon, selectedTypes) => {
    if (!selectedTypes.length) return true;

    const pokemonTypes = (pokemon.types || []).map(normalizeType);
    return selectedTypes.every((type) => pokemonTypes.includes(normalizeType(type)));
};

const matchesName = (pokemon, searchTerm) => {
    const value = String(searchTerm || "").trim().toLowerCase();
    if (!value) return true;
    return String(pokemon.name || "").toLowerCase().includes(value);
};

const getFilteredPokemons = (state, selectedTypes = state.selectedTypes || [], origin = state.originFilter || "all", searchTerm = state.searchTerm || "") => {
    const source = state.allPokemons?.length ? state.allPokemons : state.pokemons;
    const normalizedTypes = selectedTypes.map(normalizeType).filter(Boolean).slice(0, 2);

    return source.filter((pokemon) =>
        matchesOrigin(pokemon, origin) &&
        matchesTypes(pokemon, normalizedTypes) &&
        matchesName(pokemon, searchTerm)
    );
};

export const filterByType = (types) => {
    return (dispatch, getState) => {
        try {
            const state = getState();
            const selectedTypes = (Array.isArray(types) ? types : [types])
                .map(normalizeType)
                .filter(Boolean)
                .slice(0, 2);

            const filteredPokemons = getFilteredPokemons(state, selectedTypes);

            dispatch({
                type: FILTER_TYPE,
                payload: filteredPokemons,
                selectedTypes,
            });

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };
};

export const sortByAttack = (sortBy) => {
    return (dispatch, getState) => {
        try {
            const pokemons = getState().pokemons.slice();
    
            if (sortBy === "attack-asc") {
                pokemons.sort((a, b) => a.attack - b.attack);
            } else if (sortBy === "attack-desc") {
                pokemons.sort((a, b) => b.attack - a.attack);
            }
    
            dispatch({ type: SORT_ATTACK, payload: pokemons, sortBy });
        } catch (error) {
            console.error(error);
            alert("Error sorting Pokémon by attack", error.message);
        }
    };
};

export const sortByName = (sortOrder) => {
    return (dispatch, getState) => {
        try {
            const pokemons = getState().pokemons.slice();
            
            if (sortOrder === "name-asc") {
                pokemons.sort((a, b) => a.name.localeCompare(b.name));
            } else if (sortOrder === "name-desc") {
                pokemons.sort((a, b) => b.name.localeCompare(a.name));
            }

            dispatch({ type: SORT_NAME, payload: pokemons, sortOrder });
        } catch (error) {
            console.error(error);
            alert("Error sorting Pokémon by name", error.message);
        }
    };
};

export const filterByOrigin = (origin) => {
    return (dispatch, getState) => {
        try {
            const state = getState();
            const selectedTypes = state.selectedTypes || [];
            const filteredOrigin = getFilteredPokemons(state, selectedTypes, origin);

            if (origin !== "all" && filteredOrigin.length === 0) {
                return false;
            }

            dispatch({
                type: FILTER_ORIGIN,
                payload: filteredOrigin,
                origin,
            });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    };
};

export const resetFilters = () => {
    return {
        type: RESET_FILTERS,
    };
};
