import axios from "axios";
import pickBy from "lodash/pickBy";
import { BASE_URL } from '../constants';
// const { defaultConfig: { } } = require(`../config/default`);

const defaulHeader = {
    headers: {
        "content-type": "application/json"
    }
};

const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 50000,
    defaulHeader
});

const requestWithoutAuth = axios.create({
    baseURL: BASE_URL,
    timeout: 50000,
    defaulHeader
});

export const postRequestNoAuth = ({
    API = "",
    DATA = {},
    HEADER = {},
    PAYLOAD
}) => {
    return new Promise((resolve, reject) => {
        requestWithoutAuth
            .post(API, pickBy(DATA, val => ![""].includes(val)), {
                ...(PAYLOAD ? PAYLOAD : { ...defaulHeader.headers, ...HEADER })
            })
            .then(result => {
                resolve(result);
            })
            .catch(error => {
                resolve(error.response);
            });
    });
};

export const updateAuthToken = (token = '') => {
    instance.defaults.headers = {
        ...instance.defaults.headers,
        ...{ Authorization: token }
    };
};

export const postRequest = ({ API = "", DATA = {}, HEADER = {}, PAYLOAD }) => {
    return new Promise((resolve, reject) => {
        instance
            .post(apiWithAuth(API), DATA, {
                ...(PAYLOAD ? PAYLOAD : { ...defaulHeader.headers, ...HEADER })
            })
            .then(result => {
                resolve(result);
            })
            .catch(error => {
                resolve(error.response);
            });
    });
};

export const updateHeader = (HEADER) => {
    instance.defaults.headers = {
        ...instance.defaults.headers,
        ...HEADER
    };
}

export const getRequest = ({
    API = "",
    HEADER = {},
    headers = {},
    params = {},
    data = {}
}) => {
    updateHeader(HEADER)
    return new Promise((resolve, reject) => {
        instance
            .get(apiWithAuth(API), {
                ...defaulHeader.headers,
                ...(params && pickBy(params, val => ![""].includes(val))),
                ...(headers && pickBy(headers, val => ![""].includes(val)))
            })
            .then(result => {
                resolve(result);
            })
            .catch(error => {
                resolve(error.response);
            });
    });
};

export const putRequest = ({
    API = "",
    DATA = {},
    PAYLOAD,
    HEADER = {}
}) => {
    return new Promise((resolve, reject) => {
        instance
            .put(apiWithAuth(API), DATA, {
                ...(PAYLOAD
                    ? pickBy(DATA, val => ![""].includes(val))
                    : { ...defaulHeader.headers, ...HEADER })
            })
            .then(result => {
                resolve(result);
            })
            .catch(error => {
                resolve(error.response);
            });
    });
};

export const deleteRequest = ({
    API = "",
    DATA = {},
    PAYLOAD,
    HEADER = {}
}) => {
    return new Promise((resolve, reject) => {
        instance
            .delete(apiWithAuth(API), {
                headers:
                {
                    ...(PAYLOAD
                        ? pickBy(DATA, val => ![""].includes(val))
                        : { ...defaulHeader.headers, ...HEADER })
                }
                , data: DATA
            })
            .then(result => {
                resolve(result);
            })
            .catch(error => {
                resolve(error.response);
            });
    });
};

export const patchRequest = ({ API = "", DATA = {}, PAYLOAD, HEADER = {} }) => {
    return new Promise((resolve, reject) => {
        instance
            .patch(apiWithAuth(API), DATA, {
                ...(PAYLOAD
                    ? pickBy(DATA, val => ![""].includes(val))
                    : { ...defaulHeader.headers, ...HEADER })
            })
            .then(result => {
                resolve(result);
            })
            .catch(error => {
                resolve(error.response);
            });
    });
};

export const apiWithAuth = api => {
    return api;
};

export default instance;
