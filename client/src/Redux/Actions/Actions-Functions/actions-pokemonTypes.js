import axios from "axios";
import { GET_TYPES } from "../Actions-Types/action-types";

// Share the same request when React StrictMode (development) mounts this
// component twice, and reuse the result for the rest of the session.
let typesCache = null;
let typesRequestPromise = null;

export const getTypes = () => {
    return async (dispatch) => {
        if (typesCache) {
            dispatch({ type: GET_TYPES, payload: typesCache });
            return typesCache;
        }

        if (!typesRequestPromise) {
            typesRequestPromise = axios(`/type`)
                .then((response) => response.data)
                .then((data) => {
                    typesCache = data || [];
                    return typesCache;
                })
                .finally(() => {
                    typesRequestPromise = null;
                });
        }

        try {
            const response = await typesRequestPromise;
            dispatch({ type: GET_TYPES, payload: response });
            return response;
        } catch (error) {
            console.error("Error obtaining types:", error);
            alert("Error obtaining types");
            throw error;
        }
    };
};
