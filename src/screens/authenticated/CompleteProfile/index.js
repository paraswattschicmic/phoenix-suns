import CompleteProfileScreen from './screen';
import { connect } from 'react-redux';
import { updateProfileRequest, getTimezoneRequest, startLoading, stopLoading, uploadFileRequest } from '../../../redux/actions'

const mapStateToProps = state => {
    return {
        authToken: state.common.authToken,
        netConnected: state.common.netConnected,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getTimezoneRequest: payload => dispatch(getTimezoneRequest(payload)),
        startLoading: () => dispatch(startLoading()),
        stopLoading: () => dispatch(stopLoading()),
        updateProfileRequest: payload => dispatch(updateProfileRequest(payload)),
        uploadFileRequest: payload => dispatch(uploadFileRequest(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CompleteProfileScreen);