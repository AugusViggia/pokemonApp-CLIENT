import {
  GET_POKEMONS,
  GET_DETAILS,
  GET_TYPES,
  FILTER_TYPE,
  SORT_ATTACK,
  SORT_NAME,
  FILTER_ORIGIN,
  SEARCH_NAME,
  RESET_FILTERS,
  SET_LOADING,
} from "../Actions/Actions-Types/action-types";

const initialState = {
  pokemons: [],
  types: [],

  details: [],

  filters: "all",

  loading: false,
};

const reducer = (state = initialState, action) => {
        switch (action.type) {
          case GET_POKEMONS:
            return {
              ...state,
              pokemons: action.payload,
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

          case FILTER_TYPE:
            return {
              ...state,
              pokemons: action.payload,
            };

          case SORT_ATTACK:
            return {
              ...state,
              pokemons: action.payload,
            };

          case SORT_NAME:
            return {
              ...state,
              pokemons: action.payload,
            };

          case FILTER_ORIGIN:
            return {
              ...state,
              originFilter: action.payload,
              pokemons: action.payload,
            };

          case SEARCH_NAME:
            return {
              ...state,
              pokemons: action.payload,
            };

          case RESET_FILTERS:
            return {
              ...state,
              filters: "all",
              pokemons: initialState.pokemons,
              types: initialState.types,
            };

          case SET_LOADING:
            return {
              ...state,
              loading: action.payload,
            };

          default:
            return {
              ...state,
            };
        }
};

export default reducer;