import React, { Component } from "react";
import { connect } from "react-redux";
import io from "socket.io-client";
import { PREFIX_URL, BASE_URL } from "../../shared/constants/api"

export class SocketManager {
  static sharedManager = new SocketManager();
  socket = io(BASE_URL + "?authToken:", {
    transports: ["websocket"]
  });

  establishConnection(authorizationToken) {
    if (!this.socket.connected) {
      console.log("--------Socket connection------" + BASE_URL + "?authToken=" + authorizationToken);
      this.socket = io.connect(
        BASE_URL + "?authToken=" + authorizationToken
      );

      this.socket.on("connect", socket => {
        console.log("--------Socket connected------" + this.socket.id);
      });

      this.socket.on("disconnect", function () {
        console.log("client disconnected from server");
      });
    }
  }

  disconnectConnection() {
    this.socket.disconnect();
    this.socket.removeAllListeners();
  }

  // joinEventEmit(eventName, data) {
  //   console.log("-------------1111----", eventName + JSON.stringify(data));
  //   this.socket.emit(eventName, JSON.stringify(data));
  // }
  emitEvent(eventName, data) {
    //console.log("-------------44444 Emit Event ----", eventName + JSON.stringify(data));
    this.socket.emit(eventName, JSON.stringify(data));
  }
  onJoinEvent(eventName, val = () => { }) {
    //console.log("-------------0000----" + JSON.stringify(eventName));
    this.socket.on(eventName, (res) => {
      val(res);
    //  console.log("--------------yooooo---" + JSON.stringify(res));

    });
  }
  onConnect(val = () => { }) {
    this.socket.on("connect", socket => {
      val(socket);
    });
  }
  onListenEvent(eventName, val = () => { }) {
    //console.log("-------------live----" + eventName + JSON.stringify(eventName));
    this.socket.on(eventName, (res) => {
      val(res);
      //console.log("--------------live---" + eventName + JSON.stringify(res));

    });
  }
  dissconnectEvent(eventName) {
   // console.log("-------------2222----" + JSON.stringify(eventName));
    this.socket.off(eventName);
  }

  receiveMessage() { }
}
