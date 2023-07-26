import axios from "axios";
import { GET_POKEMONS, GET_DETAILS } from "../Actions-Types/action-types";

export const getPokemons = () => {
    return async function (dispatch) {
        try {
            const response = (await axios(`/pokemon`)).data;

            dispatch({ type: GET_POKEMONS, payload: response });
        } catch (error) {
            alert("Error obtaining Pokemons.", error.message);
        }
    };
};

export const getPokemonDetails = (id) => {
    return async (dispatch) => {
        try {
            const response = (await axios(`/pokemon/${id}`)).data;
            dispatch({ type: GET_DETAILS, payload: response });
        } catch (error) {
            alert("Error obtaining details.", error.message);
        }
    };
};
