import { takeLatest, all, put, takeEvery } from 'redux-saga/effects';
import { UPDATE_PROFILE_REQUEST, startLoading, stopLoading, UPLOAD_FILE_REQUEST, logoutRequest, GET_TIMEZONES_REQUEST, updateProfileSuccess, GET_PROFILE_REQUEST } from "../actions"
import { API } from "../../shared/constants/api"
import { putRequest, postRequest, getRequest } from "../../shared/services/axios"
import { TEXT_CONST } from "../../shared"

let { STATUS_CODE } = TEXT_CONST;

function* updateProfileSaga({ payload: { netConnected, payload = {}, success = () => { }, fail = () => { } } = {} }) {
    try {
        if (netConnected) {
            yield put(startLoading());
            const { data } = yield putRequest({
                API: API.UPDATE_PROFILE,
                DATA: { ...payload }
            })
            if (data.statusCode == STATUS_CODE.success) {
                yield put(updateProfileSuccess(data.data));
                success(data.data)
            } else if (data.statusCode == STATUS_CODE.unAuthorized) {
                fail(data.msg);
                yield put(logoutRequest());
            } else {
                fail(data.msg)
            }
        } else {
            fail(TEXT_CONST.INTERNET_ERROR)
        }
    }
    catch (error) {
        fail(JSON.stringify(error));
    }
    finally {
        yield put(stopLoading());
    }
}

function* getTimezoneRequest({ payload: { netConnected, skip = 0, limit = 100, success = () => { }, fail = () => { } } = {} }) {
    try {
        if (netConnected) {
            const { data = {} } = yield getRequest({
                API: API.TIMEZONES(`?skip=${skip}&limit=${limit}`),
            })

            if (data.statusCode == STATUS_CODE.success) {
                success(data.data || [])
            } else if (data.statusCode == STATUS_CODE.unAuthorized) {
                fail(data.msg);
                yield put(logoutRequest());
            } else {
                fail(data.msg)
            }
        } else {
            fail(TEXT_CONST.INTERNET_ERROR)
        }
    }
    catch (error) {
        console.log(error);
        fail(JSON.stringify(error));
    }
}
function* getProfileRequestSaga({ payload: { netConnected, headers = {}, success = () => { }, fail = () => { } } = {} }) {
    try {
        if (netConnected) {
            const { data = {} } = yield getRequest({
                API: API.GET_PROFILE,
                headers: { ...headers }
            })
            if (data.statusCode == STATUS_CODE.success) {
                success(data.data)
            } else if (data.statusCode == STATUS_CODE.unAuthorized) {
                fail(data.msg);
                yield put(logoutRequest());
            } else {
                fail(data.msg)
            }
        } else {
            fail(TEXT_CONST.INTERNET_ERROR)
        }
    }
    catch (error) {
        console.log(error);
        fail(JSON.stringify(error));
    }
}

function* uploadFileSaga({ payload: { netConnected, payload = {}, success = () => { }, fail = () => { } } = {} }) {

    try {
        if (netConnected) {
            yield put(startLoading());
            const formData = new FormData()
            formData.append("file", payload)
            const { data } = yield postRequest({
                API: API.UPLOAD_FILE,
                DATA: formData
            })
            if (data.statusCode == STATUS_CODE.success) {
                success(data.fileUrl)
            } else if (data.statusCode == STATUS_CODE.unAuthorized) {
                fail(data.msg);
                yield put(logoutRequest());
            } else {
                fail(data.msg)
            }
        } else {
            fail(TEXT_CONST.INTERNET_ERROR)
        }
    }
    catch (error) {
        fail(JSON.stringify(error));
    }
    finally {
        yield put(stopLoading());
    }
}

function* UserSaga() {
    yield all([
        takeEvery(UPDATE_PROFILE_REQUEST, updateProfileSaga),
        takeLatest(UPLOAD_FILE_REQUEST, uploadFileSaga),
        takeLatest(GET_TIMEZONES_REQUEST, getTimezoneRequest),
        takeLatest(GET_PROFILE_REQUEST, getProfileRequestSaga)
    ]);
}

export default UserSaga;