import BottomTab from './screen';
import { connect } from 'react-redux';
import { updateProfileRequest } from '../../../redux/actions';

const mapStateToProps = state => {
    return {
        authToken: state.common.authToken,
        netConnected: state.common.netConnected,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateProfileRequest: payload => dispatch(updateProfileRequest(payload))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BottomTab);