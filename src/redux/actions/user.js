export const GET_TIMEZONES_REQUEST = 'GET_TIMEZONES_REQUEST';
export const UPDATE_AUTH_TOKEN = 'UPDATE_AUTH_TOKEN';
export const UPDATE_PROFILE_REQUEST = 'UPDATE_PROFILE_REQUEST';
export const UPDATE_PROFILE_SUCCESS = 'UPDATE_PROFILE_SUCCESS';
export const UPLOAD_FILE_REQUEST = 'UPLOAD_FILE_REQUEST';
export const GET_PROFILE_REQUEST = 'GET_PROFILE_REQUEST';
export const UPDATE_FACEBOOK_DATA = 'UPDATE_FACEBOOK_DATA';
export const UPDATE_APPLE_DATA = 'UPDATE_APPLE_DATA';

export const getTimezoneRequest = (payload) => {
  return {
    type: GET_TIMEZONES_REQUEST,
    payload,
  };
};

export const updateAuthTokenRedux = (payload) => {
  return {
    type: UPDATE_AUTH_TOKEN,
    payload,
  };
};

export const updateProfileRequest = (payload) => {
  return {
    type: UPDATE_PROFILE_REQUEST,
    payload,
  };
};

export const updateProfileSuccess = (payload) => {
  return {
    type: UPDATE_PROFILE_SUCCESS,
    payload,
  };
};
export const updateFacebookData = (payload) => {
  return {
    type: UPDATE_FACEBOOK_DATA,
    payload,
  };
};

export const updateAppleData = (payload) => {
  return {
    type: UPDATE_APPLE_DATA,
    payload,
  };
};

export const uploadFileRequest = (payload) => {
  return {
    type: UPLOAD_FILE_REQUEST,
    payload,
  };
};
export const getProfileRequest = (payload) => {
  return {
    type: GET_PROFILE_REQUEST,
    payload,
  };
};
