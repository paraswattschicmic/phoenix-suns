import SplashScreen from './screen';
import { connect } from 'react-redux';
import { updateInternetStatus } from '../../redux/actions';

const mapStateToProps = state => {
    return {
        authToken: state.common.authToken,
        userData: state.common.userData,
        netConnected: state.common.netConnected,
        sendbirdConenctionStatus: state.watchParties.sendbirdConenctionStatus,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateInternetStatus: payload => dispatch(updateInternetStatus(payload))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SplashScreen);