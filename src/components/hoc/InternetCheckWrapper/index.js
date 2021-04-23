import { connect } from 'react-redux';
import {
    setGpsEnabled,
    setUserLocation,
    setLocationEnabled,
    setNeverAskPermission
} from '../../../redux/actions';
import InternetCheckWrapper from './screen';

const mapStateToProps = (state) => {
    return {
        gpsEnabled: state.common.gpsEnabled,
        isNetConnected: state.common.netConnected,
        locationEnabled: state.common.locationEnabled,
        neverAskPermission: state.common.neverAskPermission,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setUserLocation: (userLocation) => dispatch(setUserLocation(userLocation)),
        setGpsEnabled: (status) => dispatch(setGpsEnabled(status)),
        setLocationEnabled: (status) => dispatch(setLocationEnabled(status)),
        setNeverAskPermission: (status) => { dispatch(setNeverAskPermission(status)); },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InternetCheckWrapper);