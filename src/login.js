import React from 'react';
import {Button} from "@material-ui/core";
import "./Login.css";
import { auth, provider } from './firebase';
import { actionTypes } from './reducer';
import firebase from "firebase";
import db from './firebase'
import {UseStateValue} from './StateProvider';


function login() {
    var userIsRegistered = false;
    var users = [];
    const [{},dispatch] = UseStateValue();
    const signIn = () => {
        auth
            .signInWithPopup(provider)
            .then(result=>{
                dispatch({
                    type:actionTypes.SET_USER,
                    user: result.user,
                })
                db.collection('user').onSnapshot((snapshoot) => {
                    snapshoot.docs.forEach((doc)=> {
                        if(doc.data().uid === result.user.uid)
                        {
                            //This code is not working debug it later  
                            userIsRegistered = true;
                        }    
                    })
                })
                if(!userIsRegistered)
                {
                    db.collection('user').add({
                        uid:result.user.uid,
                        name:result.user.displayName,
                        profilePic: result.user.photoURL,
                        joinDate:firebase.firestore.FieldValue.serverTimestamp()
                    })            
                }
            })
            .catch(err=>alert(err.message));
            console.log(users)
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
