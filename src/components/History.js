import React, {useState, useEffect, useRef} from 'react';
import '../CSS/History.css';

const History = ({socket,input,host}) => {
    let {nickname, room, newRoom} = input;
    if (host){room = newRoom} //so that only need to refer to room 

    const [message, setMessage] = useState('');
    const [history, setHistory] = useState([]);

    const historyEndRef = useRef(null)

    //listen for messages
    useEffect(()=>{
        socket.on('user joined', (obj)=>{setMessage(obj.message)});
        socket.on('history', (msg)=>{setMessage(msg)});
        socket.on('user left', (obj)=>{setMessage(obj.message)});
    }, [socket, nickname, room])

    //update the history array every time message changes
    useEffect(()=>{
        setHistory(history => [...history, message]);
    }, [message])

    useEffect(()=>{
        scrollToBottom();
    }, [history])

    function scrollToBottom(){
        historyEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    return (
        <div className='history-container'>
            <h2>Game History</h2>
            <div id='history-log' className='history-log'>
                {history.map((message, index)=> (
                    <div key ={index}>
                        <div className='history-content'>{message}</div>
                    </div>
                ))}
                <div ref={historyEndRef} />
            </div>
        </div>
    )
}

export default History;
