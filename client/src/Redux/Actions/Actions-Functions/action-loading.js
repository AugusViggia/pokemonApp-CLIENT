import { SET_LOADING, SET_FILTER_LOADING, SET_FILTER_REFRESH_LOADING } from '../Actions-Types/action-types';

export const setLoading = (value) => ({
    type: SET_LOADING,
    payload: value,
});

export const setFilterLoading = (value) => ({
    type: SET_FILTER_LOADING,
    payload: value,
});

export const setFilterRefreshLoading = (value) => ({
    type: SET_FILTER_REFRESH_LOADING,
    payload: value,
});
