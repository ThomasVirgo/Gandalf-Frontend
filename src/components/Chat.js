import React, {useState, useEffect, useRef} from 'react';
import '../CSS/Chat.css';

const Chat = ({socket,input,host}) => {
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState([]);
    let {nickname, room, newRoom} = input;
    if (host){room = newRoom} //so that only need to refer to room 
    const messagesEndRef = useRef(null)

    useEffect(()=>{
        socket.on('chat message', ({nickname, message})=>{setCurrentMessage([nickname, message,1])})
        

        return () => {socket.off('chat message')};
    }, [socket])

    useEffect(()=>{
        setChatMessages(chatMessages => [...chatMessages, currentMessage]);
    }, [currentMessage])

    useEffect(()=>{
        scrollToBottom();
    }, [chatMessages]);
    
    

    function scrollToBottom(){
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    function inputChange(event){
        setChatInput(event.target.value);
    }

    function clearInput(){
        setChatInput('');
        document.getElementById('chatInput').value='';
    }

    function sendMessage(event){
        event.preventDefault();
        scrollToBottom();
        socket.emit('message from client', {
            "message":chatInput,
            "nickname":nickname,
            "room": room
        }); //send the message to the server
        setCurrentMessage([nickname, chatInput, 0]);
        clearInput();
    }

    let myMessageStyle = {
        color:"white",
        backgroundColor: "DodgerBlue",
        display:"block",
        width: "150px",
        borderRadius:"7px",
        margin: "10px 20px 5px auto",
        padding: "10px",
    };

    let otherStyle = {
        color:"white",
        backgroundColor: "darkgray",
        display:"block",
        width: "150px",
        borderRadius:"7px",
        margin: "10px auto 5px 10px",
        padding: "10px",
    };
    
    let styles = [myMessageStyle, otherStyle];

    return (
        <div id='chat-container' className='chat-container'>
            <h2 className='chat-heading'>Chat</h2>
            <div id='messages' className='messages'>
                {chatMessages.map((message, index)=> (
                    <div key ={index} style = {styles[message[2]]}>
                        <div className='message-name'>{message[0]}:</div>
                        <div className='message-content'>{message[1]}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form id='chat-message' onSubmit={sendMessage} className='send-message'>
                <input type='text' onChange = {inputChange} required placeholder='add a message' className='chatInput' id='chatInput'></input>
                <input type='submit' value='Send it!' className='chatButton'></input>
            </form>
        </div>
    )
}

export default Chat;