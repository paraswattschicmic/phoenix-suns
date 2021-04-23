import { connect } from 'react-redux';
import {
    emptyChatList, getChatListSuccess,
    messageRecieved, requestBanUser, saveOnSendSuccess, updateFlagCameOnChat,
    updateReactions, saveOnSendFailure,
    updateSendbirdConnectionStatus, requestFlagMessage
} from '../../../redux/actions';
import ChatScreen from './screen';

const mapStateToProps = state => {
    let { title, memberCount, list, exit, typing } = state.chatReducer;
    return {
        title, memberCount, list, exit, typing,
        authToken: state.common.authToken,
        userData: state.common.userData,
        chatList: state.roomsReducer.chatList,
        netConnected: state.common.netConnected,
        sendbirdConenctionStatus: state.watchParties.sendbirdConenctionStatus,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateFlagCameOnChat: payload => dispatch(updateFlagCameOnChat(payload)),
        updateSendbirdConnectionStatus: payload => dispatch(updateSendbirdConnectionStatus(payload)),
        emptyChatList: () => dispatch(emptyChatList()),
        updateReactions: payload => dispatch(updateReactions(payload)),
        requestBanUser: payload => dispatch(requestBanUser(payload)),
        requestFlagMessage: payload => dispatch(requestFlagMessage(payload)),
        getChatListSuccess: (payload, append, replace) => dispatch(getChatListSuccess(payload, append, replace)),
        saveOnSendSuccess: (payload, tempMessageID) => dispatch(saveOnSendSuccess(payload, tempMessageID)),
        saveOnSendFailure: (payload, tempMessageID) => dispatch(saveOnSendFailure(payload, tempMessageID)),
        messageRecieved: payload => dispatch(messageRecieved(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen);