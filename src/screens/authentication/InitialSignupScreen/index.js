import InitialSignUpScreen from './screen';
import {connect} from 'react-redux';
import {
  socialLoginRequest,
  stopLoading,
  updateFacebookData,
  updateAppleData,
  // getTimezoneRequest,
  // updateProfileRequest
} from '../../../redux/actions';

const mapStateToProps = (state) => {
  return {
    netConnected: state.common.netConnected,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    socialLoginRequest: (payload) => dispatch(socialLoginRequest(payload)),
    stopLoading: () => dispatch(stopLoading()),
    updateFacebookData: (payload) => dispatch(updateFacebookData(payload)),
    updateAppleData: (payload) => dispatch(updateAppleData(payload)),
    // getTimezoneRequest: payload => dispatch(getTimezoneRequest(payload)),
    // updateProfileRequest: payload => dispatch(updateProfileRequest(payload)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(InitialSignUpScreen);
