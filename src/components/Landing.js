import React, {useState} from 'react';
import '../CSS/landing.css';
const io = require('socket.io-client');
//const ENDPOINT = 'http://localhost:5000/';
const ENDPOINT = 'https://Gandalf-Server.thomasvirgo.repl.co'; //hosting backend server on repl.it


const Landing = ({socket}) => {


    const [input, setInput] = useState({
        'code':'',
        'nickname':'',
        'roomName':'',
    });


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
            socket.emit('join game', input.code);
            clearInput();
        }
    }

    function clearInput(){
        setInput({
            'code':'',
            'nickname':'',
        })
    }

    function createNewCode(event){
        event.preventDefault();
        console.log('create a new code!')
        socket.emit('new game', input.roomName);
    }


    return console.log(socket), (
        <div id='landing' className='landing-main'>
            <h1>Gandalf - The Card Game</h1>
            <div id='landing-container' className = 'entrance-container'>
                <form id='enter-code' onSubmit = {handleSubmit}>
                    <div id='form-element1' className='form-element'>
                        <label htmlFor='nickname'>Name/Nickname:</label>
                        <input id='nickname' name='nickname' type='text' required onChange={handleChange} placeholder='enter a name or nickname'></input>
                    </div>
                    <div id='form-element2' className='form-element'>
                        <label htmlFor='code'>Game code:</label>
                        <input id='code' name='code' type='text' onChange={handleChange} placeholder='ask the host for code and enter here' required></input>
                    </div>
                    <input type='submit' value='enter game!' className='btn1'></input>
                </form>
                <hr/>
                <form id='new-room' className='new-room'>
                    <div id='form-element3' className='form-element'>
                        <label htmlFor='roomName'>Room Name:</label>
                        <input id='roomName' name='roomName' type='text' onChange={handleChange} placeholder='enter a new room name' required></input>
                    </div>
                    <input type='submit' value='Create new game' className='btn2' onClick={createNewCode}></input>
                </form>
            </div>
        </div>
    )
}

export default Landing;
