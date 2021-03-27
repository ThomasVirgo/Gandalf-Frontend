import React from 'react';
import '../CSS/landing.css';


const Landing = ({handleChange, handleSubmit, createNewCode}) => {

    const room = 'room';
    const nickname = 'nickname';
    const newRoom = 'newRoom';

    //console.log(socket);

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
                    {/* <div id='form-element1' className='form-element'>
                        <label htmlFor='nickname1'>Name/Nickname:</label>
                        <input id='nickname1' name={nickname} type='text' required onChange={handleChange} placeholder='enter a name or nickname'></input>
                    </div> */}
                    {/* <div id='form-element2' className='form-element'>
                        <label htmlFor='code'>Room Name:</label>
                        <input id='room' name={room} type='text' onChange={handleChange} placeholder='ask the host for the room name and enter here' required></input>
                    </div> */}
                    <button type='submit' className='btn1'>Join Game</button>
                </form>
            </div>    

            <div className='new-game'>
                <form id='new-room' onSubmit={createNewCode}>
                    <h3>Create New Game</h3>
                    <div id='form-element3' className='form-element'>
                        <label htmlFor='nickname2'>Name/Nickname:</label>
                        <input id='nickname2' name={nickname} type='text' required onChange={handleChange} placeholder='enter a name or nickname'></input>
                    </div>
                    <div id='form-element4' className='form-element'>
                        <label htmlFor='roomName'>Room Name:</label>
                        <input id='roomName' name={newRoom} type='text' onChange={handleChange} placeholder='enter a new room name' required></input>
                    </div>
                    <input type='submit' value='click to create new game' className='btn2'></input>
                </form>
            </div>
            
        </div>
    )
}

export default Landing;
