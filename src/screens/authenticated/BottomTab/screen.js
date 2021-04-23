import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import messaging from '@react-native-firebase/messaging';
import Feather from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { GET_FCM_TOKEN, _scaleText } from '../../../shared';
import { JOIN_BUTTON_COLOR, STATUS_BAR_PRIMARY_COLOR } from '../../../shared/constants';
import { BOTTOM_TABS } from '../../../shared/constants/routes';
import { PartiesTab, ProfileTab, RoomsTab } from './Screens';
import { SocketManager } from '../../../shared/services/socketManager'
const Tab = createBottomTabNavigator();


const BottomTab = ({
    route,
    authToken,
    updateProfileRequest,
    netConnected,
}
) => {
    useEffect(() => {
        async function getToken() {
            const oldToken = await messaging().getToken();
            // console.log("oldToken", oldToken)
            await messaging().deleteToken(undefined, '*');
            const newToken = await messaging().getToken();
            updateToken(newToken)
            // console.log("newToken", newToken)
            if (oldToken === newToken) {
                console.error('Token has not been refreshed');
            }

        }

        getToken();

        // messaging().deleteToken()
        SocketManager.sharedManager.establishConnection(authToken);
        // GET_FCM_TOKEN().then(updateToken)
    }, []);

    const updateToken = (deviceToken) => {
        // console.log("deviceToken", deviceToken)
        updateProfileRequest({
            netConnected,
            payload: { deviceToken }
        })
    }

    return (
        <Tab.Navigator
        lazy
        tabBarOptions={{
            activeTintColor: JOIN_BUTTON_COLOR,
            keyboardHidesTabBar: true,
            labelStyle: { textAlignVertical: 'center', fontSize: _scaleText(14).fontSize, marginBottom: _scaleText(10).fontSize },
            style: { minHeight: _scaleText(90).fontSize, borderColor: 'transparent', borderTopColor: STATUS_BAR_PRIMARY_COLOR, borderWidth: _scaleText(1).fontSize, alignItems: 'center', paddingVertical: _scaleText(5).fontSize }
        }}
    >
        <Tab.Screen name={BOTTOM_TABS.PARTIES} component={PartiesTab} options={{
            tabBarIcon: ({ color, size }) => (
                <Icon name={ICONS_NAMES.ICON_BOTTOM_WATCH_PARTIES} color={color} size={_scaleText(30).fontSize} />
            ),
        }} />
        <Tab.Screen name={BOTTOM_TABS.ROOMS} component={RoomsTab} options={{
            tabBarIcon: ({ color, size }) => (
                <MaterialIcon name={ICONS_NAMES.ICON_BOTTOM_ROOMS} color={color} size={_scaleText(30).fontSize} />
            )
        }} />
        <Tab.Screen name={BOTTOM_TABS.PROFILE} component={ProfileTab} options={{
            tabBarIcon: ({ color, size }) => (
                <Feather name={ICONS_NAMES.ICON_BOTTOM_PROFILE} color={color} size={_scaleText(30).fontSize} />
            )
        }} />
    </Tab.Navigator>
    );
}
/**
* Screen text constants
*/
const ICONS_NAMES = {
    ICON_BOTTOM_WATCH_PARTIES: 'party-popper',
    ICON_BOTTOM_ROOMS: 'chat',
    ICON_BOTTOM_PROFILE: 'user',
}
export default BottomTab;
