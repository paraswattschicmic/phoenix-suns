/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { Keyboard } from 'react-native';
import { Dimensions, FlatList, Image, Text, TextInput, TouchableHighlight, View, KeyboardAvoidingView } from 'react-native';
import {
    COLLYDE_ERROR_RED,
    COLLYDE_GRAY_BACKGROUND_COLOR,
    COLLYDE_LIGHT_GRAY_COLOR, COLLYDE_PRIMARY_BLUE_COLOR, GIF_POWERED_BY, JOIN_BUTTON_COLOR, TEXT_CONST, _scaleText
} from '../../../shared';
import FontAwsomeIcon from 'react-native-vector-icons/FontAwesome5';
import { Modal } from 'react-native';
import { CustomButton } from '../../atoms';

const { width } = Dimensions.get('window');

const JoinPasswordModal = props => {
    const [accessCode, setAccessCode] = useState('');

    const styles = {
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            flexDirection: 'row',
            backgroundColor: 'rgba(52, 52, 52, 0.8)',
            alignContent: 'center',
            alignItems: 'center'
        },
        modalContainerInner: {
            flexDirection: 'column',
            height: 'auto',
            width: '90%',
            backgroundColor: 'white',
            borderRadius: _scaleText(5).fontSize,
            padding: _scaleText(15).fontSize,
            marginVertical: _scaleText(80).fontSize, borderWidth: 2, borderColor: COLLYDE_PRIMARY_BLUE_COLOR
        },
        shortguidelinesText: {
            fontSize: _scaleText(14).fontSize,
            lineHeight: _scaleText(16).fontSize,
            color: '#444444',
            //fontWeight: 'bold',
            fontFamily: 'SFProText-Regular',
            marginBottom: _scaleText(13).fontSize
        },
        modalTitle: {
            color: COLLYDE_GRAY_BACKGROUND_COLOR,
            fontSize: _scaleText(23).fontSize,
            fontWeight: '800',
            marginBottom: _scaleText(20).fontSize, alignSelf: 'center'
        },
        modalSubTitle: {
            color: COLLYDE_GRAY_BACKGROUND_COLOR,
            fontSize: _scaleText(15).fontSize,
            fontWeight: '500',
            marginVertical: _scaleText(5).fontSize, alignSelf: 'center'
        },
        modalError: {
            color: COLLYDE_ERROR_RED,
            fontSize: _scaleText(15).fontSize,
            fontWeight: '500',
            marginVertical: _scaleText(5).fontSize, alignSelf: 'center'
        },
        closeButtonModal: {
            width: '100%',
        },
        inputAccessCode: {
            borderBottomWidth: _scaleText(1).fontSize, fontSize: _scaleText(20).fontSize, marginHorizontal: _scaleText(20).fontSize, paddingHorizontal: _scaleText(5).fontSize, paddingBottom: _scaleText(10).fontSize, color: COLLYDE_GRAY_BACKGROUND_COLOR
        }
    };
    const { isVisible, onClose, title, onJoin, incorrectPassword } = props;
    return (
        <Modal
            visible={isVisible}
            onRequestClose={onClose}
            transparent
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : ''} style={{flex:1}}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContainerInner}>
                        <>
                            <TouchableHighlight
                                onPress={onClose}
                                style={styles.closeButtonModal}
                            >
                                <FontAwsomeIcon
                                    name='times'
                                    color='gray'
                                    size={_scaleText(20).fontSize}
                                    style={{ alignSelf: 'flex-end' }}
                                />
                            </TouchableHighlight>
                            <Text numberOfLines={2} style={styles.modalTitle}>{title}</Text>
                            <TextInput style={styles.inputAccessCode} value={accessCode} onChangeText={setAccessCode}
                            >

                            </TextInput>
                            <Text style={styles.modalSubTitle}>{TEXT_CONST.REQUIRED_ACCESSCODE}</Text>
                            {incorrectPassword && <Text style={styles.modalError}>{TEXT_CONST.INCORRECT_PASSWORD_JOINROOM}</Text>}
                            <CustomButton
                                label={TEXT_CONST.CONTINUE}
                                labelStyle={{ fontSize: _scaleText(18).fontSize, fontWeight: '500', color: 'white' }}
                                containerStyle={{ backgroundColor: JOIN_BUTTON_COLOR, height: _scaleText(45).fontSize, width: '90%', borderRadius: _scaleText(20).fontSize, borderColor: JOIN_BUTTON_COLOR, borderWidth: 0.8, alignSelf: 'center', marginTop: _scaleText(25).fontSize }}
                                onPress={() => {
                                    let enterCode = accessCode.toLowerCase();
                                    onJoin(enterCode);
                                }}
                            />
                            {/* <View style={{ flexDirection: 'row', marginTop: _scaleText(8).fontSize, height: _scaleText(50).fontSize, marginBottom: _scaleText(8).fontSize, }}>
                            <View style={{ flex: 1 }}>
                                <CustomButton
                                    label={TEXT_CONST.GOT_IT}
                                    labelStyle={{ fontSize: _scaleText(18).fontSize, fontWeight: '500' }}
                                    containerStyle={{ backgroundColor: JOIN_BUTTON_COLOR, height: _scaleText(45).fontSize, width: _scaleText(150).fontSize, borderRadius: _scaleText(10).fontSize }}
                                    onPress={() => { actionGuideLineModalGotIt() }}
                                />
                            </View>
                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                <CustomButton
                                    label={TEXT_CONST.MORE_INFO}
                                    labelStyle={{ fontSize: _scaleText(18).fontSize, fontWeight: '500', color: JOIN_BUTTON_COLOR }}
                                    containerStyle={{ backgroundColor: 'white', height: _scaleText(45).fontSize, width: _scaleText(150).fontSize, borderRadius: _scaleText(10).fontSize, borderColor: JOIN_BUTTON_COLOR, borderWidth: 0.8 }}
                                    onPress={() => { setGuidelinesmoreInfoVisibile(true) }}
                                />
                            </View>
                        </View> */}
                        </>
                    </View>
                </View>
            </KeyboardAvoidingView>

        </Modal>

    );
};

export default JoinPasswordModal;



