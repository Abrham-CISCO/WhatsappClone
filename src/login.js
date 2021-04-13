import React from 'react';
import {Button} from "@material-ui/core";
import "./Login.css";
import { auth, provider } from './firebase';
import { actionTypes } from './reducer';
import {UseStateValue} from './StateProvider';
function login() {
    const [{},dispatch] = UseStateValue();
    const signIn = () => {
        auth
            .signInWithPopup(provider)
            .then(result=>{
                dispatch({
                    type:actionTypes.SET_USER,
                    user: result.user,
                })
            })
            .catch(err=>alert(err.message));
    }

    return (
        <div className="login">
            <div className="login__container">
            <img src="https://upload.wikimedia.org/wikipedia/commons/archive/f/f7/20170314151554%21WhatsApp_logo.svg" 
            alt=""
            />
            <div className="login__text">
                <h1>Sign in to WhatsApp</h1>
            </div>
            <Button onClick={signIn}>
                Sign In with Google
            </Button>
            </div>
        </div>
    )
}

export default login
