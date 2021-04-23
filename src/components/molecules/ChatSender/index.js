/* eslint-disable prettier/prettier */
import React from 'react';
import { View, TextInput, Dimensions, Platform, Text, TouchableOpacity, Image } from 'react-native';
import {
    _scaleText,
    STATUS_BAR_PRIMARY_COLOR,
    COLLYDE_GRAY_BACKGROUND_COLOR,
    COLLYDE_PRIMARY_BLUE_COLOR,
    COLLYDE_LIGHT_GRAY_COLOR, TEXT_CONST, GIF_ICON
} from '../../../shared';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwsomeIcon from 'react-native-vector-icons/FontAwesome5';

const { width } = Dimensions.get('window');

const ChatSender = props => {
    const styles = {
        containerStyle: {
            flexDirection: 'row',
            //padding: _scaleText(10).fontSize,
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: props.netConnected ? 'white' : 'gray',
        },
        sendIcon: {
            backgroundColor: COLLYDE_PRIMARY_BLUE_COLOR,
            padding: _scaleText(6).fontSize,
            borderRadius: 50,
            marginRight: _scaleText(15).fontSize
        },
        keyboardIcon: {
            alignSelf: 'center',
            marginLeft: _scaleText(5).fontSize
        },
        trophyIcon: {
            width: _scaleText(20).fontSize,
            height: _scaleText(20).fontSize,
            marginRight: _scaleText(10).fontSize,
        },
        itemContainer: {
            marginVertical: _scaleText(5).fontSize, marginHorizontal: _scaleText(5).fontSize, backgroundColor: "white",
            shadowColor: "#000", flex: 1,
            shadowOffset: {
                width: 0,
                height: _scaleText(5).fontSize,
            },
            shadowOpacity: 0.2,
            shadowRadius: _scaleText(6).fontSize,

            elevation: _scaleText(10).fontSize,
            padding: _scaleText(10).fontSize, marginVertical: _scaleText(4).fontSize,
        },
        titleStyle: {
            fontWeight: 'bold', alignSelf: 'center', color: COLLYDE_GRAY_BACKGROUND_COLOR
        },
        verticalLine: {
            backgroundColor: COLLYDE_GRAY_BACKGROUND_COLOR, height: '100%', width: _scaleText(0.5).fontSize
        },
    };
    let hasQuestion = props.selectedTriviaQuestion && props.selectedTriviaQuestion.content && props.selectedTriviaQuestion.content.text && props.selectedTriviaQuestion.answer && props.selectedTriviaQuestion.answer.text ? true : false
    return (
        <>
            <View style={{ height: 0.5, backgroundColor: 'gray' }}></View>
            { hasQuestion && <FontAwsomeIcon
                onPress={props.onDiscardTrivia}
                name='times-circle'
                color={COLLYDE_GRAY_BACKGROUND_COLOR}
                size={_scaleText(20).fontSize}
                style={{ alignSelf: 'flex-end', marginTop: _scaleText(-5).fontSize, marginRight: _scaleText(15).fontSize }}
            />}
            <View style={styles.containerStyle}>
                {props.isUserBanned ?
                    <View style={{ width: '100%', alignContent: 'center' }}>
                        <Text style={{ color: 'white', alignSelf: 'center' }}>{TEXT_CONST.USER_BANNED_INPUT_BOX}</Text>
                    </View>
                    :
                    <>
                        <View style={{
                            borderColor: 'white',
                            borderWidth: 1,
                            paddingHorizontal: _scaleText(10).fontSize,
                            paddingLeft: _scaleText(10).fontSize,
                            //borderRadius: _scaleText(50).fontSize,
                            height: hasQuestion ? 'auto' : _scaleText(40).fontSize,
                            flex: 1,
                            backgroundColor: '#FFFFFF',
                            // margin: _scaleText(5).fontSize,
                            flexDirection: 'row'
                        }}>
                            {
                                props.isUserHost &&
                                <TouchableOpacity
                                    onPress={props.onPressInputTrophy}
                                    style={styles.keyboardIcon}
                                >
                                    <Image
                                        source={props.isHostTriviaEnable
                                            ? require('../../../assets/icons/active_trophyIcon.png')
                                            : require('../../../assets/icons/trophyIcon.png')
                                        }
                                        style={styles.trophyIcon}
                                    />
                                </TouchableOpacity>
                            }
                            {hasQuestion
                                ?
                                <View style={[styles.itemContainer]}>

                                    <View style={{ flexDirection: 'row' }}>
                                        {/* <Text style={[styles.titleStyle, { fontSize: _scaleText(15).fontSize }]}>{index + 1}</Text> */}
                                        <Text style={[styles.titleStyle, { flex: 1, marginLeft: _scaleText(10).fontSize, marginRight: _scaleText(5).fontSize, }]}>{props.selectedTriviaQuestion.content.text}</Text>
                                        <View style={styles.verticalLine}></View>
                                        <Text style={[styles.titleStyle, { flex: 0.4, marginLeft: _scaleText(10).fontSize, fontSize: _scaleText(15).fontSize }]}>{props.selectedTriviaQuestion.answer.text}</Text>
                                    </View>
                                </View>
                                :
                                <TextInput
                                    style={{
                                        color: '#212529',
                                        textAlignVertical: 'center',
                                        flex: 1,
                                        fontSize: _scaleText(15).fontSize,
                                    }}
                                    spellCheck={true}
                                    placeholder={'Message'}
                                    autoCapitalize="none"
                                    onFocus={props.onPressKeyboard}
                                    placeholderTextColor={'gray'}
                                    selectionColor={'#212529'}
                                    underlineColorAndroid="transparent"
                                    value={props.textMessage}
                                    onChangeText={props.onChangeText}
                                />}
                            {
                                props.isGifEnable ?
                                    <TouchableOpacity
                                        onPress={props.onPressKeyboard}
                                        style={styles.keyboardIcon}
                                    >
                                        <FontAwsomeIcon
                                            name='keyboard'
                                            color='gray'
                                            size={_scaleText(20).fontSize}
                                        />
                                    </TouchableOpacity>
                                    :
                                    <TouchableOpacity
                                        onPress={props.onPressGif}
                                        style={styles.keyboardIcon}
                                    >
                                        <Image source={GIF_ICON} style={{ height: 20, width: 20 }} ></Image>
                                    </TouchableOpacity>
                            }

                        </View>
                    </>
                }

                {
                    props.isUserBanned ?
                        (
                            null
                        )
                        : props.netConnected ? (
                            <TouchableOpacity
                                onPress={props.onRightPress}
                                style={styles.sendIcon}
                            >
                                <Icon
                                    name='arrow-up'
                                    color='white'
                                    size={_scaleText(15).fontSize}
                                />
                            </TouchableOpacity>
                        ) :
                            (
                                <Text
                                    style={{
                                        paddingVertical: 10,
                                        fontSize: _scaleText(12).fontSize,
                                        fontWeight: '400',
                                        color: 'white',
                                        textAlignVertical: 'center',
                                        textAlign: 'center'
                                    }}
                                >{'Not connected'}</Text>
                            )
                }
            </View >
            <View style={{ height: 0.5, backgroundColor: 'gray' }}></View>
        </>
    );
};

export default ChatSender;
