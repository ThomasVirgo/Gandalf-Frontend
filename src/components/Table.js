import React, {useState, useEffect} from 'react';
import Spade from './Cards/Spades';
import Club from './Cards/Clubs';
import Diamond from './Cards/Diamonds';
import Heart from './Cards/Hearts';
import GameState from '../Classes/GameState';
import User from '../Classes/User';
import '../CSS/Table.css';
import createDeck from '../Utils/CreateDeck';
import dealCards from '../Utils/DealCards';


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

        socket.on('game state change', (state) => {
            setGame(state);
            console.log(state);
        })
    }, [game, socket]);

    //note this function is only accessible for the host.
    function startGame(){
        //create a shuffled deck
        let deck = createDeck();

        //deal each user 4 cards
        let newState = dealCards(game,deck);
        setGame(newState);

        //emit the game state to the server
        socket.emit('start game', newState);
        setGameStarted(true);
        console.log(newState);
    }

    return (
        <div className='table-container'>
            <div id='host-cards' className='myCards'>
                <div><Spade value = {'A'}/></div>
                <div><Club value = {'2'}/></div>
                <div><Diamond value = {'9'}/></div>
                <div><Heart value = {'K'}/></div> 
            </div>

            <div id='player2' className='player2'>
                <div className='rotate-clockwise'><Spade value = {'2'}/></div>
                <div className='rotate-clockwise'><Spade value = {'3'}/></div>
                <div className='rotate-clockwise'><Spade value = {'4'}/></div>
                <div className='rotate-clockwise'><Spade value = {'5'}/></div>
            </div>

            <div id='player3' className='player3'>
                <div><Spade value = {'6'}/></div>
                <div><Spade value = {'7'}/></div>
                <div><Spade value = {'8'}/></div>
                <div><Spade value = {'9'}/></div>
            </div>

            <div id='player4' className='player4'>
                <div className='rotate-anticlockwise'><Spade value = {'10'}/></div>
                <div className='rotate-anticlockwise'><Spade value = {'J'}/></div>
                <div className='rotate-anticlockwise'><Spade value = {'Q'}/></div>
                <div className='rotate-anticlockwise'><Spade value = {'K'}/></div> 
            </div>

            <div id='center-cards' className='center-cards'>
                <div className='deck'><Diamond value = {'N/A'}/></div>
                <div className='pile'><Heart value = {'A'}/></div>
            </div>
            
            <div className='main-message'>
                {gameStarted===false && host &&
                   <button onClick = {startGame}>Start Game</button> 
                }
            </div>


        </div>
    )
}

export default Table;