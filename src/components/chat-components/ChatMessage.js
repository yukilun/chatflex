import React, {useContext, forwardRef} from 'react'
import { UserContext } from '../../context/UserContext';
import { ChatContext } from '../../context/ChatContext';
import './ChatMessage.scss';
import avatar from '../../assets/avatar.png';
import { formatTime } from '../../helper/helper';

export const ChatMessage = forwardRef (({ message, isSender }, ref)=>{

    const { chat } = useContext(ChatContext); 
    const { currentUser: user } = useContext(UserContext);

    return (
        <div className={'chat-message ' + (isSender ? 'on-right' : 'on-left')} ref={ref}>
            <div className={'chat-message-item ' + (isSender ? 'on-right' : 'on-left')}>
                <div className={'chat-message-item__body '+ (isSender ? 'on-right' : 'on-left')}>
                    <img className='icon' src={ isSender? (user.photoURL? user.photoURL : avatar) : (chat.toUser.photoURL? chat.toUser.photoURL: avatar)} alt="user icon" />
                    <div className='message'>
                        {message.image && <img className='image' src={message.image} alt='message img'/>}
                        <p>{message.text}</p>
                    </div>
                </div>
                <div className={'chat-message-item__time '+ (isSender ? 'on-right' : 'on-left')}>{formatTime(message.time)}</div>
            </div>
        </div>
    )
});
