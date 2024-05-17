import { useEffect, useState } from 'react';
import './login.css'
import '../Signup/signup.css'
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import upload from '../../lib/upload';

const Login = ({ setUserLogged }) => {
  const [isRightPanelActive, setRightPanelActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [avatar, setAvatar] = useState({
    file: null,
    url: ""
  });

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0])
      })
    }
  }

  const handleSignIn = () => {
    setRightPanelActive(false);
  };

  const handleSignUp = () => {
    setRightPanelActive(true);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    try {
      const imgUrl = await upload(avatar.file);
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: []
      });
      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });
      toast.success("Account created! You can login now.");
      setRightPanelActive(false);
    }
    catch (error) {
      console.log(error)
      toast.error(error.msg)
    }
    finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login Successful");
      localStorage.setItem('userLogged', 'true');
      setUserLogged(true);
    }
    catch (error) {
      console.log(error);
      toast.error("Something went wrong! Try signup properly.");
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`container ${isRightPanelActive ? 'right-panel-active' : ''}`}>
      {/* Sign Up */}
      <div className="container__form container--signup">
        <div className='container-inner'>
          <h2 className="form__title">Sign <span>up</span></h2>
          <form action="#" className="form" id="form1" onSubmit={handleRegister}>
            <label htmlFor="file" id='avtImg'>
              <img src={avatar.url || "./avatar.png"} alt="userImg" />
              Upload a Photo
            </label>
            <input type="file" id='file' style={{ display: 'none' }} onChange={handleAvatar} />
            <label htmlFor="username">User Name</label>
            <input type="text" placeholder='Enter Name' className='input' name='username' />
            <label htmlFor="email">Email</label>
            <input type="email" name="email" placeholder='Enter Email' className='input' />
            <label htmlFor="password">Password</label>
            <input type="password" placeholder="Enter Password" id="password1" className='input' name='password' />
            <button className="btn" disabled={isLoading}>{isLoading ? "Loading..." : 'Sign Up'}</button>
          </form>
        </div>
      </div>

      {/* Sign In */}
      <div className="container__form container--signin">
        <div className='container-inner' id='container2'>
          <h2 className="form__title">Sign <span>in</span></h2>

          <form action="#" className="form" id="form2" onSubmit={handleLogin}>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" placeholder='Enter Email' className='input' />
            <label htmlFor="password">Password</label>
            <input type="password" placeholder="Password" id="password" name='password' className='input' />
            <a href="#" className="link">Forgot your password?</a>
            <button className="btn">Sign In</button>
          </form>
        </div>

      </div>

      {/* Overlay */}
      <div className="container__overlay">
        <img src="https://cdn.pixelbin.io/v2/dummy-cloudname/original/erasebg_assets/common/favicon.ico" alt="Icon" id='icon' />
        <div className="overlay">
          <div className="overlay__panel overlay--left">
            <div className='left-inner'>
              <h2>Welcome!&nbsp;<span>To BlazeChat</span></h2>
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolor porro iure dignissimos eligendi nisi deserunt at a voluptatem, ipsum inventore accusantium culpa possimus temporibus fuga enim in ut incidunt pariatur!</p>
              <span>Already have an account?&nbsp; <button className="btn" id="signIn" onClick={handleSignIn}>Sign In</button></span>
            </div>
          </div>
          <div className="overlay__panel overlay--right">
            <div className="left-inner">
              <h2>Welcome!&nbsp;<span>To BlazeChat</span></h2>
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolor porro iure dignissimos eligendi nisi deserunt at a voluptatem, ipsum inventore accusantium culpa possimus temporibus fuga enim in ut incidunt pariatur!</p>
              <span>Don't have an account?&nbsp;<button className="btn" id="signUp" onClick={handleSignUp}>Sign Up</button></span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
