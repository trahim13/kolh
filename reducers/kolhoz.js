import { SET_ACTIVE_FARM, GET_ACTIVE_DISTRICT_ID, GET_ACTIVE_TECHNICS, GET_DISTRICTS_FARMS, GET_TECH_GROUP, GET_TECH_STATUS, SET_EDIT_TECHICS } from '../constants';

const INITIAL_STATE = {
    activeDistrictId: null,
    activeEditFarmId: null,
    activeFarm: null,
    activeTechnics: [],
    districtsFarms: [],
    techGroups: null,
    techStatus: null,
    editTechicsId: null
};

const kolhoz = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_ACTIVE_FARM:
            return { ...state, activeFarm: action.payload.id };
        case GET_ACTIVE_TECHNICS:
            return { ...state, activeTechnics: action.payload.arr };
        case GET_DISTRICTS_FARMS:
            return { ...state, districtsFarms: action.payload.arr };
        case GET_TECH_GROUP:
            return { ...state, techGroups: action.payload.arr };
        case GET_TECH_STATUS:
            return { ...state, techStatus: action.payload.arr };
        case SET_EDIT_TECHICS:
            return { ...state, editTechicsId: action.payload.id };
        case GET_ACTIVE_DISTRICT_ID:
            return { ...state, activeDistrictId: action.payload.id };
        default:
            return state;
    }
};

export default kolhoz;