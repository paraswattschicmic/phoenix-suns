import SendBird from 'sendbird';

export const sbGetChannelTitle = channel => {
  if (channel.isOpenChannel()) {
    return channel.name;
  } else {
    const { members } = channel;
    let nicknames = members
      .map(member => {
        return member.nickname;
      })
      .join(', ');

    if (nicknames.length > 21) {
      nicknames = nicknames.substring(0, 17) + '...';
    }

    return nicknames;
  }
};