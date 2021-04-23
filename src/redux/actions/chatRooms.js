/* eslint-disable prettier/prettier */
export const GET_USER_ROOMS = 'GET_USER_ROOMS';
export const UPDATE_CHANNEL = 'UPDATE_CHANNEL';
export const GET_USER_ROOMS_SUCCESS = 'GET_USER_ROOMS_SUCCESS';
export const JOIN_CHAT_ROOM = 'JOIN_CHAT_ROOM';
export const GET_CHAT_LIST = 'GET_CHAT_LIST';
export const GET_CHAT_LIST_SUCCESS = 'GET_CHAT_LIST_SUCCESS';
export const REQUEST_BAN_USER = 'REQUEST_BAN_USER';
export const REQUEST_FLAG_MESSAGE = 'REQUEST_FLAG_MESSAGE';
export const SEND_MESSAGE = 'SEND_MESSAGE';
export const LIKE_MESSAGE = 'LIKE_MESSAGE';
export const DISLIKE_MESSAGE = 'DISLIKE_MESSAGE';
export const MESSAGE_RECEIVED = 'MESSAGE_RECEIVED';
export const UPDATE_REACTIONS = 'UPDATE_REACTIONS';
export const SAVE_ON_SEND_SUCCESS = 'SAVE_ON_SEND_SUCCESS';
export const SAVE_ON_SEND_FAILURE = 'SAVE_ON_SEND_FAILURE';
export const UPDATE_FLAG_CAME_ON_CHAT = 'UPDATE_FLAG_CAME_ON_CHAT';

export const getChatList = payload => {
    return {
        type: GET_CHAT_LIST,
        payload
    };
};
export const updateReactions = payload => {
    return {
        type: UPDATE_REACTIONS,
        payload
    };
};
export const getChatListSuccess = (payload, append = false, replace = false) => {
    return {
        type: GET_CHAT_LIST_SUCCESS,
        payload,
        append,
        replace
    };
};
export const requestBanUser = (payload) => {
    return {
        type: REQUEST_BAN_USER,
        payload
    };
};
export const requestFlagMessage = (payload) => {
    return {
        type: REQUEST_FLAG_MESSAGE,
        payload
    };
};

export const sendMessage = payload => {
    return {
        type: SEND_MESSAGE,
        payload
    }
}

export const saveOnSendSuccess = (payload, tempMessageID = 0) => {
    return {
        type: SAVE_ON_SEND_SUCCESS,
        payload,
        tempMessageID
    }
}
export const saveOnSendFailure = (payload, tempMessageID = 0) => {
    return {
        type: SAVE_ON_SEND_FAILURE,
        payload,
        tempMessageID
    }
}
export const updateFlagCameOnChat = payload => {
    return {
        type: UPDATE_FLAG_CAME_ON_CHAT,
        payload
    }
}

export const likeMessage = payload => {
    return {
        type: LIKE_MESSAGE,
        payload
    }
};

export const dislikeMessage = payload => {
    return {
        type: DISLIKE_MESSAGE,
        payload,
    };
};

export const getUserRoomList = payload => {
    return {
        type: GET_USER_ROOMS,
        payload
    }
};

export const updateChannel = payload => {
    return {
        type: UPDATE_CHANNEL,
        payload
    }
};

export const getUserRoomListSuccess = payload => {
    return {
        type: GET_USER_ROOMS_SUCCESS,
        payload
    }
};

export const joinChatRoom = payload => {
    return {
        type: JOIN_CHAT_ROOM,
        payload
    }
};

export const messageRecieved = payload => {
    return {
        type: MESSAGE_RECEIVED,
        payload
    }
}