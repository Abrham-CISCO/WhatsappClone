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
function Chat() {
    const [seed, setSeed] = useState("");
    const [input, setInput] = useState("");
    const [users, setUsers] = useState({});
    const [selectedUsers, setSelectedUsers] = useState([])
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

    const addUsers = (user) => {
        useParams.foreach(user=>{
            db.collection('rooms').doc(roomId)
            .collection('members').add({
                uid:user,
                admin:false
            })    
        })
    }

    db.collection('user').onSnapshot(snapshot => (
        setUsers(snapshot.docs.map((doc)=>({
            id:doc.id,
            data: doc.data()
        })
        ))
    ))

    const options = []
    options.pop();
    users.foreach(user=>{
        options.push({
            value:user.data.uid,
            label:user.data.name
        })    
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
                                            <Popup trigger={<IconButton><AddIcon /></IconButton>} position="bottom right" modal nested>
                                            {close => (
                                                <div className="modal">
                                                    <button className="close" onClick={close}>
                                                    &times;
                                                    </button>
                                                    <h1>Add Members</h1>
                                                    <p>From the following list of users select the user you want to add to the group and then click add</p>
                                                    {/*<select name="userList" id="userList" multiple={true}
                                                        onChange={(e)=> {setSelectedUsers(e.target.value)
                                                                        console.log(e.target.value)}} value={selectedUsers}>
                                                        <option value="Abrham Getachew">Abrham Getachew</option>
                                                        <option value="Sosina Sehalu">Sosina Sehalu</option>
                                                        <option value="Ruth Getachew">Ruth Getachew</option>
                                                        <option value="Getachew Birru">Getachew Birru</option>
                                                        </select>*/}
                                                        <Select options={options} onChange={(e)=>{
                                                            setSelectedUsers(e)
                                                        }} isMulti />
                                                    <div className="addUser">
                                                    <Button onClick={addUsers(selectedUsers)} className = "addUser" variant="contained" color="primary">
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