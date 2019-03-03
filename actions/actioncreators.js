import { SET_ACTIVE_FARM, GET_ACTIVE_DISTRICT_ID, GET_ACTIVE_TECHNICS, GET_DISTRICTS_FARMS, GET_TECH_GROUP, GET_TECH_STATUS, SET_EDIT_TECHICS } from '../constants';

export const SET_ACTIVE_FARM_ACTION = (id = null) => ({
    type: SET_ACTIVE_FARM,
    payload: {
        id
    }
});
export const GET_DISTRICTS_FARMS_ACTION = (arr) => ({
    type: GET_DISTRICTS_FARMS,
    payload: {
        arr
    }
});

export const GET_ACTIVE_TECHNICS_ACTION = (arr) => ({
    type: GET_ACTIVE_TECHNICS,
    payload: {
        arr
    }
});
export const GET_TECH_GROUP_ACTION = (arr) => ({
    type: GET_TECH_GROUP,
    payload: {
        arr
    }
});

export const GET_TECH_STATUS_ACTION = (arr) => ({
    type: GET_TECH_STATUS,
    payload: {
        arr
    }
});

export const SET_EDIT_TECHICS_ACTION = (id = null) => ({
    type: SET_EDIT_TECHICS,
    payload: {
        id
    }
});

export const GET_ACTIVE_DISTRICT_ID_ACTION = (id) => ({
    type: GET_ACTIVE_DISTRICT_ID,
    payload: {
        id
    }
});