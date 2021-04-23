/* eslint-disable prettier/prettier */
import { StyleSheet, ActivityIndicator, View, FlatList, Text } from 'react-native';
import Message from '../Message/index';
import { _scaleText } from '../../../shared';
import React, { useRef, useCallback, useEffect } from 'react';



function ChatListComponent({ chatList, userData, channel, isUserHost, isUserBanned, forceUpdate, cachedFileItems, getMessageList, onLikePress, onMessageSelected, isIntialLoading, hasMore, selectedMessage, setFalseScrollToBottom, scrollToBottom, onClickReport, onClickRemove }) {
    const chatListRef = useRef();

    // const actionOnLikePress = useCallback(() => {
    //     props.onLikePress(item)
    // })
    const renderLoader = () => {
        return <ActivityIndicator color={'gray'} size={'small'}></ActivityIndicator>
    }
    const renderEmpty = () => {
        return <View></View>
    }


    const renderList = ({ item, index }) => {
        const message = item;
        const isOpenChannel = true;
        const actionOnLikePress = () => {
            actionOnPressLike(message)
        }
        const onPressReport = () => {
            actionOnPressReport(message)
        }
        const onPressRemove = () => {
            actionOnPressRemove(message)
        }
        const actionMessageSelected = () => {
            actionOnMessageSelected(message)
        }
        const actionOnAvatarPress = () => {
        }


        let localUriPath = ''
        if (cachedFileItems && cachedFileItems[item.messageId]) {
            localUriPath = cachedFileItems[item.messageId];
        }
        if (message) {
            var fullName = message && message._sender && message._sender.nickname ? message._sender.nickname : ''
            var fullnameParts = fullName ? fullName.split(" ") : '';
            var firstName = fullnameParts && fullnameParts[0] && fullnameParts && fullnameParts[0] != '' ? fullnameParts && fullnameParts[0] : ''
            if (firstName == '') {
                firstName = message && message._sender && message._sender.nickname ? message._sender.nickname : ''
            }
            let isSelected = false
            if (selectedMessage && selectedMessage.messageId && selectedMessage.messageId == message.messageId) {
                isSelected = true;
            }

            let isCurrentUser = true
            let isAdminMessage = false
            if (message
                && message._sender
                && message._sender.userId
                && message._sender.userId !== userData._id
            ) {
                isCurrentUser = false;
            }
            if (message.messageType && message.messageType === 'admin') {
                isAdminMessage = true;
                isCurrentUser = false;
            }
            return (
                <View style={styles.messageListItemViewStyle}>
                    <Message
                        key={message.messageId ? message.messageId : message.reqId}
                        index={index}
                        isShow={false}
                        messageIsSelected={isSelected}
                        localUriPath={localUriPath}
                        messageSelected={actionMessageSelected}
                        userId={userData._id}
                        isUserHost={isUserHost}
                        isUserBanned={isUserBanned}
                        // isUser={message && message._sender && message._sender.userId && message._sender.userId === userData._id}
                        isUser={isCurrentUser}
                        isAdminMessage={isAdminMessage}
                        profileUrl={message && message._sender && message._sender.plainProfileUrl && message._sender.plainProfileUrl.replace('http://', 'https://')}
                        onAvatarPress={actionOnAvatarPress}
                        onLikePress={actionOnLikePress}
                        actionOnPressReport={onPressReport}
                        actionOnPressRemove={onPressRemove}
                        nickname={firstName}
                        time={''}
                        isEdited={false}
                        userData={userData}
                        forceUpdate={forceUpdate}
                        // readCount={isOpenChannel || !channel ? 0 : channel.getReadReceipt(message)}
                        message={message}
                    />
                </View>

            );
        } else {
            return null;
        }
    };
    const actionGetMessageList = () => {
        getMessageList(false)

    };
    const actionOnPressLike = (item) => {
        onLikePress(item);

    }
    const actionOnPressRemove = (item) => {
        onClickRemove(item);

    }
    const actionOnPressReport = (item) => {
        onClickReport(item);

    }
    const actionOnMessageSelected = (item) => {
        onMessageSelected(item)
    }

    useEffect(() => {
        if (scrollToBottom) {
            if (chatListRef.current) {
                chatListRef.current.scrollToIndex({ animated: true, index: 0 });
                setFalseScrollToBottom();
            }
        }
    }, [scrollToBottom])


    let keyExtractor = (item, index) => item.messageId + '';

    return (
        <View style={styles.messageListViewStyle}>
            {isIntialLoading ?
                <View style={{ height: '100%', width: '100%', justifyContent: 'center' }}>
                    <ActivityIndicator color='gray' size='large' />
                </View>
                :
                <FlatList
                    inverted
                    ref={chatListRef}
                    data={chatList}
                    contentContainerStyle={styles.listContainerStyle}
                    extraData={forceUpdate}
                    windowSize={10}
                    keyExtractor={keyExtractor}
                    onEndReached={actionGetMessageList}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={hasMore ? renderLoader : renderEmpty}
                    renderItem={renderList}
                    ListEmptyComponent={!isIntialLoading
                        && <View style={styles.mainContainerEmptyView}>
                            <Text>No Message yet.</Text>
                        </View>
                    }
                />
            }
        </View>
    );
};

const styles = StyleSheet.create({
    listContainerStyle: {
        paddingHorizontal: _scaleText(10).fontSize,
        flexGrow: 1, justifyContent: 'flex-end',
    },
    messageListViewStyle: {
        flex: 1,
    },
    messageListItemViewStyle: {
        transform: [{ scaleY: -1 }],
    },
    mainContainerEmptyView: {
        flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: _scaleText(10).fontSize
    }
});

const ChatList = React.memo(ChatListComponent);
export default ChatList;
