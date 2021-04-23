export const GET_WATCH_PARTIES_REQUEST = 'GET_WATCH_PARTIES_REQUEST';
export const GET_WATCH_PARTIES_SUCCESS = 'GET_WATCH_PARTIES_SUCCESS';
export const SENDBIRD_CONNECTION_STATUS_UPDATE = 'SENDBIRD_CONNECTION_STATUS_UPDATE';

export const getWatchPartiesRequest = payload => {
    return {
        type: GET_WATCH_PARTIES_REQUEST,
        payload
    }
}

export const updateSendbirdConnectionStatus = payload => {
    return {
        type: SENDBIRD_CONNECTION_STATUS_UPDATE,
        payload
    }
}

export const getWatchPartiesSuccess = payload => {
    return {
        type: GET_WATCH_PARTIES_SUCCESS,
        payload
    }
}