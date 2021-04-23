import SendBird from 'sendbird';

export const sbGetOpenChannel = channelUrl => {
  return new Promise((resolve, reject) => {
    const sb = SendBird.getInstance();
    sb.OpenChannel.getChannel(channelUrl, (channel, error) => {
      if (error) {
        reject(error);
      } else {
        resolve(channel);
      }
    });
  });
};


export const sbOpenChannelEnter = channel => {
  return new Promise((resolve, reject) => {
    channel.enter((response, error) => {
      if (error) {
        reject(error);
      } else {
        resolve(channel);
      }
    });
  });
};
