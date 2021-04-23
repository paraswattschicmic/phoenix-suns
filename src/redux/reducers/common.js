import {REHYDRATE} from 'redux-persist';
import {
  START_LOADING,
  UPDATE_FACEBOOK_DATA,
  UPDATE_APPLE_DATA,
  STOP_LOADING,
  RESET,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_AUTH_TOKEN,
  UPDATE_INTERNET_STATUS,
  SET_LOCATION_ENABLED,
  SET_NEVER_ASK_PERMISSION,
  SET_GPS_ENABLED,
} from '../actions';

const initialState = {
  authToken: '',
  userData: {},
  loading: false,
  netConnected: true,
  gpsEnabled: false,
  locationEnabled: false,
  neverAskPermission: false,
  facebookData: '',
  appleData: '',
};

const CommonReducer = (state = {...initialState}, action) => {
  switch (action.type) {
    case SET_GPS_ENABLED:
      return {
        ...state,
        gpsEnabled: action.gpsEnabled || false,
      };
    case SET_LOCATION_ENABLED:
      return {
        ...state,
        locationEnabled: action.locationEnabled || false,
      };
    case SET_NEVER_ASK_PERMISSION:
      return {
        ...state,
        neverAskPermission: action.neverAskPermission || false,
      };
    case START_LOADING:
      return {
        ...state,
        loading: true,
      };
    case STOP_LOADING:
      return {
        ...state,
        loading: false,
      };
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        userData: {...state.userData, ...action.payload},
      };
    case UPDATE_FACEBOOK_DATA:
      return {
        ...state,
        facebookData: action.payload,
      };
    case UPDATE_APPLE_DATA:
      return {
        ...state,
        appleData: action.payload,
      };
    case UPDATE_INTERNET_STATUS:
      return {
        ...state,
        netConnected: action.payload,
      };
    case UPDATE_AUTH_TOKEN:
      return {
        ...state,
        authToken: action.payload,
      };

    case REHYDRATE:
      return {
        ...initialState,
        ...((action.payload || {}).common || {}),
        loading: false,
      };
    case RESET:
      return {
        ...initialState,
        netConnected: state.netConnected,
      };
    default:
      return {
        ...state,
      };
  }
};

export default CommonReducer;
