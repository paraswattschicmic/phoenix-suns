import Parties from './screen';
import { connect } from 'react-redux';
import { joinChatRoom, getWatchPartiesRequest, updateSendbirdConnectionStatus, updateProfileRequest } from '../../../../../redux/actions';

const mapStateToProps = state => {
    return {
        watchParties: state.watchParties.watchParties,
        netConnected: state.common.netConnected,
        userData: state.common.userData,
        sendbirdConenctionStatus: state.watchParties.sendbirdConenctionStatus,
        authToken: state.common.authToken
    }
}

const mapDispatchToProps = dispatch => {
    return {
        joinChatRoom: payload => dispatch(joinChatRoom(payload)),
        updateSendbirdConnectionStatus: payload => dispatch(updateSendbirdConnectionStatus(payload)),
        getWatchPartiesRequest: payload => dispatch(getWatchPartiesRequest(payload)),
        updateProfileRequest: (payload) => dispatch(updateProfileRequest(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Parties);