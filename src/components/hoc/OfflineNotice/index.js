import { connect } from 'react-redux';
import OfflineNotice from './screen';

const mapStateToProps = (state) => {
  return {
    isNetConnected: state.common.netConnected,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OfflineNotice);