import React, {useState, useEffect} from 'react';

const Chat = ({socket,input,host}) => {

    useEffect(()=>{
        socket.on('chat message', ({nickname, message})=>{addMessage(nickname, message)}) //on recieving message from server add it to the chat messages
    })

    const [chatMessages, setChatMessages] = useState([]);
    const [chatInput, setChatInput] = useState('');

    let {nickname, room, newRoom} = input;
    if (host){room = newRoom} //so that only need to refer to room 

    function inputChange(event){
        setChatInput(event.target.value);
    }

    function addMessage(nickname, message){
        setChatMessages([...chatMessages, [nickname,message]]);
    }

    function sendMessage(event){
        event.preventDefault();
        setChatMessages([...chatMessages, [nickname,chatInput]]);
        socket.emit('message from client', {
            "message":chatInput,
            "nickname":nickname,
            "room": room
        }); //send the message to the server
    }

    return (
        <div id='chat-container' className='chat-container'>
            <h2>Chat</h2>
            <div id='messages'>
                {chatMessages.map((message, index)=> (
                    <div key ={index}>{message[0]}: {message[1]}</div>
                ))}
            </div>
            <form id='chat-message' onSubmit={sendMessage}>
                <input type='text' onChange = {inputChange} required placeholder='add a message'></input>
                <input type='submit' value='Send it!'></input>
            </form>
        </div>

    )
}

export default Chat;