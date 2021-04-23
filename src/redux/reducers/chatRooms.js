/* eslint-disable prettier/prettier */
import { REHYDRATE } from 'redux-persist';
import { RESET, GET_USER_ROOMS_SUCCESS, SAVE_ON_SEND_SUCCESS, GET_CHAT_LIST_SUCCESS, MESSAGE_RECEIVED, UPDATE_CHANNEL, UPDATE_REACTIONS, UPDATE_FLAG_CAME_ON_CHAT, SAVE_ON_SEND_FAILURE } from '../actions';
import { EMPTY_CHAT_LIST } from '../actions/types';

const initialState = {
    chatList: [],
    chatRooms: [],
    nextPageToken: null,
    cameOnChatScreenFlag: false,
    lastChatOpened: {}
};

const uniqueList = list => {
    return list.reduce((uniqList, currentValue) => {
        let ids = uniqList.map(item => {
            return item.messageId;
        });
        if (ids.indexOf(currentValue.messageId) < 0) {
            uniqList.push(currentValue);
        }
        return uniqList;
    }, []);
};

const RoomsReducer = (state = { ...initialState }, action) => {
    let data = action.payload;
    switch (action.type) {
        case GET_USER_ROOMS_SUCCESS:
            return {
                ...state,
                chatRooms: data.spread ? [...state.chatRooms, ...data.data] : [...data.data],
                nextPageToken: data.nextPageToken,
            };
        case UPDATE_CHANNEL:
            let nIndex = state.chatRooms.findIndex(x => x.channel_url == data.url);
            let arrChatRooms = [...state.chatRooms]
            if (nIndex != undefined && nIndex != null && nIndex != -1) {
                arrChatRooms[nIndex].unread_message_count = data.unreadMessageCount;
                arrChatRooms[nIndex].member_count = data.memberCount;
                arrChatRooms[nIndex].joined_member_count = data.memberCount;
                arrChatRooms[nIndex].name = data.name;
            }
            return {
                ...state,
                chatRooms: arrChatRooms,
            };
        case UPDATE_REACTIONS:
            let nIndexChatlist = state.chatList.findIndex(x => x.messageId == data.messageId);
            let arrChatList = [...state.chatList]
            if (nIndexChatlist != undefined && nIndexChatlist != null && nIndexChatlist != -1) {
                if (data.operation == "add") {
                    if (!(arrChatList[nIndexChatlist].reactions && arrChatList[nIndexChatlist].reactions[0] && arrChatList[nIndexChatlist].reactions[0].userIds)) {
                        let reaction = {}
                        reaction.isEmpty = false;
                        reaction.key = 'Like'
                        reaction.updatedAt = data.updatedAt;
                        reaction.userIds = []
                        reaction.userIds.push(data.userId)
                        let chatMessage = state.chatList[nIndexChatlist];
                        arrChatList[nIndexChatlist] = chatMessage;
                        chatMessage.reactions[0] = reaction
                    }
                    else {
                        let bError = false;
                        let nIndexChatlistUserLike = arrChatList[nIndexChatlist].reactions[0].userIds.findIndex(x => x == data.userId);
                        if (nIndexChatlistUserLike != undefined && nIndexChatlistUserLike != null && nIndexChatlistUserLike != -1) {
                            // console.log('user like already added')
                            //user like already added
                            bError = true;
                        }

                        if (!bError) {
                            arrChatList[nIndexChatlist].reactions[0].userIds.push(data.userId);
                        }
                    }

                }
                else if (data.operation == "delete" && arrChatList[nIndexChatlist].reactions && arrChatList[nIndexChatlist].reactions[0]) {
                    let nIndexDeleted = arrChatList[nIndexChatlist].reactions[0].userIds.findIndex(x => x == data.userId);
                    arrChatList[nIndexChatlist].reactions[0].userIds.splice(nIndexDeleted, 1);
                }
            }
            return {
                ...state,
                chatList: arrChatList,
            };
        // messageList.map((item) => {
        //     if (item.messageId == reactionEvent.messageId) {
        //         let nIndex = chatList.findIndex(x.messageId == item.messageId);
        //         if (reactionEvent.operation == "add") {
        //             let reaction = {}
        //             reaction.isEmpty = false;
        //             reaction.key = 'Like'
        //             reaction.updatedAt = reactionEvent.updatedAt;
        //             reaction.userIds = []
        //             reaction.userIds.push(userId)

        //             let chatMessage = chatList[nIndex];
        //             chatMessage.reactions.push(reaction);
        //             updatedChatlist[nIndex] = chatMessage;
        //         }
        //         else {

        //         }
        //         updatedChatlist(updatedChatlist);
        //     }
        // })
        case EMPTY_CHAT_LIST:
            return {
                ...state,
                chatList: []
            };
        case UPDATE_FLAG_CAME_ON_CHAT:
            return { ...state, cameOnChatScreenFlag: true, lastChatOpened: action.payload };
        case GET_CHAT_LIST_SUCCESS:
            let foundNewMessage = false;
            let sendSuccessList = [];
            let newMessage = action.payload;
            let replace = action.replace;
            let append = action.append;
            if (state.chatList.length) {
                sendSuccessList = state.chatList.map(message => {
                    if (message) {
                        if (message.reqId && newMessage.reqId && message.reqId.toString() === newMessage.reqId.toString()) {
                            foundNewMessage = true;
                            return newMessage;
                        } else {
                            return message;
                        }
                    }
                });
            }
            // if (action.messageAction === 'send') {
            //     console.log('here')
            //     newMessage = [newMessage]
            // }
            if (replace) {
                return { ...state, chatList: uniqueList(newMessage) }
            }
            else if (append) {
                //  console.log('append')
                return { ...state, chatList: uniqueList([...state.chatList, ...action.payload]) };
            }
            else if ((state.chatList.length === 0) || (state.chatList.length === 1 && (state.chatList[0].messageId == newMessage[0].messageId))) {
                // console.log('single replace')
                return { ...state, chatList: uniqueList(newMessage) };
            }
            else if (foundNewMessage) {
                // console.log('foundNew')
                return { ...state, chatList: uniqueList(sendSuccessList) };
            } else {
                // console.log('else for all')
                return { ...state, chatList: uniqueList([...[newMessage], ...sendSuccessList]) };
            }
        // return {
        //     ...state,
        //     chatList: data
        // }
        case MESSAGE_RECEIVED:
            return { ...state, chatList: uniqueList([...[action.payload], ...state.chatList]) };
        case SAVE_ON_SEND_SUCCESS:
            let tempMessageID = action.tempMessageID;
            if (!!tempMessageID) {
                let checkIndexTempMessage = state.chatList.findIndex(x => x.messageId == tempMessageID)
                if ((checkIndexTempMessage != undefined) && (checkIndexTempMessage != null) && (checkIndexTempMessage != -1)) {
                    let arrUpdatedChatList = [...state.chatList];
                    arrUpdatedChatList[checkIndexTempMessage] = action.payload;
                    return { ...state, chatList: arrUpdatedChatList }
                }
                else {
                    return { ...state, chatList: [...[action.payload], ...state.chatList] };
                }
            }
            else {
                let checkIndex = state.chatList.findIndex(x => x.messageId == action.payload.messageId)
                if ((checkIndex != undefined) && (checkIndex != null) && (checkIndex != -1)) {
                    return state
                }
                else {
                    return { ...state, chatList: [...[action.payload], ...state.chatList] };
                }
            }
        case SAVE_ON_SEND_FAILURE:
            let failTempMessageID = action.tempMessageID;
            if (!!failTempMessageID) {
                let checkIndexTempMessage = state.chatList.findIndex(x => x.messageId == failTempMessageID)
                if ((checkIndexTempMessage != undefined) && (checkIndexTempMessage != null) && (checkIndexTempMessage != -1)) {
                    let arrUpdatedChatList = [...state.chatList];
                    arrUpdatedChatList.splice(checkIndexTempMessage, 1)
                    return { ...state, chatList: arrUpdatedChatList }
                }
                else {
                    return { ...state, chatList: [...[action.payload], ...state.chatList] };
                }
            }

        case REHYDRATE:
            return {
                ...initialState,
                ...((action.payload || {}).roomsReducer || {}),
                cameOnChatScreenFlag: false
            };
        case RESET:
            return {
                ...initialState
            };
        default:
            return {
                ...state
            };
    }
};

export default RoomsReducer;
