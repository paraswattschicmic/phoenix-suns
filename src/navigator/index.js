import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import { navigationRef } from '../shared';
import {
    DASHBOARD_BOTTOM_TAB,
    INITIAL_SIGNUP_SCREEN,
    SPLASH_SCREEN,
    CHAT_SCREEN,
    COMPLETE_PROFILE_SCREEN,
    LEGAL_SCREEN,
    COMMUNITY_SCREEN,
    SUPPORT_SCREEN,
    SIGN_UP_MOBILE
} from '../shared';
import {
    BottomTab,
    CompleteProfileScreen,
    InitialSignupScreen,
    SplashScreen,
    ChatScreen,
    LegalScreen,
    CommunityScreen,
    SupportScreen,
    SignUpMobile
} from '../screens'

const Stack = createStackNavigator();

function App() {
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator
                // initialRouteName={CHAT_SCREEN}
                screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}
                headerMode='none'>
                <Stack.Screen name={SPLASH_SCREEN} component={SplashScreen} />
                <Stack.Screen name={COMPLETE_PROFILE_SCREEN} component={CompleteProfileScreen} />
                <Stack.Screen name={INITIAL_SIGNUP_SCREEN} component={InitialSignupScreen} />
                <Stack.Screen name={SIGN_UP_MOBILE} component={SignUpMobile} />
                <Stack.Screen name={CHAT_SCREEN} component={ChatScreen} />
                <Stack.Screen name={LEGAL_SCREEN} component={LegalScreen} />
                <Stack.Screen name={COMMUNITY_SCREEN} component={CommunityScreen} />
                <Stack.Screen name={SUPPORT_SCREEN} component={SupportScreen} />
                <Stack.Screen name={DASHBOARD_BOTTOM_TAB} component={BottomTab} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
