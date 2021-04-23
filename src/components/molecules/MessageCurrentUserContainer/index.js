/* eslint-disable prettier/prettier */
import React, { useMemo, useState } from 'react';
import { View, Text, Image, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { MessageBubble } from '../MessageBubble';
import { _scaleText, DEFUALT_PROFILE, VERIFIED_ICON } from '../../../shared';
import FastImage from 'react-native-fast-image';

const _renderUnreadCount = readCount => {
    return readCount ? <Text style={{ fontSize: 10, color: '#f03e3e' }}>{readCount}</Text> : null;
};

const MessageCurrentUserContainer = props => {
    const [isLoading, setLoading] = useState(false);

    const onLikePress = () => {
        props.onLikePress();
    }
    const onCopyPress = () => {
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
    return (
        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginTop: _scaleText(10).fontSize, }}>
            {/* <View style={{
                flex: 1,
                alignContent: 'flex-end', alignItems: 'flex-end', 
            }}>
                <View style={styles.profileImgContainer}>
                    <FastImage source={props.userData && props.userData.pictureUrl
                        ?
                        {
                            uri: props.userData.pictureUrl
                        }
                        : DEFUALT_PROFILE
                    }
                        style={styles.profileImg} />
                </View>
            </View> */}

            <MessageBubble
                isShow={props.isShow}
                isUser={props.isUser}
                userData={props.userData}
                onLikePress={onLikePress}
                isAdmin={false}
                onMessageCopy={onCopyPress}
                nickname={props.nickname}
                message={props.message}
                time={props.time}
                localUriPath={props.localUriPath}
                isEdited={props.isEdited}
            />
            {props.isUserHost
                ?
                <View style={styles.ringWrapper}>
                    <View style={styles.profileImgContainerWithBorder}>
                        <FastImage source={props.userData && props.userData.pictureUrl && checkURL(props.userData.pictureUrl)
                            ?
                            {
                                uri: props.userData.pictureUrl
                            }
                            : DEFUALT_PROFILE}
                            style={styles.profileImg}
                            onLoadStart={() => {
                                setLoading(true)
                            }}
                            onLoadEnd={() => {
                                setLoading(false)
                            }} >
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
                    <FastImage source={props.userData && props.userData.pictureUrl
                        ?
                        {
                            uri: props.userData.pictureUrl
                        }
                        : DEFUALT_PROFILE
                    }
                        style={styles.profileImg}
                        onLoadStart={() => {
                            setLoading(true)
                        }}
                        onLoadEnd={() => {
                            setLoading(false)
                        }} >
                        {
                            isLoading &&
                            <View style={[styles.profileImg, { backgroundColor: 'gray', borderRadius: 5, opacity: 0.5, justifyContent: 'center' }]}>
                                <ActivityIndicator size={'small'} color={Platform.OS === 'ios' ? 'black' : '#66756a'} animating={isLoading} />
                            </View>
                        }
                    </FastImage>
                </View>
            }
        </View>
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
    profileImg: {
        height: _scaleText(45).fontSize,
        width: _scaleText(45).fontSize,
        borderRadius: _scaleText(40).fontSize,
        alignSelf: 'center',
        // padding: _scaleText(5).fontSize,
    },
    ringWrapper: {
        height: _scaleText(50).fontSize,
        width: _scaleText(50).fontSize,
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
    verifiedIcon: {
        height: _scaleText(15).fontSize,
        width: _scaleText(15).fontSize,
        position: 'absolute',
        bottom: _scaleText(-2).fontSize,
        right: 0,
        zIndex: 9999999999
    },
});

export { MessageCurrentUserContainer };
