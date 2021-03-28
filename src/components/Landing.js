import React from 'react';
import '../CSS/landing.css';


const Landing = ({handleChange, handleSubmit, createNewCode}) => {

    const room = 'room';
    const nickname = 'nickname';
    const newRoom = 'newRoom';

    

    return (
        <div id='landing' className='landing-main'>
            <h1 className = 'landing-heading'>Gandalf - The Card Game</h1>
            <div className='join-game'>
                <form id='enter-code' onSubmit = {handleSubmit} className = 'form-container'>
                    <h3>Join Existing Game</h3>
                    <label htmlFor='form-element1'>
                        <span>Name/Nickname:</span>
                        <input id='nickname1' name={nickname} type='text' required onChange={handleChange} placeholder='enter a name or nickname'></input>
                    </label>
                    <label htmlFor='form-element2'>
                        <span>Room Name:</span>
                        <input id='room' name={room} type='text' onChange={handleChange} placeholder='enter room name' required></input>
                    </label>
                    <button type='submit' className='btn1'>Join game</button>
                </form>
            </div>    

            <div className='new-game'>
                <form id='new-room' onSubmit={createNewCode} className='form-container'>
                    <h3>Create New Game</h3>
                    <label htmlFor='form-element3'>
                        <span>Name/Nickname:</span>
                        <input id='nickname2' name={nickname} type='text' required onChange={handleChange} placeholder='enter a name or nickname'></input>
                    </label>
                    <label htmlFor='form-element2'>
                        <span>Room Name:</span>
                        <input id='roomName' name={newRoom} type='text' onChange={handleChange} placeholder='enter a new room name' required></input>
                    </label>
                    <button type='submit' className='btn2'>Create new game</button>
                </form>
            </div>
            
        </div>
    )
}

export default Landing;
