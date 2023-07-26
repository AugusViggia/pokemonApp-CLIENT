import { SET_LOADING } from '../Actions-Types/action-types';

export const setLoading = (value) => ({
    type: SET_LOADING,
    payload: value,
});