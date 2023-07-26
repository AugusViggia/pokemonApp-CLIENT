import {
    FILTER_TYPE,
    SORT_ATTACK,
    SORT_NAME,
    FILTER_ORIGIN,
    RESET_FILTERS,
} from "../Actions-Types/action-types";

export const filterByType = (type) => {
    return (dispatch, getState) => {
        try {
            const pokemons = getState().pokemons;

            const filterTypePokemons = pokemons.filter((pokemon) =>
                pokemon.types.includes(type)
            );

            dispatch({ type: FILTER_TYPE, payload: filterTypePokemons });
        } catch (error) {
            console.error(error);
            alert(`No pokemon with ${type} found`, error.message);
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
    
            dispatch({ type: SORT_ATTACK, payload: pokemons });
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

            dispatch({ type: SORT_NAME, payload: pokemons });
        } catch (error) {
            console.error(error);
            alert("Error sorting Pokémon by name", error.message);
        }
    };
};

export const filterByOrigin = (origin) => {
    return (dispatch, getState) => {
        try {
            const pokemons = getState().pokemons;

            const filteredOrigin = pokemons.filter((pokemon) => {
                if (origin === "all") {
                    return true;
                } else if (origin === "data base") {
                    return isNaN(pokemon.id);
                } else if (origin === "api") {
                    return pokemon.id <= 1281;
                } else {
                    return false;
                }
            });

            dispatch({ type: FILTER_ORIGIN, payload: filteredOrigin });
        } catch (error) {
            console.error(error);
            alert("Error filtering Pokémon by origin", error.message);
        }
    };
};

export const resetFilters = () => {
    return {
        type: RESET_FILTERS,
    };
};