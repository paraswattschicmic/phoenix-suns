import { sbGetGroupChannel } from './groupChannel';
import { sbGetOpenChannel } from './openChannel';

export const sbCreatePreviousMessageListQuery = (channelUrl, isOpenChannel) => {
  return new Promise((resolve, reject) => {
    if (isOpenChannel) {
      sbGetOpenChannel(channelUrl)
        .then(channel => resolve(channel.createPreviousMessageListQuery()))
        .catch(error => reject(error));
    } else {
      sbGetGroupChannel(channelUrl)
        .then(channel => {
          // console.log('channel', channel, ' ============== channel.createPreviousMessageListQuery()', channel.createPreviousMessageListQuery());
          resolve(channel.createPreviousMessageListQuery())
        })
        .catch(error => reject(error));
    }
  });
};

export const sbMarkAsRead = ({ channelUrl, channel }) => {
  if (channel) {
    channel.markAsRead();
  } else {
    sbGetGroupChannel(channelUrl).then(channel => channel.markAsRead());
  }
};
