import React, {useState, useEffect, useRef} from 'react';

const Chat = ({socket,input,host}) => {
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState([]);
    let {nickname, room, newRoom} = input;
    if (host){room = newRoom} //so that only need to refer to room 


    useEffect(()=>{
        socket.on('chat message', ({nickname, message})=>{setCurrentMessage([nickname, message,1])})
        console.log('useEffect ran');
    }, [socket])

    useEffect(()=>{
        setChatMessages(chatMessages => [...chatMessages, currentMessage]);
        scrollToBottom();
        console.log('use effect ran, chane to current message');
    }, [currentMessage])
    
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    function inputChange(event){
        setChatInput(event.target.value);
    }

    function sendMessage(event){
        event.preventDefault();
        // let messages  = getEntry('messages');
        // messages.push([nickname,chatInput,0]);
        // setEntry('messages', messages);
        scrollToBottom();
        socket.emit('message from client', {
            "message":chatInput,
            "nickname":nickname,
            "room": room
        }); //send the message to the server
        setCurrentMessage([nickname, chatInput, 0]);
        scrollToBottom();
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
            <h2>Chat</h2>
            <div id='messages'>
                {chatMessages.map((message, index)=> (
                    <div key ={index} style = {styles[message[2]]}>
                        <div className='message-name'>{message[0]}:</div>
                        <div className='message-content'>{message[1]}</div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <form id='chat-message' onSubmit={sendMessage}>
                <input type='text' onChange = {inputChange} required placeholder='add a message'></input>
                <input type='submit' value='Send it!'></input>
            </form>
        </div>

    )
}

export default Chat;