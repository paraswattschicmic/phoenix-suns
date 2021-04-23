import React, { useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { CustomButton } from '../../atoms';
import { _scaleText, STATUS_BAR_PRIMARY_COLOR, PARTIES_TAB_COLOR, LINE_COLOR, JOIN_BUTTON_COLOR } from '../../../shared';
import moment from 'moment';
import { random } from 'lodash';
import FastImage from 'react-native-fast-image';

const IMAGES = [
    require('../../../assets/images/profile2.jpg'),
    require('../../../assets/images/profile1.jpg'),
    require('../../../assets/images/profile4.jpg'),
    require('../../../assets/images/profile3.png'),
]

const RoomListItem = ({
    item,
    isInIntialRender,
    onImageLoadFinished = () => { },
}) => {
    let {
        contentLength = 0,
        name = '',
        cover_url = '',
        host = '',
        member_count = 0,
        leagueInfo: { name: leagueName = '' } = {},
        platformInfo: { name: platformName = '' } = {},
        startTime,
        unread_message_count = 0,
        channel_url = ''
    } = item;
    const [imageIsLoading, setImageLoading] = useState(false);


    _actionOnImageLoadEnd = () => {
        onImageLoadFinished(channel_url)
    }


    let now = new Date(startTime) <= new Date() && moment(new Date(startTime)).add(contentLength, 'minutes') > new Date()
    return (
        <View style={styles.container}>
            <View style={styles.coverImageWrapper}>
                <View style={styles.profileImgContainer}>
                    <FastImage
                        style={styles.profileImg}
                        source={{ uri: cover_url }}
                        resizeMode="contain"
                        onLoadStart={() => {
                            setImageLoading(true)
                        }}
                        onLoadEnd={() => {
                            setImageLoading(false);
                            if (isInIntialRender) {
                                _actionOnImageLoadEnd()
                            }
                        }}
                        onError={() => {
                            setImageLoading(false);
                            // if(isInIntialRender){
                            //     _actionOnImageLoadEnd()
                            // } 
                        }}
                    >
                        {
                            imageIsLoading &&
                            <View style={{
                                height: '100%',
                                width: '100%', backgroundColor: 'gray', borderRadius: 5, opacity: 0.2, justifyContent: 'center'
                            }}>
                                <ActivityIndicator size={'small'} color={Platform.OS === 'ios' ? 'black' : '#66756a'} />
                            </View>
                        }
                    </FastImage>
                    {/* <Image source={{ uri: cover_url }} style={styles.profileImg} /> */}
                </View>
            </View>
            {/* <View style={styles.lineContainer} /> */}
            <View style={styles.textContentWrapper}>
                <View style={styles.roomNameWrapper}>
                    <Text style={styles.roomName}>{name}</Text>
                    <Text style={styles.memberCountText}>{`${member_count} in the room`}</Text>
                </View>
                <View style={styles.unreadTextWrapper}>
                    <Text style={styles.unreadText}>{unread_message_count ? unread_message_count : ''}</Text>

                </View>
            </View>
        </View >
    );
}

export default RoomListItem;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    time: {
        fontFamily: 'SFProText-Bold',
        color: JOIN_BUTTON_COLOR,
        fontSize: _scaleText(19).fontSize
    },
    profileImgContainer: {
        height: _scaleText(70).fontSize,
        width: _scaleText(70).fontSize,
        borderRadius: _scaleText(40).fontSize,
        overflow: 'hidden'
    },
    profileImg: {
        height: '100%',
        width: '100%',
    },
    coverImageWrapper: {
        flex: 2,
        paddingVertical: _scaleText(22).fontSize,
        paddingHorizontal: _scaleText(10).fontSize,
    },
    lineContainer: {
        height: '100%',
        width: 1,
        backgroundColor: '#e3e5e8',
        marginHorizontal: _scaleText(10).fontSize,
    },
    date: {
        color: LINE_COLOR,
        fontFamily: 'SFProText-Regular'
    },
    textContentWrapper: {
        flex: 7,
        flexDirection: 'row',
        borderColor: 'transparent',
        borderBottomColor: '#f0f0f2',
        borderWidth: 1,
        paddingVertical: _scaleText(20).fontSize,
        alignItems: 'center'
    },
    roomNameWrapper: {
        flex: 6,
        maxWidth: _scaleText(200).fontSize,
        justifyContent: 'center'
    },
    roomName: {
        fontFamily: 'SFProText-Regular',
        fontSize: _scaleText(20).fontSize,
        textAlignVertical: 'center'
    },
    memberCountText: {
        fontFamily: 'SFProText-Regular',
        fontSize: _scaleText(15).fontSize,
        color: LINE_COLOR,
        textAlignVertical: 'center'
    },
    unreadTextWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    unreadText: {
        flex: 1,
        paddingVertical: _scaleText(13).fontSize,
        fontFamily: 'SFProText-Bold',
        fontSize: _scaleText(18).fontSize,
        color: JOIN_BUTTON_COLOR,
        textAlign: 'center',
        textAlignVertical: 'top'
    },
});