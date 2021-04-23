import { all, fork } from 'redux-saga/effects';
import AuthSaga from './auth';
import UserSaga from './user';
import ChatRoomSaga from './chatRooms';
import WatchPartiesSaga from './watchParties';

function* dataSaga() {
    yield all([
        fork(AuthSaga),
        fork(UserSaga),
        fork(ChatRoomSaga),
        fork(WatchPartiesSaga)
    ]);
}


export default dataSaga;
