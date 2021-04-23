import React, { Component } from "react";
import { View, Text, TouchableOpacity, Clipboard } from "react-native";
import { Icon } from "react-native-elements";
import { _scaleText } from "../../../shared";
//import Clipboard from "@react-native-community/clipboard";
import Toast from "react-native-simple-toast";

const TextItem = (props) => {
  // console.log("props.message", props.message)
  return (
    <View style={{ borderWidth: 0 }}>
      <Text
        style={{
          flex: 1,
          flexWrap: "wrap",
          // padding: _scaleText(10).fontSize,
          // paddingRight: _scaleText(30).fontSize,
          // marginRight: _scaleText(15).fontSize,
          fontSize: _scaleText(17).fontSize,
          color: props.isUser ? "#FFFFFF" : "#FFFFFF",
        }}
      >
        {props.message}
      </Text>
    </View>
  );
};

class FileItem extends Component {
  constructor(props) {
    super(props);
  }

  _renderMessage() {
    if ((this.props.message || {}).length > 13) {
      return this.props.message.substring(0, 10) + "...";
    }
    return this.props.message;
  }

  render() {
    return (
      <View style={{ flexDirection: "row" }}>
        <Icon
          containerStyle={{ marginLeft: 0 }}
          iconStyle={{ margin: 0, padding: 0 }}
          name="file"
          type="font-awesome"
          color={this.props.isUser ? "#fff" : "#000"}
          size={16}
        />
        <Text style={{ marginLeft: 8 }}>{this._renderMessage()}</Text>
      </View>
    );
  }
}

const styles = {};

export { TextItem, FileItem };
