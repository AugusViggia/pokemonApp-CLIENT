import {
  GET_POKEMONS,
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
  allPokemons: [],
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
  paginationResetKey: 0,
};

const reducer = (state = initialState, action) => {
        switch (action.type) {
          case GET_POKEMONS:
            return {
              ...state,
              pokemons: action.payload,
              allPokemons: action.payload,
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
              allPokemons: state.allPokemons.filter(removeById),
              paginationResetKey: state.paginationResetKey + 1,
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
              pokemons: state.allPokemons,
              searchTerm: "",
              originFilter: "all",
              selectedTypes: [],
              sortName: "all",
              sortAttack: "all",
              paginationResetKey: state.paginationResetKey + 1,
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
