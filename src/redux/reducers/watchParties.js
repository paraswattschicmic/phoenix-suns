import { REHYDRATE } from 'redux-persist';
import { RESET, GET_WATCH_PARTIES_SUCCESS, SENDBIRD_CONNECTION_STATUS_UPDATE, } from '../actions';

const initialState = {
    watchParties: [],
    sendbirdConenctionStatus: false
};

const CommonReducer = (state = { ...initialState }, action) => {
    let data = action.payload;
    switch (action.type) {
        case GET_WATCH_PARTIES_SUCCESS:
            return {
                ...state,
                watchParties: data.spread ? [...state.watchParties, ...data.data] : [...data.data],
            };

        case SENDBIRD_CONNECTION_STATUS_UPDATE:
            return {
                ...state,
                sendbirdConenctionStatus: action.payload,
            };

        case REHYDRATE:
            return {
                ...initialState,
                ...((action.payload || {}).watchParties || {}),
                sendbirdConenctionStatus: true
            };
        case RESET:
            return {
                ...initialState
            };
        default:
            return {
                ...state
            };
    }
};

export default CommonReducer;
