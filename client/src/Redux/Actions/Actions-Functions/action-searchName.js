import { getPokemons } from "./actions-pokemons";
import { setFilterLoading } from "./action-loading";

const MIN_FILTER_LOADING_TIME = 500;

export const searchName = (name) => {
    return async (dispatch, getState) => {
        const startedAt = Date.now();
        let keepLoadingUntilConfirmation = false;
        const searchValue = String(name || "").trim();
        const state = getState();
        const baseQuery = state.pokemonPendingQuery || state;

        dispatch(setFilterLoading(true));

        try {
            const result = await dispatch(getPokemons({
                page: 1,
                query: {
                    searchTerm: searchValue,
                    selectedTypes: baseQuery.selectedTypes || [],
                    originFilter: baseQuery.originFilter || "all",
                    sortName: baseQuery.sortName || "all",
                    sortAttack: baseQuery.sortAttack || "all",
                },
                preserveOnEmpty: Boolean(searchValue),
                silent: true,
            }));

            if (searchValue && result.pagination.total === 0) {
                keepLoadingUntilConfirmation = true;
                return "not-found";
            }
            return true;
        } catch (error) {
            console.error("Error searching PokÃ©mon:", error);
            return "error";
        } finally {
            const remaining = Math.max(0, MIN_FILTER_LOADING_TIME - (Date.now() - startedAt));
            if (remaining > 0) await new Promise((resolve) => setTimeout(resolve, remaining));
            if (!keepLoadingUntilConfirmation) dispatch(setFilterLoading(false));
        }
    };
};
