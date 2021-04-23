import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
// import Video from 'react-native-video';
import { FileItem, TextItem } from "../MessageItem";
import RNUrlPreview from "../LinkPreview";
import { ImageItem } from "../ImageItem";
import {
  _scaleText,
  COLLYDE_PRIMARY_BLUE_COLOR,
  COLLYDE_MESSAGE_BUBBLE_BACKGROUND_COLOR,
  COLLYDE_MESSAGE_BUBBLE_BACKGROUND_OTHER_NEW_COLOR,
  COLLYDE_MESSAGE_BUBBLE_BACKGROUND_NEW_COLOR,
  TEXT_CONST,
} from "../../../shared";
import Icon from "react-native-vector-icons/AntDesign";
import AntDesign from "react-native-vector-icons/AntDesign";
import IconFontAwesome from "react-native-vector-icons/FontAwesome5";

const _isVideo = (props = {}) => {
  return ((props.message || {}).type || "").match(/^video\/.+$/);
};

const _isImage = (props = {}) => {
  return ((props.message || {}).type || "").match(/^image\/.+$/);
};

export class MessageBubble extends Component {
  constructor(props) {
    super(props);
  }

  _renderNickname = (nickname) => {
    return nickname ? (
      <Text style={{ fontSize: _scaleText(18).fontSize, color: "#424950", paddingBottom: 4 }}>{nickname}</Text>
    ) : null;
  };

  _renderMessageItem = (message) => {
    if (message.messageType == "user" || message.messageType == "admin") {
      if (message.message && (message.message.includes("http") || message.message.includes("www."))) {
        let url = "";
        if (message.message.includes("www.") && !message.message.includes("http")) {
          url = "https://" + message.message;
        } else {
          url = message.message;
        }
        return (
          <View style={{ flex: 1, flexWrap: "wrap", width: "100%", minHeight: _scaleText(70).fontSize }}>
            <RNUrlPreview
              titleNumberOfLines={1}
              descriptionNumberOfLines={2}
              containerStyle={{ backgroundColor: "transparent", flexWrap: "wrap", flex: 1 }}
              faviconStyle={{
                height: "100%",
                width: _scaleText(80).fontSize,
                borderTopLeftRadius: _scaleText(10).fontSize,
                borderBottomLeftRadius: _scaleText(10).fontSize,
              }}
              imageStyle={{
                height: "100%",
                width: _scaleText(80).fontSize,
                borderTopLeftRadius: _scaleText(10).fontSize,
                borderBottomLeftRadius: _scaleText(10).fontSize,
              }}
              imageProps={{ resizeMode: "cover", overflow: "hidden" }}
              text={(url, url)}
            />
          </View>
        );
      } else {
        return <TextItem isUser={this.props.isUser} message={message.message + " "} />;
      }
    } else if (_isImage(this.props)) {
      let strAuthedUrl = "";
      if (message.url) {
        //url exist
      } else {
        if (message && message.thumbnails && message.thumbnails.length && message.thumbnails.length > 0) {
          strAuthedUrl = message.thumbnails[0].url.split("?")[1];
          strAuthedUrl = `${message.plainUrl}?${strAuthedUrl}`;
        }
      }
      return (
        <ImageItem
          localUriPath={
            this.props.localUriPath ? this.props.localUriPath.replace("http://", "https://") : this.props.localUriPath
          }
          isUser={this.props.isUser}
          message={
            message.tempUri
              ? message.tempUri.replace("http://", "https://")
              : message.url
              ? message.url.replace("http://", "https://")
              : strAuthedUrl
              ? strAuthedUrl
              : ""
          }
        />
      );
    } else if (_isVideo(this.props)) {
      return (
        <View style={styles.videoContainer}>
          {/* <Video source={{ uri: message.url }} style={styles.video} paused={true} controls={true} /> */}
        </View>
      );
    } else {
      // return <FileItem isUser={this.props.isUser} message={message.name} />;
      return <FileItem isUser={this.props.isUser} message={message.name} />;
    }
  };
  _hasOwnReaction = () => {
    let hasOwnReaction = false;
    if (this.props.message && this.props.message && this.props.message.reactions) {
      let reactionList = this.props.message.reactions;
      hasOwnReaction =
        reactionList &&
        reactionList[0] &&
        reactionList[0].userIds &&
        reactionList[0].userIds.includes(this.props.userData._id)
          ? true
          : false;
    }
    return hasOwnReaction;
  };

  _reactionListCount = () => {
    let count = "";
    if (this.props.message && this.props.message && this.props.message.reactions) {
      let reactionList = this.props.message.reactions;
      if (reactionList && reactionList[0] && reactionList[0].userIds && reactionList[0].userIds.length) {
        count = reactionList[0].userIds.length.toString();
      }
    }
    return count;
  };
  onLikePress = () => {
    this.props.onLikePress();
  };

  onPressMenu = () => {
    if (!this.props.isUser && !this.props.isUserBanned && !this.isHost() && !this.props.isAdmin) {
      this.props.onPressMenu();
    } else {
      this.props.onMessageCopy();
    }
  };
  isHost = () => {
    return this.props.message._sender &&
      this.props.message._sender.role &&
      this.props.message._sender.role === TEXT_CONST.IS_GROUP_HOST
      ? true
      : false;
  };

  render() {
    const message = this.props.message;
    const styles = {
      videoContainer: {
        minWidth: 240,
        minHeight: 180,
        marginBottom: 4,
        borderRadius: 8,
      },
      video: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        borderRadius: 8,
      },
      favoriteViewContainer: {
        flexDirection: "row",
        paddingVertical: _scaleText(5).fontSize,
      },
      textReactionsCount: {
        textAlign: "center",
        textAlignVertical: "center",
        fontSize: _scaleText(16).fontSize,
        marginLeft: _scaleText(3).fontSize,
        color: COLLYDE_PRIMARY_BLUE_COLOR,
        //marginTop: _scaleText(-12).fontSize,
      },
      textGrayReactionsCount: {
        textAlign: "center",
        textAlignVertical: "center",
        fontSize: _scaleText(16).fontSize,
        marginLeft: _scaleText(3).fontSize,
        color: COLLYDE_PRIMARY_BLUE_COLOR,
        // marginTop: _scaleText(-12).fontSize,
        color: "gray",
      },
      trophyIcon: {
        width: _scaleText(20).fontSize,
        height: _scaleText(20).fontSize,
        marginLeft: this.props.isUser ? _scaleText(5).fontSize : _scaleText(15).fontSize,
      },
      otherUserBubble: {
        flexDirection: "row",
        alignSelf: "flex-start",
        backgroundColor: COLLYDE_MESSAGE_BUBBLE_BACKGROUND_OTHER_NEW_COLOR,
        fontSize: _scaleText(14).fontSize,
        borderRadius: _scaleText(10).fontSize,
        padding: _scaleText(10).fontSize,
        paddingLeft: _scaleText(15).fontSize,
      },
      otherUserBubbleImage: {
        flexDirection: "row",
        alignSelf: "flex-start",
        fontSize: _scaleText(14).fontSize,
        borderRadius: _scaleText(10).fontSize,
        paddingVertical: _scaleText(5).fontSize,
      },
      adminBubble: {
        flexDirection: "row",
        alignSelf: "flex-start",
        backgroundColor: COLLYDE_PRIMARY_BLUE_COLOR,
        fontSize: _scaleText(14).fontSize,
        borderRadius: _scaleText(10).fontSize,
        padding: _scaleText(10).fontSize,
        paddingLeft: _scaleText(15).fontSize,
      },
      otherUserBubbleWrap: {
        borderRadius: 8,
        paddingTop: 0,
        paddingLeft: 8,
        // flex: 1,
        maxWidth: "79%",
      },
      adminBubbleWrap: {
        borderRadius: 8,
        paddingTop: 0,
        paddingLeft: 8,
        flex: 1,
        maxWidth: "100%",
      },
      currentUserBubble: {
        flexDirection: "row",
        alignSelf: "flex-end",
        backgroundColor: COLLYDE_MESSAGE_BUBBLE_BACKGROUND_NEW_COLOR,
        fontSize: _scaleText(14).fontSize,
        borderRadius: _scaleText(10).fontSize,
        padding: _scaleText(10).fontSize,
        maxWidth: "82%"
      },
      currentUserBubbleImage: {
        flexDirection: "row",
        alignSelf: "flex-end",
        fontSize: _scaleText(14).fontSize,
        borderRadius: _scaleText(10).fontSize,
        paddingVertical: _scaleText(5).fontSize,
      },
      currentUserBubbleWrap: {
        borderRadius: 8,
        paddingTop: 0,
        paddingRight: 8,
        flex: 1,
        maxWidth: "100%",
        justifyContent: "flex-end",
        //alignContent: 'flex-end', alignItems: 'flex-end'
      },
    };
    if (!message) {
      return null;
    }
    const _renderTrophy = () => {
      return (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            opacity: this.props.message.isSending ? 0 : 1,
            width: this.props.isUser ? _scaleText(50).fontSize : "auto",
          }}
        >
          <TouchableOpacity
            disabled={this.props.message.isSending}
            onPress={this.onLikePress}
            style={styles.favoriteViewContainer}
          >
            {this._hasOwnReaction() || this.props.isUser ? (
              <View
                style={{
                  flexDirection: this.props.isUser ? "row-reverse" : "row",
                  height: "100%",
                  marginBottom: this.props.isUser ? _scaleText(10).fontSize : _scaleText(0).fontSize,
                }}
              >
                <Image
                  // source={require('../../../assets/icons/active_trophyIcon.png')}
                  source={
                    this._hasOwnReaction()
                      ? require("../../../assets/icons/active_trophyIcon.png")
                      : require("../../../assets/icons/trophyIcon.png")
                  }
                  style={styles.trophyIcon}
                />
                <Text style={this._hasOwnReaction() ? styles.textReactionsCount : styles.textGrayReactionsCount}>
                  {this._reactionListCount()}
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: "row",
                  height: "100%",
                  marginBottom: this.props.isUser ? _scaleText(10).fontSize : _scaleText(0).fontSize,
                }}
              >
                <Image source={require("../../../assets/icons/trophyIcon.png")} style={styles.trophyIcon} />
                <Text style={this._hasOwnReaction() ? styles.textReactionsCount : styles.textGrayReactionsCount}>
                  {this._reactionListCount()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      );
    };

    return (
      <TouchableOpacity
        onLongPress={this.onPressMenu}
        style={
          this.props.isUser
            ? styles.currentUserBubbleWrap
            : this.props.isAdmin
            ? styles.adminBubbleWrap
            : styles.otherUserBubbleWrap
        }
      >
        <View style={{ flexDirection: "row" }}>
          {this.props.isUser && <View style={{ flex: 1 }}></View>}

          {this._renderNickname(this.props.isAdmin ? "Admin Message" : this.props.nickname)}
        </View>

        {this.props.message ? (
          <View style={{ flexDirection: "row" }}>
            {this.props.isAdmin ? (
              <View style={styles.adminBubble}>{this._renderMessageItem(this.props.message)}</View>
            ) : this.props.isUser ? (
              <>
                <View style={{ flex: 1 }}></View>
                <View
                  style={{
                    flexDirection: "row",
                    alignContent: "flex-end",
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                  }}
                >
                  {!this.props.isAdmin && !this.props.isUserBanned && _renderTrophy()}
                  <View
                    style={[
                      _isImage(this.props) ? styles.currentUserBubbleImage : styles.currentUserBubble,
                      this.props.message &&
                      this.props.message.message &&
                      (this.props.message.message.includes("http") || this.props.message.message.includes("www."))
                        ? {
                            paddingVertical: 0,
                            backgroundColor: COLLYDE_MESSAGE_BUBBLE_BACKGROUND_NEW_COLOR,
                            borderWidth: 1,
                            borderColor: "#d9d9d9",
                            padding: 0,
                            paddingLeft: 0,
                          }
                        : null,
                    ]}
                  >
                    {this._renderMessageItem(this.props.message)}
                  </View>
                </View>
              </>
            ) : (
              // <View style={{ flex: 1, height: '100%', width: '100%', flexDirection: 'row', flexWrap: 'wrap' }}>
              //     <View style={{ flex: 1, alignContent: 'flex-end', alignItems: 'flex-end', marginRight: _scaleText(10).fontSize }}>
              //         {!this.props.isAdmin && !this.props.isUserBanned && _renderTrophy()}
              //     </View>
              //     <View style={{
              //         maxWidth: '85%',
              //     }}>
              //         <View
              //             style={_isImage(this.props) ? styles.currentUserBubbleImage : styles.currentUserBubble}
              //         >
              //             {this._renderMessageItem(this.props.message)}
              //         </View>
              //     </View>
              // </View>
              <View
                style={[
                  _isImage(this.props) ? styles.otherUserBubbleImage : styles.otherUserBubble,
                  this.props.message &&
                  this.props.message.message &&
                  (this.props.message.message.includes("http") || this.props.message.message.includes("www."))
                    ? {
                        paddingVertical: 0,
                        backgroundColor: COLLYDE_MESSAGE_BUBBLE_BACKGROUND_COLOR,
                        borderWidth: 1,
                        borderColor: "#d9d9d9",
                        padding: 0,
                        paddingLeft: 0,
                      }
                    : null,
                ]}
              >
                {this._renderMessageItem(this.props.message)}
              </View>
            )}

            {!this.props.isAdmin && !this.props.isUserBanned && !this.props.isUser && _renderTrophy()}
          </View>
        ) : null}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            paddingLeft: 8,
          }}
        >
          <Text
            style={{
              fontSize: 8,
              color: "#878d99",
            }}
          >
            {this.props.time}
          </Text>
        </View>
        {this.props.isEdited && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              paddingLeft: 8,
            }}
          >
            <Text
              style={{
                fontSize: 8,
                color: this.props.isUser ? "#E9EBEF" : "#878d99",
              }}
            >
              edited
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }
}
