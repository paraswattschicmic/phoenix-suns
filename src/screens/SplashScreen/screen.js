import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { DASHBOARD_BOTTOM_TAB, INITIAL_SIGNUP_SCREEN, updateAuthToken, TEXT_CONST, COMPLETE_PROFILE_SCREEN } from '../../shared';
import NetInfo from "@react-native-community/netinfo";
import { sbConnect } from '../../redux/actions/sendbirdActions';
import SendBird from 'sendbird';


const Splash = ({
    authToken,
    navigation,
    updateInternetStatus,
    userData,
    netConnected,
}) => {
    /**
     * Internet Connection Handler
     */
    useEffect(() => {
        NetInfo.addEventListener(({ isConnected }) => {
            updateInternetStatus(isConnected);
        });
        console.log('authToken',authToken)
        authToken && updateAuthToken(authToken)
          // navigation.replace(COMPLETE_PROFILE_SCREEN)
        navigation.replace((authToken) ? DASHBOARD_BOTTOM_TAB : INITIAL_SIGNUP_SCREEN)
        setTimeout(() => {
            SplashScreen.hide();
        }, 300)
    }, []);

    return null;
}

export default Splash;
