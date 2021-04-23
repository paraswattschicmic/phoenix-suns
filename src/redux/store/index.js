import { createStore, applyMiddleware } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import AsyncStorage from '@react-native-community/async-storage';
import RootReducer from '../reducers';
import RootSaga from '../sagas';
const sagaMiddleware = createSagaMiddleware();
/**
 * Persist config to persist(save/store) reducer
 */
const persistConfig = {
    key: "root",
    storage: AsyncStorage,
    blackList: []
};


/**
 * Persist reducer
 */
const persistedReducer = persistReducer(persistConfig, RootReducer);


/**
 * Create store with persisted reducer
 */
export const store = createStore(
    persistedReducer,
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(RootSaga);

export const persistor = persistStore(store);