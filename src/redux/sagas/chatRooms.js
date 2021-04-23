/* eslint-disable prettier/prettier */
import { takeLatest, all, put, takeEvery, takeLeading } from 'redux-saga/effects';
import { logoutRequest, GET_USER_ROOMS, JOIN_CHAT_ROOM, DISLIKE_MESSAGE, GET_CHAT_LIST, SEND_MESSAGE, getUserRoomListSuccess, getChatListSuccess, LIKE_MESSAGE, REQUEST_BAN_USER, REQUEST_FLAG_MESSAGE } from "../actions"
import { API } from "../../shared/constants/api"
import { getRequest, postRequest, putRequest, deleteRequest } from "../../shared/services/axios"
import { TEXT_CONST } from "../../shared"
import { CONFIG_APP_ID, CONFIG_API_TOKEN as CONFIG_API_TOKEN } from '../../shared/constants/sendbird';

let { STATUS_CODE } = TEXT_CONST;

function* getChatRoomSaga({ payload: { netConnected, nextPageToken = 0, limit = 10, success = () => { }, fail = () => { } } = {} }) {
    try {
        if (netConnected) {
            let url = API.CHAT_ROOMS(`/getGroups?${`nextPageToken=${nextPageToken}`}&limit=${limit}`)
            const { data = {} } = yield getRequest({
                API: API.CHAT_ROOMS(`/getGroups?${`nextPageToken=${nextPageToken}`}&limit=${limit}`),
            })
            if (data.statusCode == STATUS_CODE.success) {
                yield put(getUserRoomListSuccess({ data: ((data.data || {}).channels || []), spread: !!nextPageToken, nextPageToken: data.data.next ? data.data.next : null }));
                let totalCount = 0;
                if (data.data.channels && data.data.channels.length && data.data.channels.length > 0) {
                    totalCount = data.data.channels.length;
                }
                success(totalCount)
            } else if (data.statusCode == STATUS_CODE.unAuthorized) {
                fail(data.msg);
                // yield put(logoutRequest());
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

function* joinChatRoomSaga({ payload: { netConnected, body = {}, success = () => { }, fail = () => { } } = {} }) {
    try {
        if (netConnected) {
            console.log('SAAGA');
            let joinChatUrl = '';
            if (body.password) {
                joinChatUrl = API.CHAT_ROOMS(`/joinGroup?watchPartyId=${body.watchPartyId}&password=${body.password}`)
            }
            else {
                joinChatUrl = API.CHAT_ROOMS(`/joinGroup?watchPartyId=${body.watchPartyId}`)
            }
            console.log('joinChatUrl', joinChatUrl)
            const { data = {} } = yield getRequest({
                API: joinChatUrl
            });
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
        fail(JSON.stringify(error));
    }
}
function* requestBanUserSaga({ payload: { netConnected, body = {}, success = () => { }, fail = () => { } } = {} }) {
    try {
        if (netConnected) {
            const { data = {} } = yield postRequest({
                API: API.BAN_USER,
                DATA: { ...body },
            });
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
        fail(JSON.stringify(error));
    }
}

function* requestFlagMessageSaga({ payload: { netConnected, body = {}, success = () => { }, fail = () => { } } = {} }) {
    try {
        if (netConnected) {
            const { data = {} } = yield deleteRequest({
                API: API.FLAG_MESSAGE,
                DATA: { ...body },
            });
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
        fail(JSON.stringify(error));
    }
}

function* getChatListSaga({ payload: { channelUrl, body = {}, success = () => { }, fail = () => { } } }) {
    try {
        if (true) {
            const response = yield getRequest({
                API: `https://api-${CONFIG_APP_ID}.sendbird.com/v3/group_channels/${channelUrl}`,
                HEADER: {
                    'Api-Token': CONFIG_API_TOKEN,
                    'Content-Type': 'application/json, charset=utf8'
                }
            });
            if (response.status == STATUS_CODE.success) {
                // success(data.data)
                if (response.data.last_message) {
                    const chatListResponse = yield getRequest({
                        API: `https://api-${CONFIG_APP_ID}.sendbird.com/v3/group_channels/${channelUrl}/messages?message_id=${response.data.last_message.message_id}&reverse=true&include_reactions=true`,
                        HEADER: {
                            'Api-Token': CONFIG_API_TOKEN,
                            'Content-Type': 'application/json, charset=utf8'
                        }
                    });
                    const markAsReadResponse = yield putRequest({
                        API: `https://api-${CONFIG_APP_ID}.sendbird.com/v3/group_channels/${channelUrl}/messages/mark_as_read`,
                        HEADER: {
                            'Api-Token': CONFIG_API_TOKEN,
                            'Content-Type': 'application/json, charset=utf8'
                        },
                        DATA: { ...body }
                    });
                    yield put(getChatListSuccess(chatListResponse.data.messages))
                }
            }
            //else if (data.statusCode == STATUS_CODE.unAuthorized) {
            //     fail(data.msg);
            //     yield put(logoutRequest());
            // } else {
            //     // fail(data.msg)
            // }
        } else {
            // fail(TEXT_CONST.INTERNET_ERROR)
        }
    }
    catch (error) {
        console.log('error', error)
        // fail(JSON.stringify(error));
    }
}

function* sendMessageSaga({ payload: { channelUrl, body = {}, success = () => { }, fail = () => { } } }) {
    try {
        if (true) {
            const response = yield postRequest({
                API: `https://api-${CONFIG_APP_ID}.sendbird.com/v3/group_channels/${channelUrl}/messages`,
                HEADER: {
                    'Api-Token': CONFIG_API_TOKEN,
                    'Content-Type': 'application/json, charset=utf8'
                },
                DATA: { ...body }

            });
            if (response.status == STATUS_CODE.success) {
                success(response.data.data)
            }
            else if (response.status == STATUS_CODE.unAuthorized) {
                // fail(response.msg);
                yield put(logoutRequest());
            } else {
                // fail(response.msg)
            }
        } else {
            // fail(TEXT_CONST.INTERNET_ERROR)
        }
    }
    catch (error) {
        fail(JSON.stringify(error));
    }
}
function* likeMessageSaga({ payload: { channelUrl, messageID, body = {}, success = () => { }, fail = () => { } } }) {
    try {
        if (true) {
            const response = yield postRequest({
                API: `https://api-${CONFIG_APP_ID}.sendbird.com/v3/group_channels/${channelUrl}/messages/${messageID}/reactions`,
                HEADER: {
                    'Api-Token': CONFIG_API_TOKEN,
                    'Content-Type': 'application/json, charset=utf8'
                },
                DATA: { ...body }

            });
            if (response.status == STATUS_CODE.success) {
                success(response.data.data)
            }
            else if (response.status == STATUS_CODE.unAuthorized) {
                // fail(response.msg);
                yield put(logoutRequest());
            } else {
                // fail(response.msg)
            }
        } else {
            // fail(TEXT_CONST.INTERNET_ERROR)
        }
    }
    catch (error) {
        fail(JSON.stringify(error));
    }
}

function* dislikeMessageSaga({ payload: { channelUrl, messageID, body = {}, success = () => { }, fail = () => { } } }) {
    try {
        if (true) {
            const response = yield deleteRequest({
                API: `https://api-${CONFIG_APP_ID}.sendbird.com/v3/group_channels/${channelUrl}/messages/${messageID}/reactions`,
                HEADER: {
                    'Api-Token': CONFIG_API_TOKEN,
                    'Content-Type': 'application/json, charset=utf8'
                },
                DATA: { ...body }

            });
            if (response.status == STATUS_CODE.success) {
                success(response.data.data)
            }
            else if (response.status == STATUS_CODE.unAuthorized) {
                // fail(response.msg);
                yield put(logoutRequest());
            } else {
                // fail(response.msg)
            }
        } else {
            // fail(TEXT_CONST.INTERNET_ERROR)
        }
    }
    catch (error) {
        fail(JSON.stringify(error));
    }
}

function* ChatRoomSaga() {
    yield all([
        takeLatest(GET_USER_ROOMS, getChatRoomSaga),
        takeLeading(JOIN_CHAT_ROOM, joinChatRoomSaga),
        takeLeading(REQUEST_BAN_USER, requestBanUserSaga),
        takeLeading(REQUEST_FLAG_MESSAGE, requestFlagMessageSaga),
        takeLatest(GET_CHAT_LIST, getChatListSaga),
        takeLatest(SEND_MESSAGE, sendMessageSaga),
        takeLatest(LIKE_MESSAGE, likeMessageSaga),
        takeLatest(DISLIKE_MESSAGE, dislikeMessageSaga)
    ]);
}

export default ChatRoomSaga;