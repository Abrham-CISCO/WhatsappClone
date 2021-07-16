import React, {useEffect, useState} from 'react';
import './Chat.css';
import db from './firebase'
import {Avatar, IconButton} from "@material-ui/core"
import Button from '@material-ui/core/Button';
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
import Select from 'react-select';

function Members({users}){
    const { roomId } = useParams();
    const [roomMembers, setRoomMembers] = useState([])

    useEffect(()=> {    
        db.collection('rooms').doc(roomId).collection('members')
        .onSnapshot(snapshoot => {
            setRoomMembers(snapshoot.docs.map(doc => doc.data()))
        })
    },[roomId])    
    roomMembers.forEach(member=>{
        users.forEach(user=>{
            if(user.data.uid === member.uid)
            {
                member.name = user.data.name;
                member.pic = user.data.profilePic;
            }
        })
    })

    const removeMember = (uid) => {
        db.collection('rooms').doc(roomId).collection('members').where('uid','==',uid)
        .onSnapshot(snapshot => {
            snapshot.docs.forEach(doc=>db.collection('rooms').doc(roomId).collection('members')
            .doc(doc.id).delete()) 
        })   
    }

    return(
        roomMembers.map(member => (
            <div className="member" key={member.uid}>
                <Avatar src={member.pic}/>
                <snap className="memberName">{member.name}</snap> 
                <br/>
                <Button variant="contained" onClick={()=>removeMember(member.uid)} color="primary">
                    Remove Member
                </Button>
            </div>
        )))
}


function Chat() {
    const [seed, setSeed] = useState("");
    const [input, setInput] = useState("");
    const [candidateUsers,setCandidateUsers] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])
    const [roomMembers, setRoomMembers] = useState([])
    const { roomId } = useParams();
    const [roomName, setRoomName] = useState("");
    const [messages, setMessages] = useState([]);
    const [{user}, dispatch] = UseStateValue();
 
    useEffect(()=> {
        if(roomId){
            db.collection('rooms').doc(roomId)
            .onSnapshot(snapshoot => {
                setRoomName(snapshoot.data().name)
            })
            db.collection('rooms').doc(roomId)
            .collection('members').onSnapshot(snapshoot=>{
               setRoomMembers(snapshoot.docs.map(doc => doc.data()))
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

    const addUsers = () => {
        selectedUsers.forEach(user=>{
            db.collection('rooms').doc(roomId)
            .collection('members').add({
                uid:user.value,
                admin:false
            })    
        })
    }

    useEffect(()=> {
        db.collection('user').onSnapshot(snapshot => (
            setCandidateUsers(snapshot.docs.map((doc)=>({
                id:doc.id,
                data: doc.data()
            })
            ))
        )
        )

    },[roomId])

    var isMember = false;        
    const options = []
    options.pop();
    candidateUsers.forEach(candidateUser=>{
        roomMembers.forEach(member=>{
            if(candidateUser.data.uid === member.uid)
            {
                isMember = true;
            }
        })
        if(!isMember)
        {
            options.push({
                value:candidateUser.data.uid,
                label:candidateUser.data.name
            })    
        }
        isMember = false;
    })

    return (
        <div className = "chat">
            <div className="chat__header">
                <Popup trigger={<IconButton><Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/></IconButton>} position="bottom right" modal nested>
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
                                <Members users={candidateUsers}/>
                                    <div className="member">
                                        <div className = "addNewMember">
                                            <Popup trigger={<IconButton><AddIcon /></IconButton>} position="bottom right" modal nested>
                                            {close => (
                                                <div className="modal">
                                                    <button className="close" onClick={close}>
                                                    &times;
                                                    </button>
                                                    <h1>Add Members</h1>
                                                    <p>From the following list of users select the user you want to add to the group and then click add</p>
                                                        <Select options={options} onChange={(e)=>{
                                                            setSelectedUsers(e)
                                                        }} isMulti />
                                                    <div className="addUser">
                                                    <Button onClick={()=>addUsers()} className = "addUser" variant="contained" color="primary">
                                                       Add Users
                                                    </Button>
                                                    </div>
                                                </div>
                                            )}
                                            </Popup>
                                        </div>  
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    )}
                </Popup>
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
                <IconButton><MoreVertIcon /></IconButton>
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