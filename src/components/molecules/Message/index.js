/* eslint-disable prettier/prettier */
import React, { PureComponent, Component } from 'react';
import { View, Text, TouchableWithoutFeedback, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MessageAvatar } from '../../atoms/MessageAvatar';
import { MessageContainer } from '../MessageContainer';
import { MessageCurrentUserContainer } from '../MessageCurrentUserContainer';
import { MessageAdminContainer } from '../MessageAdminContainer';
import { connect } from 'react-redux';
import { onUserMessagePress } from '../../../redux/actions';
import { _scaleText } from '../../../shared'
import Icon from 'react-native-vector-icons/AntDesign';


class Message extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bgColor: '',
            chatmessage: {},
            isSelected: false,
            messageForceUpdate: false
        };
    }
    componentDidMount() {
        // this.setState({ reactions: this.props.message && this.props.message.reactions ? Object.assign({}, this.props.message.reactions) : {} })
    }
    static getDerivedStateFromProps(nextProps, prevState) {

        if (prevState.chatmessage != nextProps.message || prevState.isSelected != nextProps.messageIsSelected || prevState.messageForceUpdate != nextProps.forceUpdate) {
            //  console.log('get derived state ',nextProps.message.message)

            return {
                chatmessage: JSON.parse(JSON.stringify(nextProps.message)),
                isSelected: JSON.parse(JSON.stringify(nextProps.messageIsSelected)),
                messageForceUpdate: JSON.parse(JSON.stringify(nextProps.forceUpdate)),
            };
        }
        return null;
    }
    shouldComponentUpdate(nextProps, nextState) {

        if (nextProps.message.reactions && nextProps.message.reactions[0]) {
            if (this.state.chatmessage.reactions && this.state.chatmessage.reactions[0]) {
                if (nextProps.message.reactions[0].userIds.length != this.state.chatmessage.reactions[0].userIds.length) {

                    return true;
                }
            }
            else {
                return true;
            }
        }
        else {
            if (this.state.chatmessage.reactions && this.state.chatmessage.reactions[0]) {
                return true;
            }
        }
        if (nextProps.messageIsSelected != this.state.isSelected) {
            // console.log('get derived state change')

            return true;
        }
        if (nextProps.forceUpdate != this.state.messageForceUpdate) {
            //console.log('get derived state change Force    ')

            return true;
        }

        return false;
    }
    _onMessagePressed = () => {
        //console.log('YOoooooooooo ', JSON.stringify(this.props.message))
        if (this.props.message && this.props.message.messageType && this.props.message.messageType != 'file') {
            this.props.messageSelected();
        }
        //this.props.onUserMessagePress(this.props.message);
    };
    // _containsMessageWithId = (messages, messageId) => {
    //     return messages.find(message => message.messageId === messageId);
    // };

    // componentDidUpdate(prevProps) {
    //     if (!prevProps.message && !this.props.message) {
    //         return;
    //     }
    //     if (prevProps.message.reactions && prevProps.message.reactions[0]) {
    //         console.log('x')
    //     }


    // }

    _renderMessageAvatar = () => {
        return this.props.isUser ? null : (
            <MessageAvatar isShow={this.props.isShow} uri={this.props.profileUrl} onAvatarPress={this.props.onAvatarPress} />
        );
    };

    actionOnPressReport = (message) => {
        this.props.actionOnPressReport(message);
    }
    actionOnPressRemove = () => {
        this.props.actionOnPressRemove();
    }
    onLikePress = () => {
        this.props.onLikePress();
    }
    render() {
        //console.log('Message Rendered', this.props.message.messageId, '========>>>>>>>', this.props.message.message)
        return (
            <TouchableWithoutFeedback>
                <View style={this.props.messageIsSelected ? styles.messageViewStyleSelected : styles.messageViewStyle}>
                    <View
                        style={styles.mainContainerInner}
                    >
                        {/* {this._renderMessageAvatar()} */}
                        <View style={styles.containerMessageViewContainer}>
                            {
                                this.props.isAdminMessage ?
                                    <MessageAdminContainer
                                        isShow={this.props.isShow}
                                        isUser={this.props.isUser}
                                        userData={this.props.userData}
                                        nickname={this.props.nickname}
                                        onMessageCopy={this._onMessagePressed}
                                        onLikePress={this.onLikePress}
                                        message={this.props.message}
                                        time={this.props.time}
                                        isEdited={this.props.isEdited}
                                        readCount={this.props.readCount}
                                        localUriPath={this.props.localUriPath}
                                    />
                                    : !this.props.isUser ? (
                                        <MessageContainer
                                            isShow={this.props.isShow}
                                            isUser={this.props.isUser}
                                            userData={this.props.userData}
                                            nickname={this.props.nickname}
                                            onLikePress={this.onLikePress}
                                            isAdmin={false}
                                            onMessageCopy={this._onMessagePressed}
                                            isUserBanned={this.props.isUserBanned}
                                            isUserHost={this.props.isUserHost}
                                            actionOnPressReport={() => this.actionOnPressReport(this.props.message)}
                                            actionOnPressRemove={this.actionOnPressRemove}
                                            message={this.props.message}
                                            time={this.props.time}
                                            isEdited={this.props.isEdited}
                                            readCount={this.props.readCount}
                                            localUriPath={this.props.localUriPath}
                                        />
                                    ) : (
                                            <MessageCurrentUserContainer
                                                isShow={this.props.isShow}
                                                isUser={this.props.isUser}
                                                userData={this.props.userData}
                                                nickname={this.props.nickname}
                                                onLikePress={this.onLikePress}
                                                onMessageCopy={this._onMessagePressed}
                                                message={this.props.message}
                                                isAdmin={false}
                                                isUserHost={this.props.isUserHost}
                                                time={this.props.time}
                                                isEdited={this.props.isEdited}
                                                readCount={this.props.readCount}
                                                localUriPath={this.props.localUriPath}
                                            />
                                        )
                            }

                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }
}

// const AdminMessage = props => {
//     return (
//         <TouchableWithoutFeedback onLongPress={this._onMessagePressed}>
//             <View
//                 style={[
//                     styles.messageViewStyle,
//                     {
//                         padding: 8,
//                         marginTop: 8,
//                         marginBottom: 8,
//                         marginLeft: 14,
//                         marginRight: 14,
//                         backgroundColor: '#e6e9f0'
//                     }
//                 ]}
//             >
//                 <Text style={{ fontSize: _scaleText(18).fontSize }}>{props.message}</Text>
//             </View>
//         </TouchableWithoutFeedback>
//     );
// };

const styles = {
    messageViewStyle: {
        padding: 0,
        borderWidth: 0,
        borderColor: 'red',
        transform: [{ scaleY: -1 }],
        padding: _scaleText(5).fontSize
    },
    messageViewStyleSelected: {
        padding: 0,
        backgroundColor: '#d4d4d4',
        transform: [{ scaleY: -1 }]
    },
    mainContainerInner: {
        // flexDirection: 'row',
        // justifyContent: 'space-between',
        // padding: _scaleText(5).fontSize,
    },
    containerMessageViewContainer: {
        flex: 1,
        flexWrap: 'wrap',
    },
    // favoriteViewContainer: {
    //     minWidth: _scaleText(50).fontSize,
    //     flexDirection: 'row',
    //     // marginTop: _scaleText(32).fontSize,
    //     alignSelf: 'flex-start',
    //     marginLeft: 10,
    //     paddingHorizontal: _scaleText(10).fontSize,
    //     paddingVertical: _scaleText(5).fontSize
    // },
    // textReactionsCount: {
    //     color: 'black', textAlign: 'center', textAlignVertical: 'center', fontSize: _scaleText(11).fontSize, marginLeft: _scaleText(3).fontSize
    // },
};

// const mapStateToProps = ({ chatReducer }) => {
//     const { selectedMessages } = chatReducer;
//     return { selectedMessages };
// };

// const connectedMessage = connect(
//     mapStateToProps,
//     {
//         onUserMessagePress
//     }
// )(Message);

export default Message;
// export default connectedMessage;
// export { connectedMessage as Message, Message as TestMessage, AdminMessage };
