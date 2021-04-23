import Profile from './screen';
import {connect} from 'react-redux';
import {
  logoutRequest,
  uploadFileRequest,
  getProfileRequest,
  startLoading,
  stopLoading,
  getTimezoneRequest,
  updateProfileRequest,
} from '../../../../../redux/actions';

const mapStateToProps = (state) => {
  return {
    authToken: state.common.authToken,
    userData: state.common.userData,
    netConnected: state.common.netConnected,
    facebookData: state.common.facebookData,
    appleData: state.common.appleData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logoutRequest: (payload) => dispatch(logoutRequest(payload)),
    uploadFileRequest: (payload) => dispatch(uploadFileRequest(payload)),
    getProfileRequest: (payload) => dispatch(getProfileRequest(payload)),
    startLoading: () => dispatch(startLoading()),
    stopLoading: () => dispatch(stopLoading()),
    getTimezoneRequest: (payload) => dispatch(getTimezoneRequest(payload)),
    updateProfileRequest: (payload) => dispatch(updateProfileRequest(payload)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
