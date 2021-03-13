import React, {useState, useEffect} from 'react';
import Spade from './Cards/Spades';
import Club from './Cards/Clubs';
import Diamond from './Cards/Diamonds';
import Heart from './Cards/Hearts';
import GameState from '../Classes/GameState';
import User from '../Classes/User';
import '../CSS/Table.css';

const Table = ({socket,input,host}) => {

    let {nickname, room, newRoom} = input;
    if (host){room = newRoom} //so that only need to refer to room 

    const [gameStarted, setGameStarted] = useState(false);
    const [game, setGame] = useState(new GameState(room, nickname, socket.id));

    useEffect(()=>{
        console.log(game);
        socket.on('user joined', (obj)=>{
            let newState = game;
            newState.users.push(new User(obj.nickname, obj.id));
            setGame(newState);
            console.log(newState);
        })

        //remove user from gamestate if they leave
        socket.on('user left', (obj)=>{
            let newState = game;
            let index = newState.users.findIndex((entry)=>entry.id === obj.id);
            newState.users.splice(index,1);
            setGame(newState);
            console.log(newState);
        })
    }, [game, socket]);

    //note this function is only accessible for the host.
    function startGame(event){
        //deal each user 4 cards


        //emit the game state to the server
        socket.emit('start game', game);
        setGameStarted(true);
    }

    return (
        <div className='table-container'>
            <div className='card1'><Spade value = {'A'}/></div>
            <div className='card2'><Club value = {'2'}/></div>
            <div className='card3'><Diamond value = {'9'}/></div>
            <div className='card4'><Heart value = {'K'}/></div>
            <div className='deck'><Diamond value = {'N/A'}/></div>
            <div className='pile'><Heart value = {'A'}/></div>

            <div className='main-message'>
                {gameStarted===false && host &&
                   <button onClick = {startGame}>Start Game</button> 
                }
            </div>


        </div>
    )
}

export default Table;