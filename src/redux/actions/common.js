export const RESET = 'RESET';
export const START_LOADING = 'START_LOADING';
export const STOP_LOADING = 'STOP_LOADING';
export const UPDATE_INTERNET_STATUS = 'UPDATE_INTERNET_STATUS';
export const SET_USER_LOCATION = 'SET_USER_LOCATION';
export const SET_NEVER_ASK_PERMISSION = 'SET_NEVER_ASK_PERMISSION';
export const SET_GPS_ENABLED = 'SET_GPS_ENABLED';
export const SET_LOCATION_ENABLED = 'SET_LOCATION_ENABLED';

export const setUserLocation = userLocation => ({
    type: SET_USER_LOCATION,
    userLocation
});

export const setNeverAskPermission = neverAskPermission => ({
    type: SET_NEVER_ASK_PERMISSION,
    neverAskPermission
});

export const setGpsEnabled = gpsEnabled => ({
    type: SET_GPS_ENABLED,
    gpsEnabled
});

export const setLocationEnabled = locationEnabled => ({
    type: SET_LOCATION_ENABLED,
    locationEnabled
});


export const startLoading = () => {
    return {
        type: START_LOADING
    }
}

export const stopLoading = () => {
    return {
        type: STOP_LOADING
    }
}

export const reset = () => {
    return {
        type: RESET
    }
}

export const updateInternetStatus = (payload) => {
    return {
        type: UPDATE_INTERNET_STATUS,
        payload
    }
}