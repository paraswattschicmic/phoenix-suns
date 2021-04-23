import { combineReducers } from 'redux';
import { reducer as FormReducer } from "redux-form";
import CommonReducer from './common';
import ChatReducer from './chat';
import RoomsReducer from './chatRooms';
import WatchPartiesReducer from './watchParties';

const RootReducer = combineReducers({
    common: CommonReducer,
    form: FormReducer,
    chatReducer: ChatReducer,
    roomsReducer: RoomsReducer,
    watchParties: WatchPartiesReducer,
})

export default RootReducer;