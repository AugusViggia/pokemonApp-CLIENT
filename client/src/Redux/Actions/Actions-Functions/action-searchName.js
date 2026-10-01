import { SEARCH_NAME } from "../Actions-Types/action-types";
import { setFilterLoading } from "./action-loading";

const MIN_FILTER_LOADING_TIME = 500;

const normalizeType = (type) => {
    const value = typeof type === "object" ? type?.name : type;
    return String(value || "").trim().toLowerCase();
};

export const searchName = (name) => {
    return async (dispatch, getState) => {
        const startedAt = Date.now();
        let keepLoadingUntilConfirmation = false;
        const searchValue = name.trim().toLowerCase();
        const state = getState();
        const allPokemons = state.allPokemons || [];
        const originFilter = state.originFilter || "all";
        const selectedTypes = state.selectedTypes || [];

        dispatch(setFilterLoading(true));

        try {
            const pokemonsByOrigin = allPokemons.filter((pokemon) => {
                if (originFilter === "data base") {
                    return pokemon.created === true;
                }

                if (originFilter === "api") {
                    return pokemon.created === false;
                }

                return true;
            });

            const pokemonsByType = pokemonsByOrigin.filter((pokemon) => {
                if (!selectedTypes.length) return true;
                const pokemonTypes = (pokemon.types || []).map(normalizeType);
                return selectedTypes.every((type) => pokemonTypes.includes(normalizeType(type)));
            });

            const filteredPokemons = searchValue
                ? pokemonsByType.filter((pokemon) =>
                    (pokemon.name || "").toLowerCase().includes(searchValue)
                )
                : pokemonsByType;

            if (searchValue && filteredPokemons.length === 0) {
                keepLoadingUntilConfirmation = true;
                return "not-found";
            }

            dispatch({
                type: SEARCH_NAME,
                payload: {
                    pokemons: filteredPokemons,
                    searchTerm: name.trim(),
                },
            });

            return true;
        } catch (error) {
            console.error(error);
            return "error";
        } finally {
            const elapsed = Date.now() - startedAt;
            const remaining = Math.max(0, MIN_FILTER_LOADING_TIME - elapsed);

            if (remaining > 0) {
                await new Promise((resolve) => setTimeout(resolve, remaining));
            }

            if (!keepLoadingUntilConfirmation) {
                dispatch(setFilterLoading(false));
            }
        }
    };
};
