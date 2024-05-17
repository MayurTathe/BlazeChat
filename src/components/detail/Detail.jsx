import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { useChatStore } from '../../lib/chatStore';
import { auth, db } from '../../lib/firebase'
import { useUserStore } from '../../lib/userStore'
import './detail.css'

const Detail = ({ setUserLogged }) => {

  const { currentUser } = useUserStore();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked, changeBlock } = useChatStore();
  const handleBlock = async () => {

    if (!user) return;
    const userDocRef = doc(db, "users", currentUser.id);

    try {
      await updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
      });
      changeBlock();
    } catch (error) {
      console.log(error);
    }
  }
  const handleLogout = () => {
    auth.signOut();
    const userLogged = localStorage.getItem('userLogged');
    if (userLogged === 'true') {
      localStorage.setItem('userLogged', 'false');
      setUserLogged(false);
    }
  }

  return (
    <div className='detail'>
      <div className="user">
        <img src={user?.avatar || "./avatar.png"} alt="" />
        <h3>{user?.username}</h3>
        <p>
          Lorem dipisicing
        </p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Setting</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src="./arrowUp.png" alt="" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetail">
                <img src="./avatar.png" alt="" className='media' />
                <span>photo_name.png</span>
                <img src="./download.png" alt="" className='icon' />
              </div>
            </div>
            {/* <div className="photoItem">
                <div className="photoDetail">
                  <img src="./avatar.png" alt="" className='media'/>
                  <span>photo_name.png</span>
                <img src="./download.png" alt="" className='icon'/>
                </div>
              </div> */}
            <div className="photoItem">
              <div className="photoDetail">
                <img src="./avatar.png" alt="" className='media' />
                <span>photo_name.png</span>
                <img src="./download.png" alt="" className='icon' />
              </div>
            </div>
            <div className="photoItem">
              <div className="photoDetail">
                <img src="./avatar.png" alt="" className='media' />
                <span>photo_name.png</span>
                <img src="./download.png" alt="" className='icon' />
              </div>
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared files</span>
            <img src="./arrowUp.png" alt="" />
          </div>
        </div>
        <button onClick={handleBlock}>{isCurrentUserBlocked ? "You are Blocked!" : isReceiverBlocked ? "User Blocked" : "Block User"}</button>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    </div >
  )
}

export default Detail
