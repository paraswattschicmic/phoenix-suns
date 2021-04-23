/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react';
import { UIManager, TouchableOpacity, Text, StyleSheet, View, LayoutAnimation, TextInput, Dimensions, KeyboardAvoidingView, Platform, Keyboard, FlatList } from 'react-native';
import { CustomDropDown, ScreenHOC, CustomButton, CustomProgressBar, CustomOTP, CustomProfileImagePicker } from '../../../components';
import { JOIN_BUTTON_COLOR, _scaleText, DASHBOARD_BOTTOM_TAB, TEXT_CONST, LINE_COLOR } from '../../../shared';
import NetInfo from "@react-native-community/netinfo";
import Toast from 'react-native-simple-toast';
import { SafeAreaView } from 'react-native';
import { JPEG_FILE_EXTENSION, TYPE_IMAGE_JPEG } from '../../../shared/constants/sendbird';

UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
/**
 * Screen Steps
 */
const STEPS = [
    {
        title: 'First Name',
        subTitle: '',
    },
    // {
    //     title: 'Find Location or Use Zip',
    //     subTitle: "We're not creepy, just need to adjust your settings for TV times",
    // },
    {
        title: 'Time Zone',
        subTitle: 'Please confirm your TV time zone',
    },
    {
        title: 'Photo',
        subTitle: 'Use your Facebook photo, or change by clicking the camera',
    }
]

const CompleteProfile = ({
    /**
     * Props
     */
    getTimezoneRequest,
    navigation,
    netConnected,
    route: { params = {} },
    startLoading,
    stopLoading,
    updateProfileRequest,
    uploadFileRequest,
}) => {
    /**
     * Refs 
     */
    let scrollRef;
    /**
     * State
     */
    const [locPermission, toggleLocPermission] = useState(false);
    const [currentStep, updateStep] = useState(0);
    const [pictureUrl, updatePictureUrl] = useState(params.pictureUrl || '');
    const [firstName, updateFirstName] = useState(params.firstName || '');
    const [email, updateEmail] = useState(params.email || '');
    const [timezone, updateTimezone] = useState('');
    const [timezones, updateTimezones] = useState([]);
    const [zipcode, updateZipcode] = useState(new Array(5));
    const [hometown, updateHometown] = useState()
    const [showList, toggleList] = useState(false);


    /**
     * Use Effect depends
     * Dependency: currentStep
     */
    useEffect(() => {
        /**
         * if currentStep == '1'
         * 1.) Get Current Location
         * 2.) Start/Stop loading
         * 3.) State Update (updateStep,updateZipcode)
         */
        // currentStep == '1' && Geolocation.getCurrentPosition(info => {
        //     startLoading();
        //     toggleLocPermission(true);
        //     Geocoder.from(info.coords).then(json => {
        //         var addressComponent = json.results[0].address_components;
        //         let index = addressComponent.findIndex(item => item.types[0] == OBJECT_KEYS.POSTAL_CODE);
        //         let nindex = addressComponent.findIndex(item => item.types[0] == OBJECT_KEYS.LOCALITY);
        //         if (index >= 0 && nindex >= 0 && (updateStep(currentStep + 1), updateZipcode(addressComponent[index].long_name.split('').slice(0, 6))), updateHometown(addressComponent[nindex].long_name));
        //         stopLoading();
        //     })
        //         .catch(error => { stopLoading(); console.log(error) });
        // });
        /**
       * if currentStep == '2' && locPermission
       * 1.) Get Time Zones Call
       * 2.) State Update (updateStep,updateTimezone)
       */
        // if (currentStep == '1') {
        //     let offset = -(new Date().getTimezoneOffset());
        //     let index = timezones.findIndex(item => item.value == offset)
        //     index >= 0 && (updateStep(currentStep + 1), scrollRef.scrollToIndex({ animated: true, index: currentStep + 1 }), updateTimezone(timezones[index]._id))
        // }
        if (currentStep == '1') {
            /**
             * currentStep == '2'
             * 1.) Get Time Zones
             */
            !timezones.length && getTimeZones();
        }
    }, [currentStep]);

    /**
     * Use Effects
     * Dependency: No Dependency
     * 1.) Get Time Zones Call
     */
    useEffect(() => {
        getTimeZones();
    }, [])



    /**
     * Function get Time Zones
     */
    const getTimeZones = () => {
        getTimezoneRequest({
            netConnected,
            success: (timezones = []) => updateTimezones([...timezones]),
            fail: (error = '') => { Toast.show(error, 3) }
        })
    }

    /**
    * Function upload File
    * @param {*} pictureUrl 
    */
    const uploadFile = (pictureUrl) => {
        NetInfo.fetch().then(({ isConnected }) => {
            uploadFileRequest({
                payload: {
                    name: Date.now() + JPEG_FILE_EXTENSION,
                    type: TYPE_IMAGE_JPEG,
                    uri: pictureUrl
                },
                netConnected: isConnected,
                success: (pictureUrl) => updatePictureUrl(pictureUrl),
                fail: (error) => { Toast.show(error, 3) }
            })
        })
    }


    /**
     * Action: On Press Continue
     */
    const onPressContinue = () => {
        Keyboard.dismiss();
        if (netConnected) {
            LayoutAnimation.easeInEaseOut();
            currentStep < 2 && (scrollRef.scrollToIndex({ animated: true, index: currentStep + 1 }), updateStep(currentStep + 1));
            if (currentStep === 2) {
                let payload = {
                    firstName,
                    pictureUrl,
                    timezone,
                    zipcode: zipcode.join(''),
                    hometown: hometown,
                    // email
                }
                updateProfileRequest({
                    fail: (error) => Toast.show(error, 3),
                    netConnected,
                    payload,
                    success: () => { navigation.replace(DASHBOARD_BOTTOM_TAB) },
                })
            }
        } else {
            Toast.show(TEXT_CONST.INTERNET_ERROR, 3)
        }
    }


    /**
     * Check Disabled
     */
    const checkDisabled = () => {
        switch (currentStep) {
            case 0:
                return !!firstName.trim().length
            case 1:
                return !!timezone
            case 2:
                return !!pictureUrl

        }
    }

    /**
     * Render
     */
    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS == 'ios' ? 'padding' : ''} >
            <ScreenHOC >
                <TouchableOpacity style={styles.container} activeOpacity={1} onPress={() => { toggleList(false); Keyboard.dismiss() }}>
                    <FlatList
                        data={STEPS}
                        horizontal
                        keyExtractor={item => item.title}
                        showsHorizontalScrollIndicator={false}
                        keyboardShouldPersistTaps='handled'
                        scrollEnabled={false}
                        ref={ref => scrollRef = ref}
                        renderItem={({ item, index }) => {
                            let { title = '', subTitle = '' } = item;
                            return (
                                <View style={styles.itemContainer}>
                                    {index == 2 && <CustomProfileImagePicker
                                        containerStyle={{ marginBottom: _scaleText(30).fontSize }}
                                        onChange={({ path }) => uploadFile(path)}
                                        src={pictureUrl}
                                    />}
                                    {!!title && <Text style={[styles.title, {
                                        fontSize: index == 0
                                            ? _scaleText(34).fontSize
                                            : index == 2
                                                ? _scaleText(33.5).fontSize
                                                : _scaleText(26).fontSize,
                                        fontWeight: '800'
                                    }]}>{title}</Text>}
                                    {!!subTitle && <Text style={[styles.subTitle, {
                                        fontSize: _scaleText(19).fontSize,
                                        lineHeight: index == 2 ? _scaleText(17.5).lineHeight : _scaleText(18.5).lineHeight
                                    }]}>{subTitle}</Text>}
                                    <View style={{ paddingTop: index == 0 ? _scaleText(30).fontSize : 0, flex: 1, zIndex: 9999999, }}>
                                        {index == 0 ?
                                            <>
                                                <TextInput
                                                    autoCapitalize='words'
                                                    autoCorrect={false}
                                                    onChangeText={(firstName) => updateFirstName(firstName)}
                                                    style={styles.input}
                                                    value={firstName}
                                                />
                                                {/* <Text style={styles.subTitle}>If you forgot, we can't help</Text> */}
                                            </>
                                            :
                                            index == 1 ?
                                                <CustomDropDown
                                                    data={timezones}
                                                    onChangeItem={(index, item) => { toggleList(false); updateTimezone(item._id) }}
                                                    placeholder={LABEL_NAMES.CHOOSE}
                                                    selected={timezone}
                                                    showList={showList}
                                                    toggleList={(showList) => toggleList(showList)}
                                                />
                                                : null
                                        }
                                    </View>
                                    <CustomButton
                                        containerStyle={[styles.button, !checkDisabled() && { backgroundColor: '#b1e8ff', }]}
                                        disabled={!checkDisabled()}
                                        label={LABEL_NAMES.CONTINUE}
                                        labelStyle={styles.buttonLabel}
                                        onPress={onPressContinue}
                                    />
                                </View>
                            )
                        }}
                    />
                    <View style={{ flex: 1, zIndex: 0 }}>
                        {currentStep == 2 && < Text onPress={onPressContinue} style={styles.skip} > Skip</Text>}
                        {
                            !!currentStep &&
                            <View style={styles.progressContainer}>
                                <CustomProgressBar
                                    filled={currentStep}
                                    total={STEPS.length}
                                />
                            </View>
                        }
                    </View>
                </TouchableOpacity>
                <SafeAreaView style={{ backgroundColor: 'white', }} />
            </ScreenHOC >
        </KeyboardAvoidingView>
    );
}

/**
 * Screen Const
 */
const LABEL_NAMES = {
    CONTINUE: 'Continue',
    CHOOSE: 'Choose',
}
const OBJECT_KEYS = {
    POSTAL_CODE: 'postal_code',
    LOCALITY: 'locality',
}

/**
 * Styles
 */
const styles = StyleSheet.create({
    container: {
        padding: _scaleText(20).fontSize,
        marginVertical: _scaleText(15).fontSize,
        paddingBottom: 0,
        flex: 1,
    },
    title: {
        color: JOIN_BUTTON_COLOR,
        fontWeight: 'bold',
    },
    subTitle: {
        color: '#7a7979',
        fontSize: _scaleText(19).fontSize,
        lineHeight: _scaleText(18.5).lineHeight
    },
    itemContainer: {
        marginTop: _scaleText(20).fontSize,
        zIndex: 9999999,
        padding: 0,
        margin: 0,
        width: Dimensions.get('screen').width - (_scaleText(20).fontSize * 2)
    },
    progressContainer: {
        padding: _scaleText(30).fontSize,
        paddingBottom: _scaleText(10).fontSize,
        flex: 1,
        justifyContent: 'center',
    },
    input: {
        marginBottom: _scaleText(10).fontSize,
        borderBottomWidth: 1.65,
        borderColor: LINE_COLOR,
        padding: 0,
        maxWidth: '95%',
        fontSize: _scaleText(23).fontSize
    },
    button: {
        height: _scaleText(40).fontSize,
        maxWidth: '90%',
        alignSelf: 'center'
        // marginTop: _scaleText(50).fontSize
    },
    buttonLabel: {
        fontSize: _scaleText(22).fontSize,
        fontFamily: 'SFProText-Regular',
        fontWeight: '400'
    },
    skip: {
        color: '#7a7979',
        textAlign: 'center',
        fontSize: _scaleText(16.5).fontSize,
        paddingTop: _scaleText(10).fontSize
    }
});

export default CompleteProfile;

