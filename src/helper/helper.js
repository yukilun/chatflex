import * as dayjs from 'dayjs';

export function getChatId(user, toUser) {
    return user.uid > toUser.uid ? user.uid + toUser.uid : toUser.uid + user.uid;
}

export function getToUser(user, chatId) {
    const uids = chatId.match(/.{1,28}/g);
    return uids[0] !== user.uid ? uids[0] : uids[1];  
}

export function formatTime(timestamp) {
    const msgTime = dayjs(timestamp);
    const today = dayjs();
    if(msgTime.isSame(today, 'day')) {
        return msgTime.format('[Today], hh:mm A')
    }
    else if(msgTime.isSame(today.subtract(1, 'day'), 'day')) {
        return msgTime.format('[Yesterday], hh:mm A')
    }
    else if(msgTime.isSame(today, 'year')) {
        return msgTime.isSame(today,'week') ? msgTime.format('ddd, hh:mm A') : msgTime.format('MMM D, hh:mm A');
    }
    else {
        return msgTime.format('MMM D YYYY, hh:mm A');
    }
}