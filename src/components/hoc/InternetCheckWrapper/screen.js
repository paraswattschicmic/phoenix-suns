import React from 'react';
import {
    View,
    Text,
    Modal,
    Image,
    Linking,
    Platform,
    PermissionsAndroid
} from 'react-native';
import styles from './style';
import Geolocation from '@react-native-community/geolocation';
// import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
// import AndroidOpenSettings from 'react-native-android-open-settings';
import CustomButton from '../../atoms/CustomButton';
import { GPS_LOGO, NO_INTERNET, LOCATION_LOGO, APP_MESSAGES } from '../../../shared/constants';

export default InternetCheckWrapper = ({
    children,
    gpsEnabled,
    setUserLocation,
    setGpsEnabled,
    locationEnabled,
    isNetConnected,
    neverAskPermission,
    setLocationEnabled,
    setNeverAskPermission,
}) => {
    // const onGetPermission = () => {
    //     Platform.OS === 'ios' ?
    //         Linking.openURL('app-settings:')
    //         :
    //         neverAskPermission ?
    //             AndroidOpenSettings.appDetailsSettings()
    //             :
    //             locationEnabled ?
    //                 !gpsEnabled &&
    //                 /**
    //                  * Todo: Integrate the library and 
    //                  * Popup request for gps
    //                  */
    //                 askGPSLocation()
    //                 :
    //                 PermissionsAndroid.request(
    //                     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    //                 ).then((Permission) => {
    //                     if (Permission === 'granted') {
    //                         setLocationEnabled(true);
    //                         askGPSLocation();
    //                         return;
    //                     } else if (Permission === 'never_ask_again') {
    //                         setNeverAskPermission(true);
    //                     }
    //                 }).catch(() => {
    //                     setNeverAskPermission(false);
    //                     setLocationEnabled(false);
    //                 });
    // }

    // const askGPSLocation = () => {
    //     RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
    //         .then(() => {
    //             getUserLocation();
    //             setGpsEnabled(true);
    //         })
    //         .catch(err => {
    //             setGpsEnabled(false);
    //         });
    // }

    const getUserLocation = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                setUserLocation(position.coords);
            },
            (error) => {
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }

    const showPermissionInfo = () => {
        return !locationEnabled || neverAskPermission || Platform.OS === 'ios';
    }

    return (
        <View style={styles.screen}>
            {children}

            <Modal
                visible={!isNetConnected}
                onRequestClose={() => { }}
                supportedOrientations={['portrait', 'landscape']}
            >
                <View style={styles.container}>
                    <View style={styles.locationWrapper}>

                        <Image
                            style={styles.logo}
                            source={(!isNetConnected) ?
                                NO_INTERNET
                                : (showPermissionInfo()
                                    ? LOCATION_LOGO
                                    : GPS_LOGO
                                )}
                        />

                        <Text style={styles.heading}>
                            {!isNetConnected ?
                                APP_MESSAGES.INTERNET_IS_TURNED_OFF
                                :
                                showPermissionInfo() ?
                                    APP_MESSAGES.LOCATION_PERMISSION_REQUIRED
                                    :
                                    APP_MESSAGES.DEVICE_GPS_TURNED_OFF
                            }
                        </Text>
                        <Text style={styles.initialMessageStyle}>
                            {!isNetConnected ?
                                APP_MESSAGES.YOU_APPEARS_TO_BE_OFFLINE
                                :
                                showPermissionInfo() ?
                                    APP_MESSAGES.REQUEST_LOCATION_DETECTION_PERMISSION
                                    :
                                    APP_MESSAGES.REQUEST_TO_TURN_GPS_ON
                            }
                        </Text>
                        {isNetConnected && neverAskPermission &&
                            <Text style={styles.goToSettingsMessage}>
                                {APP_MESSAGES.TO_ENABLE_GO_TO_SETTINGS}
                            </Text>
                        }
                    </View>
                    {/* {isNetConnected && <CustomButton
                        label={neverAskPermission ?
                            APP_MESSAGES.OPEN_SETTINGS
                            :
                            showPermissionInfo() ?
                                APP_MESSAGES.ALLOW_PERMISSION
                                :
                                // APP_MESSAGES.TURN_ON_GPS
                        }
                        onPress={onGetPermission}
                    />} */}
                </View>
            </Modal>
        </View>
    )
}