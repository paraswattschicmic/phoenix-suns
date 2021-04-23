import React, { useState, useEffect } from 'react';
import { Text, View, SafeAreaView, StatusBar } from 'react-native';
import { STATUS_BAR_PRIMARY_COLOR } from '../../../shared/constants';
import messaging from '@react-native-firebase/messaging';
import { Header } from '../../';

const ScreenHOC = ({
    barStyle = 'light-content',
    children,
    containerStyle = {},
    safeAreaRequired = true,
    statusBarColor = STATUS_BAR_PRIMARY_COLOR,
    statusBarRequired = true,
}) => {
    const [notificationPermissionGranted, setNotificationPermissionGranted] = useState(false)
    async function requestUserPermission() {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === 1 || authStatus === 2;

        if (enabled) {
            // console.log('Authorization status:', authStatus);
            setNotificationPermissionGranted(enabled);
        }
    }
    useEffect(() => {
        if (!notificationPermissionGranted) {
            requestUserPermission();
        }
    }, [notificationPermissionGranted]);
    return (
        <View style={{ flex: 1, backgroundColor: 'white', }}>
            {!!safeAreaRequired && <SafeAreaView style={{ backgroundColor: statusBarColor, }} />}
            {!!statusBarRequired && <StatusBar backgroundColor={statusBarColor} animated barStyle={barStyle} />}
            <Header />
            <View style={{ flex: 1, ...containerStyle }}>
                {children}
            </View>
        </View>
    );
}

export default ScreenHOC;
