import React, {useEffect, useState} from 'react';
import './Chat.css';
import db from './firebase'
import {Avatar, IconButton} from "@material-ui/core"
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import AddIcon from '@material-ui/icons/Add';
import {useParams} from 'react-router-dom';
import firebase from "firebase";
import { AttachFile, MoreVert, SearchOutlined } from '@material-ui/icons';
import {UseStateValue} from "./StateProvider";
import Popup from 'reactjs-popup'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import 'reactjs-popup/dist/index.css';
function Chat() {
    const [seed, setSeed] = useState("");
    const [input, setInput] = useState("");
    const { roomId } = useParams();
    const [roomName, setRoomName] = useState("");
    const [messages, setMessages] = useState([]);
    const [{user}, dispatch] = UseStateValue();
    console.log(roomId)
    useEffect(()=> {
        if(roomId){
            db.collection('rooms').doc(roomId)
            .onSnapshot(snapshoot => {
                setRoomName(snapshoot.data().name)
            })
            db.collection('rooms').doc(roomId)
            .collection("messages").orderBy('timestamp','asc')
            .onSnapshot(snapshoot =>{
                setMessages(snapshoot.docs.map(doc => doc.data()))
            })
        }
    },[roomId])

    useEffect(()=>{
        setSeed(Math.floor(Math.random()*5000))
    }, [roomId])

    const sendMessage = (e) => {
        e.preventDefault();
        db.collection('rooms').doc(roomId)
        .collection('messages').add({
            messages: input,
            name: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        setInput("");
    }

    return (
        <div className = "chat">
            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
            <div className="chat__headerInfo">
                <h3>{roomName}</h3>
                <p>Last seen {" "}
                {new Date(messages[messages.length - 1]?.timestamp?.toDate()).toUTCString()}
                </p>
            </div>
            <div className="chat__headerRight">
                <IconButton>
                    <SearchOutlined/>
                </IconButton>
                <IconButton>
                    <AttachFile/>
                </IconButton>
                <Popup trigger={<IconButton><MoreVertIcon /></IconButton>} position="bottom right" modal nested>
                    {close => (
                    <div className="modal">
                        <button className="close" onClick={close}>
                        &times;
                        </button>

                        <div className = "groupDetail">
                            <div className = "groupPhName">
                                <div className = "groupAvatar">
                                    <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
                                </div>
                            </div>
                            <div className="groupName">
                                <div className="name"><h1>{roomName}</h1></div>
                            </div>
                            <div className = "groupDescription">
                                <h3>Description</h3>
                                <p>This is group description</p>
                            </div>
                            <div className = "groupMembers">

                            <h3>Members</h3>
                                <div className="members">

                                    <div className="member">
                                        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
                                        <snap className="memberName">Abrham Getachew</snap>
                                    </div>
                                    <div className="member">
                                        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
                                        <snap className="memberName">Abrham Getachew</snap>
                                    </div>
                                    <div className="member">
                                        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
                                        <snap className="memberName">Abrham Getachew</snap>
                                    </div>
                                    <div className="member">
                                        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
                                        <snap className="memberName">Abrham Getachew</snap>
                                    </div>
                                    <div className="member">
                                        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
                                        <snap className="memberName">Abrham Getachew</snap>
                                    </div>
                                    <div className="member">
                                        <div className = "addNewMember">
                                            <IconButton>
                                            <AddIcon/>
                                            </IconButton>
                                            </div>  
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>


                    )}
                </Popup>
            </div>
            </div>
            <div className="chat__body">
                {
                messages.map(message => (
                    <p className = {`chat__message ${message.name === user.displayName && "chat__reciever"}`}>
                        <span className="chat__name">{message.name}</span>
                            {message.messages}
                        <span className="chat__timestamp">
                            {new Date(message.timestamp?.toDate()).toUTCString()}
                        </span>
                    </p>
                ) )}
            </div>
            <div className="chat__footer">
                <InsertEmoticonIcon />
                <form>
                    <input type="text" 
                    onChange={e=> setInput(e.target.value)} 
                    value = {input} placeholder="Type a message"/>
                    <button type="submit" onClick={sendMessage}> Send a message</button>
                </form>
                <MicIcon/>
            </div>
        </div>
    )
}

export default Chat