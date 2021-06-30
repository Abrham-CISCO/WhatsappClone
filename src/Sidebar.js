import React, { useEffect, useState } from 'react';
import "./Sidebar.css";
import { Avatar, IconButton } from "@material-ui/core";
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { SearchOutlined } from '@material-ui/icons';
import SidebarChat from "./SidebarChat";
import db from './firebase'
import {UseStateValue} from './StateProvider'

function allUsers()
{
    db.collection('user').onSnapshot(snapshot => {
        var users = snapshot.docs.map(doc=>({user:doc.data()}))
        return users;
    })
}

function addUserToAGroup(roomId, userID)
{
    db.collection('rooms').doc(roomId)
    .collection('members').add({
        uid:userID,
        admin:false
    })
}

function GroupMembers(roomId)
{
    db.collection('rooms').doc(roomId)
    .onSnapshot(snapshot=>{
        var members = snapshot.docs.map(doc=>(doc.data()))
        return members;
    })
}

function nonGroupMembers(roomId)
{
    var members = GroupMembers(roomId);
    var allUsers = allUsers();
    var found = false;
    var nonMembers = allUsers.map(user=>{
        found = false;
        members.forEach(member => {
            if(user.uid === member.uid) found = true;
            else found = false;
        });
        if(!found) return user.uid;
    })
    return nonMembers;
}
function Sidebar()
{
    const [{user},dispatch]= UseStateValue();
    const [rooms, setRooms] = useState([]);
    useEffect(() => {
        const unsubscribe =  db.collection('rooms').onSnapshot(snapshot => (
            setRooms(snapshot.docs.map((doc)=>({
                id:doc.id,
                data: doc.data()
            })
            ))
        ))
    
        return() => {
            unsubscribe();
        }
        }
        , 
        
        [])
            console.log("rooms",rooms);
    return(
    <div className="sidebar">
        <div className="sidebar__header">
            <Avatar src={user?.photoURL} />

            <div className="sidebar__headerRight">
                <IconButton>
                   <DonutLargeIcon />
                </IconButton>
                <IconButton>
                    <ChatIcon />
                </IconButton>
                <IconButton>
                    <MoreVertIcon/>
                </IconButton>
            </div>
        </div>
        <div className="sidebar__search">
            <div className="sidebar_searchContainer">
                <SearchOutlined />
                <input placeholder = "Search or start a new chat" type="text"/>
            </div>
        </div>
        <div className="sidebar__chats">
            <SidebarChat addNewChat/>
            {
                rooms.map(room => (
                    <SidebarChat key={room.id} id={room.id}
                    name={room.data.name} />
                ))
            }
            {/* <SidebarChat />
            <SidebarChat />
            <SidebarChat /> */}
        </div>
    </div>
    );
}

export default Sidebar;