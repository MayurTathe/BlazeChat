import React, { useState } from 'react';
import './signup.css';

const Signup = () => {
    const [isSignUp, setIsSignUp] = useState(false);

    const toggleSignUp = () => {
        setIsSignUp(!isSignUp);
    };

    return (
        <div className='login'>
            <div className={`item1 ${isSignUp ? 'slide-out' : ''}`}>
                <img src="https://cdn.pixelbin.io/v2/dummy-cloudname/original/erasebg_assets/common/favicon.ico" alt="Icon" />
                <div className="container" style={isSignUp ? { display: 'none' } : { display: 'flex' }}>
                    <h2>Welcome!&nbsp;<span>To BlazeChat</span></h2>
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolor porro iure dignissimos eligendi nisi deserunt at a voluptatem, ipsum inventore accusantium culpa possimus temporibus fuga enim in ut incidunt pariatur!</p>
                    <span>Don't have an account?&nbsp;<button onClick={toggleSignUp}>Sign up</button></span>
                </div>

                <div className="container" style={!isSignUp ? { display: 'none' } : { display: 'flex' }}>
                    <h2>Welcome!&nbsp;<span>To BlazeChat</span></h2>
                    <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolor porro iure dignissimos eligendi nisi deserunt at a voluptatem, ipsum inventore accusantium culpa possimus temporibus fuga enim in ut incidunt pariatur!</p>
                    <span>Already have an account?&nbsp;<button onClick={toggleSignUp}>Sign in</button></span>
                </div>
            </div>

            <div className={`item2 ${isSignUp ? 'slide-in' : ''}`}>
                <div className="container" style={isSignUp ? { display: 'none' } : { display: 'flex' }}>
                    <h2>Sign <span>in</span> </h2>
                    <form action="">
                        <label htmlFor="">User Name</label>
                        <input type="text" placeholder='Enter User Name' />
                        <label htmlFor="password">Password</label>
                        <input type="password" placeholder="Password" id="password" />
                        <button>Submit</button>
                    </form>
                </div>

                <div className="container signup" style={!isSignUp ? { display: 'none' } : { display: 'flex' }}>
                    <h2>Sign <span>up</span> </h2>
                    <form action="">
                        <label htmlFor="file">
                            <img src="" alt="avatar" />
                        </label>
                        <input type="file" style={{ display: 'none' }} />
                        <label htmlFor="">User Name</label>
                        <input type="text" placeholder='Enter Name' />
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" placeholder='Enter Email' id="" />
                        <label htmlFor="password">Password</label>
                        <input type="password" placeholder="Enter Password" id="password" />
                        <button>Submit</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Signup;
