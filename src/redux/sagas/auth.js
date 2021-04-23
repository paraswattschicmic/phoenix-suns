import { takeLatest, all, put, takeLeading } from 'redux-saga/effects';
import {
  SOCIAL_LOGIN_REQUEST,
  reset,
  startLoading,
  stopLoading,
  LOGOUT_REQUEST,
  updateAuthTokenRedux,
  updateProfileSuccess,
  logoutRequest, PHONE_LOGIN_REQUEST, VERIFY_OTP_LOGIN_REQUEST
} from '../actions';
import { API } from '../../shared/constants/api';
import { postRequest, updateAuthToken } from '../../shared/services/axios';
import {
  TEXT_CONST,
  navigate,
  replace,
  INITIAL_SIGNUP_SCREEN,
  DASHBOARD_BOTTOM_TAB,
} from '../../shared';
import { store } from '../store';

let { STATUS_CODE } = TEXT_CONST;

function* socialLoginSaga({
  payload: {
    netConnected,
    payload = {},
    success = () => { },
    fail = () => { },
  } = {},
}) {
  try {
    if (netConnected) {
      yield put(startLoading());
      const { data = {} } = yield postRequest({
        API: API.SOCIAL_LOGIN,
        DATA: { ...payload },
      });
      if (data.statusCode == STATUS_CODE.success) {
        updateAuthToken(data.token);
        yield put(updateAuthTokenRedux(data.token));
        yield put(updateProfileSuccess(data.data));
        success(data.data.isNewUser || '', data.data.firstName || '');
      } else if (data.statusCode == STATUS_CODE.unAuthorized) {
        fail('data.msg');
        console.log('errror');
        yield put(logoutRequest());
      } else {
        console.log('errror');
        fail(data.msg);
      }
    } else {
      console.log('errror');
      fail(TEXT_CONST.INTERNET_ERROR);
    }
  } catch (error) {
    fail(JSON.stringify(error));
    console.log('errror', error);
  } finally {
    yield put(stopLoading());
  }
}


function* verifyOTPSaga({
  payload: {
    netConnected,
    payload = {},
    success = () => { },
    fail = () => { },
  } = {},
}) {
  try {
    if (netConnected) {
      yield put(startLoading());
      const { data = {} } = yield postRequest({
        API: API.VERIFY_OTP,
        DATA: { ...payload },
      });
      if (data.statusCode == STATUS_CODE.success) {
        updateAuthToken(data.token);
        yield put(updateAuthTokenRedux(data.token));
        yield put(updateProfileSuccess(data.data));
        success(data.data.isNewUser || '', data.data.firstName || '', data.data.email || '');
      } else if (data.statusCode == STATUS_CODE.unAuthorized) {
        fail('Something went wrong.');
        console.log('errror');
        yield put(logoutRequest());
      } else {
        console.log('errror');
        fail(data.msg);
      }
    } else {
      console.log('errror');
      fail(TEXT_CONST.INTERNET_ERROR);
    }
  } catch (error) {
    fail(JSON.stringify(error));
    console.log('errror', error);
  } finally {
    yield put(stopLoading());
  }
}


function* phoneLoginSaga({
  payload: {
    netConnected,
    payload = {},
    success = () => { },
    fail = () => { },
  } = {},
}) {
  try {
    if (netConnected) {
      yield put(startLoading());
      const { data = {} } = yield postRequest({
        API: API.PHONE_LOGIN,
        DATA: { ...payload },
      });
      if (data.statusCode == STATUS_CODE.success) {
        success(data.msg ? data.msg : '');
      } else if (data.statusCode == STATUS_CODE.unAuthorized) {
        fail('data.msg');
        console.log('errror');
        yield put(logoutRequest());
      } else {
        console.log('errror');
        fail(data.msg);
      }
    } else {
      console.log('errror');
      fail(TEXT_CONST.INTERNET_ERROR);
    }
  } catch (error) {
    fail(JSON.stringify(error));
    console.log('errror', error);
  } finally {
    yield put(stopLoading());
  }
}

function* logoutSaga({ payload: { } = {} }) {
  try {
    yield put(startLoading());
    updateAuthToken('');
    try {
      let {
        common: { userData },
      } = store.getState();
      userData.timezone && navigate(DASHBOARD_BOTTOM_TAB);
    } catch (error) {
      console.log(error);
    }
    replace(INITIAL_SIGNUP_SCREEN);
    yield put(reset());
  } catch (error) {
    console.log(error);
  } finally {
    yield put(stopLoading());
  }
}

function* AuthSaga() {
  yield all([
    takeLatest(SOCIAL_LOGIN_REQUEST, socialLoginSaga),
    takeLeading(PHONE_LOGIN_REQUEST, phoneLoginSaga),
    takeLeading(VERIFY_OTP_LOGIN_REQUEST, verifyOTPSaga),
    takeLatest(LOGOUT_REQUEST, logoutSaga),
  ]);
}

export default AuthSaga;
