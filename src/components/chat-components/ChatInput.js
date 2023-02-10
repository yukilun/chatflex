import React, { useState, useRef, useEffect, useContext } from 'react'
import './ChatInput.scss';
import { BsImageFill } from 'react-icons/bs';
import { FaTelegramPlane } from 'react-icons/fa';
import { ChatContext } from '../../context/ChatContext';
import { toast } from 'react-toastify';
import { db, storage } from '../../firebase';
import { UserContext } from '../../context/UserContext';
import { serverTimestamp, set, child, ref, get, push } from 'firebase/database';
import { uploadBytesResumable, ref as sRef, getDownloadURL } from 'firebase/storage';

export default function ChatInput() {
    const { currentUser: user } = useContext(UserContext);
    const { chat } = useContext(ChatContext);
    const inputRef = useRef(null);
    const textRef = useRef(null);
    const btnRef = useRef(null);
    const imgRef = useRef(null);
    const [text, setText] = useState('');
    const [image, setImage] = useState(null);


    useEffect(() => {
        if (image) {
            inputRef.current.scroll({ bottom: 0 });
        }
    }, [image]);

    const handleKey = (e) => {
        // check the cursor pointer 
        // (if user point to the start of div, they can delete the image with backspace)
        const range = document.getSelection().getRangeAt(0);
        const copyRange = range.cloneRange();
        copyRange.selectNodeContents(e.target);
        const positionStart = range.startOffset;
        const positionEnd = range.endOffset;
        if (e.key === 'Enter') { 
            e.preventDefault(); // prevent any break added inside the input div
            btnRef.current.click();
        }
        else if (e.key === 'Backspace' && positionStart === 0 && positionEnd === 0) {
            setImage(null);
        }
    }

    const handleChangeImage = (e) => {
        setImage(e.target.files[0]);
        e.target.value = "";
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        // clear input
        if(imgRef.current) imgRef.current.classList.add('invisible');
        textRef.current.innerHTML = null;
        // make sure no submission if text and image are both null
        if (text || image) {
            toast.dismiss();
            try {
                //check whether the chatId has been added
                const snapshot = await get(child(ref(db), `chats/${user.uid}/${chat.chatId}`));
                if (!snapshot.exists()) {
                    await Promise.all([
                        set(ref(db, `chats/${user.uid}/${chat.chatId}`), {
                            chatId: chat.chatId
                        }),
                        set(ref(db, `chats/${chat.toUser.uid}/${chat.chatId}`), {
                            chatId: chat.chatId
                        })
                    ]);
                }
                const time = serverTimestamp();
                let message = { text, image: '', time, sender: user.uid };
                // upload image if needed
                if (image) {
                    const storageRef = sRef(storage, `${chat.chatId + time}`);
                    await uploadBytesResumable(storageRef, image);
                    let downloadURL = await getDownloadURL(storageRef);
                    message = { ...message, image: downloadURL };
                }
                // writing to the database for both users
                await Promise.all([
                    set(ref(db, `chats/${user.uid}/${chat.chatId}/lastMessage`), message),
                    set(ref(db, `chats/${chat.toUser.uid}/${chat.chatId}/lastMessage`), message),
                    set(push(ref(db, `messages/${chat.chatId}`)), message)
                ]);
                // reset text and image
                setText('');
                setImage(null);
                if(imgRef.current) imgRef.current.classList.remove('invisible');
            }
            catch (err) {
                toast.error(`Something went wrong! Unable to send the message: ${err}`);
            }
        }
    }

    return (
        <form className='chat-input' onSubmit={handleSubmit}>
            <div className='input-message' ref={inputRef}>
                {image && <img className='input-message__image' src={URL.createObjectURL(image)} alt="message" ref={imgRef}/>}
                <div className="input-message__text" aria-label='text input' contentEditable onInput={(e) => setText(e.target.innerText)} onKeyDown={handleKey} ref={textRef}></div>
            </div>
            <div className="input-image">
                <label htmlFor="image">
                    <BsImageFill />
                </label>
                <input type="file" id="image" accept="image/*" onChange={handleChangeImage} />
            </div>
            <button type='submit' className="btn-theme submit" ref={btnRef}><FaTelegramPlane /></button>
        </form>
    )
}
