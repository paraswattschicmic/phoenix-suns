/* eslint-disable prettier/prettier */
import React, { useMemo } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { MessageBubble } from '../MessageBubble';
import { _scaleText, DEFUALT_PROFILE } from '../../../shared';
import FastImage from 'react-native-fast-image';

const MessageAdminContainer = props => {
    const onLikePress = () => {
        props.onLikePress();
    }
    const onCopyPress = () => {
        props.onMessageCopy();
    }
    return (
        <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'flex-end', marginTop: _scaleText(10).fontSize, }}>
            <MessageBubble
                isShow={props.isShow}
                isUser={false}
                isAdmin={true}
                userData={props.userData}
                onLikePress={onLikePress}
                nickname={props.nickname}
                message={props.message}
                onMessageCopy={onCopyPress}
                time={props.time}
                localUriPath={props.localUriPath}
                isEdited={props.isEdited}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    profileImgContainer: {
        height: _scaleText(55).fontSize,
        width: _scaleText(55).fontSize,
        borderRadius: _scaleText(30).fontSize,
        overflow: 'hidden',
    },
    profileImg: {
        height: _scaleText(55).fontSize,
        width: _scaleText(55).fontSize,
    },
});

export { MessageAdminContainer };
