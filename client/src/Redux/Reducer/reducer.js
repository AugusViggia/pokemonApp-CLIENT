import {
  GET_POKEMONS,
  POKEMONS_REQUEST,
  POKEMONS_REQUEST_FINISHED,
  POKEMONS_REQUEST_FAILED,
  GET_DETAILS,
  REMOVE_POKEMON,
  GET_TYPES,
  FILTER_TYPE,
  SORT_ATTACK,
  SORT_NAME,
  FILTER_ORIGIN,
  SEARCH_NAME,
  SEARCH_NAME_INPUT,
  RESET_FILTERS,
  SET_LOADING,
  SET_FILTER_LOADING,
  SET_FILTER_REFRESH_LOADING,
} from "../Actions/Actions-Types/action-types";

const initialState = {
  pokemons: [],
  pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
  pokemonPageLoading: false,
  pokemonPageRequestId: null,
  pokemonPendingQuery: null,
  pokemonPageError: null,
  types: [],

  details: [],

  filters: "all",

  loading: false,
  filterLoading: false,
  filterRefreshLoading: false,
  searchTerm: "",
  originFilter: "all",
  selectedTypes: [],
  sortName: "all",
  sortAttack: "all",
};

const reducer = (state = initialState, action) => {
        switch (action.type) {
          case POKEMONS_REQUEST:
            return {
              ...state,
              pokemonPageLoading: true,
              pokemonPageRequestId: action.payload.requestId,
              pokemonPendingQuery: action.payload.query,
              pokemonPageError: null,
            };

          case GET_POKEMONS:
            if (action.meta.requestId !== state.pokemonPageRequestId) return state;
            return {
              ...state,
              pokemons: action.payload.data,
              pagination: action.payload.pagination,
              searchTerm: action.meta.query.searchTerm,
              selectedTypes: action.meta.query.selectedTypes,
              originFilter: action.meta.query.originFilter,
              sortName: action.meta.query.sortName,
              sortAttack: action.meta.query.sortAttack,
              pokemonPageLoading: false,
              pokemonPageRequestId: null,
              pokemonPendingQuery: null,
              pokemonPageError: null,
            };

          case POKEMONS_REQUEST_FINISHED:
            if (action.payload.requestId !== state.pokemonPageRequestId) return state;
            return {
              ...state,
              pokemonPageLoading: false,
              pokemonPageRequestId: null,
              pokemonPendingQuery: null,
            };

          case POKEMONS_REQUEST_FAILED:
            if (action.payload.requestId !== state.pokemonPageRequestId) return state;
            return {
              ...state,
              pokemonPageLoading: false,
              pokemonPageRequestId: null,
              pokemonPendingQuery: null,
              pokemonPageError: action.payload.message,
            };

          case GET_TYPES:
            return {
              ...state,
              types: action.payload,
            };

          case GET_DETAILS:
            return {
              ...state,
              details: action.payload,
            };

          case REMOVE_POKEMON: {
            const removedId = String(action.payload);
            const removeById = (pokemon) => String(pokemon?.id) !== removedId;

            return {
              ...state,
              pokemons: state.pokemons.filter(removeById),
              pagination: {
                ...state.pagination,
                total: Math.max(0, state.pagination.total - 1),
                totalPages: Math.ceil(Math.max(0, state.pagination.total - 1) / state.pagination.limit),
              },
            };
          }

          case FILTER_TYPE:
            return {
              ...state,
              pokemons: action.payload,
              selectedTypes: action.selectedTypes || [],
            };

          case SORT_ATTACK:
            return {
              ...state,
              pokemons: action.payload,
              sortAttack: action.sortBy || "all",
            };

          case SORT_NAME:
            return {
              ...state,
              pokemons: action.payload,
              sortName: action.sortOrder || "all",
            };

          case FILTER_ORIGIN:
            return {
              ...state,
              originFilter: action.origin || "all",
              pokemons: action.payload,
            };

          case SEARCH_NAME_INPUT:
            return {
              ...state,
              searchTerm: action.payload,
            };

          case SEARCH_NAME:
            return {
              ...state,
              pokemons: action.payload.pokemons,
              searchTerm: action.payload.searchTerm,
            };

          case RESET_FILTERS:
            return {
              ...state,
              filters: "all",
              searchTerm: "",
              originFilter: "all",
              selectedTypes: [],
              sortName: "all",
              sortAttack: "all",
              pagination: { ...state.pagination, page: 1 },
            };

          case SET_LOADING:
            return {
              ...state,
              loading: action.payload,
            };

          case SET_FILTER_LOADING:
            return {
              ...state,
              filterLoading: action.payload,
            };

          case SET_FILTER_REFRESH_LOADING:
            return {
              ...state,
              filterRefreshLoading: action.payload,
            };

          default:
            return {
              ...state,
            };
        }
};

export default reducer;
