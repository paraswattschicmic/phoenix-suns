import {
  INIT_GROUP_CHANNEL,
  GROUP_CHANNEL_PROGRESS_START,
  GROUP_CHANNEL_PROGRESS_END,
  GROUP_CHANNEL_LIST_SUCCESS,
  GROUP_CHANNEL_LIST_FAIL,
  GET_GROUP_CHANNEL_SUCCESS,
  GET_GROUP_CHANNEL_FAIL,
  CHANNEL_EDIT_SUCCESS,
  CHANNEL_EDIT_FAIL,
  ADD_GROUP_CHANNEL_ITEM,
  CLEAR_SELECTED_GROUP_CHANNEL,
  GROUP_CHANNEL_CHANGED
} from './types';
import {  sbGetGroupChannel } from './sendbirdActions';
import SendBird from 'sendbird';

export const initGroupChannel = () => {
  const sb = SendBird.getInstance();
  sb.removeAllChannelHandlers();
  return { type: INIT_GROUP_CHANNEL };
};

export const groupChannelProgress = start => {
  return {
    type: start ? GROUP_CHANNEL_PROGRESS_START : GROUP_CHANNEL_PROGRESS_END
  };
};



export const onGroupChannelPress = channelUrl => {
  return dispatch => {
    return sbGetGroupChannel(channelUrl)
      .then(channel =>
        dispatch({
          type: GET_GROUP_CHANNEL_SUCCESS,
          channel: channel
        })
      )
      .catch(error => dispatch({ type: GET_GROUP_CHANNEL_FAIL }));
  };
};

export const addGroupChannelItem = channel => {
  return {
    type: ADD_GROUP_CHANNEL_ITEM,
    channel: channel
  };
};

export const clearSelectedGroupChannel = () => {
  return { type: CLEAR_SELECTED_GROUP_CHANNEL };
};

export const createGroupChannelListHandler = () => {
  return dispatch => {
    const sb = SendBird.getInstance();
    let channelHandler = new sb.ChannelHandler();
    channelHandler.onChannelChanged = channel => {
      dispatch({
        type: GROUP_CHANNEL_CHANGED,
        channel: channel
      });
    };
    sb.addChannelHandler('GROUP_CHANNEL_LIST_HANDLER', channelHandler);
    return;
  };
};
