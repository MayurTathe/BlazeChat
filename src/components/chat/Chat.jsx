import { useEffect, useState } from 'react';
import './chat.css'
import EmojiPicker from 'emoji-picker-react';
import { useRef } from 'react';
import { arrayUnion, doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useChatStore } from '../../lib/chatStore';
import { useUserStore } from '../../lib/userStore';
import upload from '../../lib/upload';

const Chat = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [chat, setChat] = useState();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked  } = useChatStore();
  const { currentUser } = useUserStore();

  const endRef = useRef(null);
  const [img, setImg] = useState({
    file: null,
    url: ""
  });

  // useEffect(() => {
  //   endRef.current?.scrollIntoView({ behavior: 'smooth' });
  // }, [chat.messages])
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    })
    return () => {
      unSub();
    }
  }, [chatId])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [])


  // console.log("Chats messages", chat);

  const handleEmoji = (e) => {
    setText((prev) => prev + e.emoji);
    setOpen(false);
  }

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      })
    }
  }

  const handleSend = async () => {
    console.log("handleSend called");
    if (text === "") return;

    let imgUrl = null;

    try {
      if (img.file) {
        imgUrl = await upload(img.file);
      }
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl })
        }),
      });

      const userIDs = [currentUser.id, user.id];

      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatsSnapShot = await getDoc(userChatsRef);

        if (userChatsSnapShot.exists()) {
          const userChatsData = userChatsSnapShot.data();
          // console.log("Document data:", userChatsData);
          const chatIndex = userChatsData.chats.findIndex((c) => c.chatId === chatId);
          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });

        } else {
          console.log("No such document!");
        }
      });

      setImg({
        file: null,
        url: ""
      });
      setText("");

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='chat'>
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="" />
          <div className="text">
            <span>{user?.username}</span>
            <p>Lorem itus blanditiis nam labore vel!</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>

      <div className="center">

        {
          chat?.messages?.map((message) => (
            <div className={message.senderId === currentUser?.id ?"message own" : "message"} key={message?.createdAt}>
              <div className="texts">
                {message.img && <img src={message.img} alt="" />}
                <p>{message.text}</p>
                {/* <span>1 min ago</span>    */}
              </div>
            </div>
          ))
        }

        {img.url && <div className="message own">
          <div className="texts">
            <img src={img.url} alt="sendImg"/>
          </div>
        </div>}
        {/* <div className="message own">
          <div className="texts">
            <img src="./IceBurg.jpg" alt="" />
            <p>Hello Im the Message</p>
            <span>1 min ago</span>
          </div>
        </div> */}

        <div ref={endRef}></div>
      </div>

      <div className="bottom">
        <div className="icons">
          <label htmlFor="file" id='img'>
            <img src="./img.png"  id='imgSendIcon' title='Send Images' alt="imgSend" disabled={isCurrentUserBlocked || isReceiverBlocked}/>
          </label>
          <input type="file" id='file' style={{ display: 'none' }} onChange={handleImg} name='file'/>
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input type="text" placeholder={isCurrentUserBlocked || isReceiverBlocked ? "You cannot send a message..."  :'Type a message...'} onChange={(e) => { setText(e.target.value) }} value={text} style={{ placeholder: 'white' }} disabled={isCurrentUserBlocked || isReceiverBlocked}/>
        <div className="emoji">
          <img src="./emoji.png" alt="" onClick={() => setOpen(prev => !prev)} />
          <div className="picker">
            <EmojiPicker open={open} onEmojiClick={handleEmoji} />
          </div>
        </div>
        {/* <button className='sendButton'>Send</button> */}
        <button className='sendButton' onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
      </div>
    </div>
  )
}

export default Chat;
