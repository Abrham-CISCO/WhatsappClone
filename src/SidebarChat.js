import { Avatar } from '@material-ui/core';
import React, {useEffect, useState} from 'react';
import './SidebarChat.css';
import db from './firebase';
import {Link} from 'react-router-dom';
import {UseStateValue} from "./StateProvider";
import firebase from "firebase";

function SidebarChat({id, name, addNewChat}) {
    const [seed, setSeed] = useState('');
    const [{user},dispatch]= UseStateValue();
    const [messages, setMessages] = useState('');
    useEffect(()=>{
        if(id) {
            db.collection('rooms')
            .doc(id)
            .collection('messages')
            .orderBy('timestamp','desc')
            .onSnapshot((snapshoot) => 
                setMessages(snapshoot.docs.map((doc)=> 
                    doc.data()
                )
            ))
        }
    },[id])
    useEffect(()=>{
        setSeed(Math.floor(Math.random()*5000))
    }, [])
    const createChat = () => {
        var members = [];
        var uDate=firebase.firestore.FieldValue.serverTimestamp();
        members.pop();
        members.push({uid:user.uid,admin:true});
        const roomName = prompt("Please enter name for chat room");
        if(roomName) {
            // do some clever database staff...
            db.collection('rooms').add({
                name: roomName,
                creator: user.uid,
                members:members,
                createdOn:firebase.firestore.FieldValue.serverTimestamp()
            })
        }
    };
    return !addNewChat ? (
        <Link to={`/rooms/${id}`}>
            <div className="sidebarChat">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
                <div className = "sidebarChat__info">
                    <h2>{name}</h2>
                    <p>{messages[0]?.messages}</p>
                </div>
            </div>
        </Link>
    ) : (
        <div onClick = {createChat} 
        className="sidebarChat">
            <h2>Add new Chat</h2>
        </div>
    )
}

export default SidebarChat
