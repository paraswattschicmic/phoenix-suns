import { takeLatest, all, put, takeEvery } from 'redux-saga/effects';
import { logoutRequest, GET_WATCH_PARTIES_REQUEST, getWatchPartiesSuccess } from "../actions"
import { API } from "../../shared/constants/api"
import { getRequest } from "../../shared/services/axios"
import { TEXT_CONST } from "../../shared"

let { STATUS_CODE } = TEXT_CONST;

function* getWatchPartiesSaga({ payload: { netConnected, skip = 0, limit = 10, success = () => { }, fail = () => { } } = {} }) {
    try {
        if (netConnected) {
            const { data = {} } = yield getRequest({
                API: API.WATCH_PARTIES(`?skip=${skip}&limit=${limit}&filter=2&sortKey=startTime&sortOrder=1`),
            })
            if (data.statusCode == STATUS_CODE.success) {
                yield put(getWatchPartiesSuccess({ data: ((data.data || {}).watchPartyListing || []), spread: !!skip }));
                success(data.data.totalCount || 0)
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
}


function* WatchPartiesSaga() {
    yield all([
        takeEvery(GET_WATCH_PARTIES_REQUEST, getWatchPartiesSaga),
    ]);
}

export default WatchPartiesSaga;