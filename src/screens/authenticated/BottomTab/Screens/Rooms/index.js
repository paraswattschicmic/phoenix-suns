import Rooms from './screen';
import { connect } from 'react-redux';
import { getUserRoomList, updateChannel } from '../../../../../redux/actions';

const mapStateToProps = state => {
    return {
        authToken: state.common.authToken,
        netConnected: state.common.netConnected,
        chatRooms: state.roomsReducer.chatRooms,
        nextPageToken: state.roomsReducer.nextPageToken,
        userData: state.common.userData,
        cameOnChatScreenFlag: state.roomsReducer.cameOnChatScreenFlag,
        lastChatOpened: state.roomsReducer.lastChatOpened
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getUserRoomList: payload => dispatch(getUserRoomList(payload)),
        updateChannel: payload => dispatch(updateChannel(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Rooms);