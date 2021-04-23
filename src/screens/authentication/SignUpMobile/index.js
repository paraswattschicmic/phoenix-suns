import { connect } from 'react-redux';
import { phoneLoginRequest, updateProfileRequest, verifyOTPLoginRequest } from '../../../redux/actions';
import SignUpMobile from './screen';

const mapStateToProps = state => {
    return {
        netConnected: state.common.netConnected,

    }
}

const mapDispatchToProps = dispatch => {
    return {
        phoneLoginRequest: (payload) => dispatch(phoneLoginRequest(payload)),
        verifyOTPLoginRequest: (payload) => dispatch(verifyOTPLoginRequest(payload)),
        updateProfileRequest: payload => dispatch(updateProfileRequest(payload)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpMobile);