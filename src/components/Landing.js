import React, {useState, useEffect} from 'react';
import '../CSS/landing.css';
const io = require('socket.io-client');
const ENDPOINT = 'http://localhost:5000/';


const Landing = () => {

    const [socket, setSocket] = useState();

    const [input, setInput] = useState({
        'code':'',
        'nickname':'',
    });


    useEffect(() => {
        const newSocket = io(ENDPOINT);
        setSocket(newSocket);
        return () => newSocket.disconnect();
      }, []);
    

    function handleChange(event){
        setInput({
            ...input,
            [event.target.name]:event.target.value,
        });
    }

    function handleSubmit(event){
        event.preventDefault();
        console.log(`${input.nickname} submitted code ${input.code}`);
        if (input.code && input.nickname){
            socket.emit('game entrance', `${input.nickname} submitted code ${input.code}`)
            setInput({
                'code':'',
                'nickname':'',
            })
        }
    }

    function createNewCode(){
        console.log('create a new code!')
        socket.emit('new code', 'client created a new code');
    }


    return (
        <div id='landing' className='landing-main'>
            <h1>Gandalf - The Card Game</h1>
            <div id='landing-container' className = 'entrance-container'>
                <form id='enter-code' onSubmit = {handleSubmit}>
                    <div id='form-element1' className='form-element'>
                        <label htmlFor='nickname'>Name/Nickname:</label>
                        <input id='nickname' name='nickname' type='text' required onChange={handleChange} placeholder='enter a name or nickname'></input>
                    </div>
                    <div id='form-element1' className='form-element'>
                        <label htmlFor='code'>Game code:</label>
                        <input id='code' name='code' type='text' onChange={handleChange} placeholder='ask the host for code and enter here'></input>
                    </div>
                    <input type='submit' value='enter game!' className='btn1'></input>
                </form>
                <hr/>
                <button onClick={createNewCode} className='btn2'>Create new game</button>
            </div>
        </div>
    )
}

export default Landing;
