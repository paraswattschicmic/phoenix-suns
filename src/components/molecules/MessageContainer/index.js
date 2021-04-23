/* eslint-disable prettier/prettier */
import React, { useRef, useState } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View, Image, Platform, Alert, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import Menu, { MenuDivider, MenuItem } from 'react-native-material-menu';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
    COLLYDE_PRIMARY_BLUE_COLOR, DEFUALT_PROFILE, _scaleText, VERIFIED_ICON, TEXT_CONST
} from '../../../shared';
import { MessageBubble } from '../MessageBubble';

const _renderUnreadCount = readCount => {
    return readCount ? <Text style={{ fontSize: 10, color: COLLYDE_PRIMARY_BLUE_COLOR }}>{readCount}</Text> : null;
};

const _isImage = (props = {}) => {
    return ((props.message || {}).type || '').match(/^image\/.+$/);
};

const MessageContainer = props => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [bubbleWidth, setBubbleWidth] = useState(0);
    const [isLoading, setLoading] = useState(false);

    let _menu = useRef('menu');
    const onLikePress = () => {
        props.onLikePress();
    }
    const actionOnPressReport = () => {
        Alert.alert(
            TEXT_CONST.FLAG_MESSAGE_CONFIRMATION_TEXT,
            '',
            [
                {
                    text: 'Ok',
                    onPress: () => {
                        hideMenu();
                        props.actionOnPressReport();
                    }
                },
                {
                    text: 'Cancel',
                    style: 'destructive',
                },
            ],
            { cancelable: false },
        )
    }

    const hideMenu = () => {
        if (_menu) {
            _menu.current.hide();
            setMenuVisible(false)
        }
    };
    const actionOnPressRemove = () => {
        Alert.alert(
            TEXT_CONST.REMOVE_USER_CONFIRMATION_TEXT,
            '',
            [
                {
                    text: 'Ok',
                    onPress: () => {
                        hideMenu()
                        props.actionOnPressRemove();
                    }
                },
                {
                    text: 'Cancel',
                    style: 'destructive',
                },
            ],
            { cancelable: false },
        )
    }
    const onPressMessageCopy = () => {
        hideMenu()
        props.onMessageCopy();
    }
    const checkURL = (url) => {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(url);
    }

    const onPressMenu = () => {
        if (_menu) {
            _menu.current.show();
            setMenuVisible(true)
        }
    };
    return (
        <View style={{ flexDirection: 'row', flex: 1 }}>
            <Menu
                style={[{ backgroundColor: '#fff', borderColor: 'black', borderWidth: _scaleText(1).fontSize, borderRadius: _scaleText(3).fontSize, position: 'absolute' }, bubbleWidth && bubbleWidth < (Dimensions.get('window').width / 2) ? { left: bubbleWidth } : { right: _scaleText(10).fontSize, left: _scaleText(Dimensions.get('window').width / 2).fontSize }]}
                ref={_menu}
                button={
                    <View onLayout={(event) => {
                        var { x, y, width, height } = event.nativeEvent.layout;
                        setBubbleWidth(width)
                    }}>
                        <View underlayColor='transparent' style={{ flexDirection: 'row', flex: 1 }}>
                            {
                                //console.log("props.message._sender.plainProfileUrl ", props.message._sender.plainProfileUrl)
                            }
                            {props.message._sender.role === TEXT_CONST.IS_GROUP_HOST
                                ?
                                <View style={styles.ringWrapper}>
                                    <View style={styles.profileImgContainerWithBorder}>
                                        <FastImage
                                            source={props.message && props.message._sender && props.message._sender.plainProfileUrl
                                                && checkURL(props.message._sender.plainProfileUrl) ? { uri: props.message._sender.plainProfileUrl }
                                                : DEFUALT_PROFILE}
                                            style={styles.profileImg}
                                            onLoadStart={() => {
                                                setLoading(true)
                                            }}
                                            onLoadEnd={() => {
                                                setLoading(false)
                                            }}
                                        >
                                            {
                                                isLoading &&
                                                <View style={[styles.profileImg, { backgroundColor: 'gray', borderRadius: 5, opacity: 0.5, justifyContent: 'center' }]}>
                                                    <ActivityIndicator size={'small'} color={Platform.OS === 'ios' ? 'black' : '#66756a'} animating={isLoading} />
                                                </View>
                                            }
                                        </FastImage>

                                    </View>
                                    <Image source={VERIFIED_ICON} style={styles.verifiedIcon} />
                                </View>
                                :
                                <View style={styles.profileImgContainer}>
                                    <FastImage
                                        source={props.message && props.message._sender && props.message._sender.plainProfileUrl && checkURL(props.message._sender.plainProfileUrl)
                                            ?
                                            { uri: props.message._sender.plainProfileUrl }
                                            :
                                            DEFUALT_PROFILE
                                        }
                                        style={styles.profileImg}
                                        onLoadStart={() => {
                                            setLoading(true)
                                        }}
                                        onLoadEnd={() => {
                                            setLoading(false)
                                        }}
                                    >
                                        {
                                            isLoading &&
                                            <View style={[styles.profileImg, { backgroundColor: 'gray', borderRadius: 5, opacity: 0.5, justifyContent: 'center' }]}>
                                                <ActivityIndicator size={'small'} color={Platform.OS === 'ios' ? 'black' : '#66756a'} animating={isLoading} />
                                            </View>
                                        }
                                    </FastImage>

                                </View>
                            }
                            <MessageBubble
                                isShow={props.isShow}
                                isUser={props.isUser}
                                userData={props.userData}
                                onLikePress={onLikePress}
                                onPressMenu={onPressMenu}
                                isAdmin={false}
                                onMessageCopy={onPressMessageCopy}
                                isUserBanned={props.isUserBanned}
                                nickname={props.nickname}
                                message={props.message}
                                time={props.time}
                                localUriPath={props.localUriPath}
                                isEdited={props.isEdited}
                            />

                        </View>
                    </View>
                }
            >
                <View style={{ borderColor: '#707070' }} >
                    {!_isImage(props) && <MenuItem onPress={() => { onPressMessageCopy() }} style={{ height: _scaleText(30).fontSize, borderColor: '#707070', }} >
                        <Icon
                            name={'copy'}
                            color={'#424950'}
                            size={_scaleText(10).fontSize}
                        />
                        <Text style={{ color: '#424950' }}>  Copy message</Text>
                    </MenuItem>}
                    {!_isImage(props) && <MenuDivider color={'black'} ></MenuDivider>
                    }
                    <MenuItem onPress={() => { actionOnPressReport() }} style={{ height: _scaleText(30).fontSize, borderColor: '#707070', }} >
                        <Icon
                            name={'exclamation-triangle'}
                            color={'#424950'}
                            size={_scaleText(10).fontSize}
                        />
                        <Text style={{ color: '#424950' }}>  Flag message</Text>
                    </MenuItem>
                    {props.isUserHost && <MenuDivider color={'black'} ></MenuDivider>
                    }
                    {props.isUserHost &&
                        <MenuItem onPress={() => { actionOnPressRemove() }} style={{ height: _scaleText(30).fontSize }}>
                            <Icon
                                name={'trash-alt'}
                                color={'#424950'}
                                size={_scaleText(10).fontSize}

                            />
                            <Text style={{ color: '#424950' }}>  Remove user</Text>
                        </MenuItem>}
                </View>

            </Menu>
        </View >
    );
};

const styles = StyleSheet.create({
    profileImgContainer: {
        height: _scaleText(52).fontSize,
        width: _scaleText(52).fontSize,
        borderRadius: _scaleText(40).fontSize,
        overflow: 'hidden',
        borderColor: 'white',
        borderWidth: 2,
    },
    profileImgContainerWithBorder: {
        height: _scaleText(52).fontSize,
        width: _scaleText(52).fontSize,
        borderRadius: _scaleText(40).fontSize,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#E56020',
        justifyContent: 'center'
    },
    profileImg: {
        height: _scaleText(45).fontSize,
        width: _scaleText(45).fontSize,
        borderRadius: _scaleText(40).fontSize,
        alignSelf: 'center',
        // padding: _scaleText(5).fontSize,
    },
    verifiedIcon: {
        height: _scaleText(15).fontSize,
        width: _scaleText(15).fontSize,
        position: 'absolute',
        bottom: _scaleText(-2).fontSize,
        right: 0,
        zIndex: 9999999999
    },
    ringWrapper: {
        height: _scaleText(50).fontSize,
        width: _scaleText(50).fontSize,
    }
});

export { MessageContainer };
