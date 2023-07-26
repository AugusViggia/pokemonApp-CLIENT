import { SEARCH_NAME } from "../Actions-Types/action-types";
import axios from "axios";

export const searchName = (name) => {
    return async (dispatch) => {
        try {
            const response = (
                await axios(
                    `https://pokemonapp-api-production.up.railway.app/pokemon/?name=${name}`
                )
            ).data;

            dispatch({
                type: SEARCH_NAME,
                payload: response
            });
        } catch (error) {
            console.error(error);
            alert(`${name} was not found in Pokemons.`, error.message);
        }
    }
};