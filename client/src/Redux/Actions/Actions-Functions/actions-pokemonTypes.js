import axios from "axios";
import { GET_TYPES } from "../Actions-Types/action-types";

export const getTypes = () => {
    return async (dispatch) => {
        try {
            const response = (
                await axios(
                    `https://pokemonapp-api-production.up.railway.app/type`
                )
            ).data;
            dispatch({ type: GET_TYPES, payload: response });
        } catch (error) {
            alert("Error obtaining types", error.message);
        }
    };
};
