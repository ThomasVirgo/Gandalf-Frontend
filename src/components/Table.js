import React, {useState, useEffect} from 'react';
import GameState from '../Classes/GameState';
import User from '../Classes/User';
import '../CSS/Table.css';
import createDeck from '../Utils/CreateDeck';
import dealCards from '../Utils/DealCards';
import Card from './Card';
import ClientCards from './Hands/Client';
import Player2Cards from './Hands/Player2';
import Player3Cards from './Hands/Player3';
import Player4Cards from './Hands/Player4';
import setCardsToCurrentState from '../Utils/setCards';



const Table = ({socket,input,host}) => {

    let {nickname, room, newRoom} = input;
    if (host){room = newRoom} //so that only need to refer to room 

    // change to a single state!
    // remember that calling setState will re render the whole component...
    
    const [game, setGame] = useState(new GameState(room, nickname, socket.id));

    let users = game.users;
    let myIndex = users.findIndex(user => user.id===socket.id);

    useEffect(()=>{
        socket.on('user joined', (obj)=>{
            let newState = game;
            newState.users.push(new User(obj.nickname, obj.id));
            setGame(newState);
        })

        //remove user from gamestate if they leave
        socket.on('user left', (obj)=>{
            let newState = game;
            let index = newState.users.findIndex((entry)=>entry.id === obj.id);
            newState.users.splice(index,1);
            setGame(newState);
        })

        socket.on('game state change', (state) => {
            setGame(state);
        })
    }, [game, socket]);

    

    //note this function is only accessible for the host.
    function startGame(){
        //create a shuffled deck
        let deck = createDeck();

        //deal each user 4 cards
        let newState = dealCards(game,deck);
        newState.message = 'Remember the two cards that are face up. Then click ready!'
        setGame(newState);

        //emit the game state to the server
        socket.emit('start game', newState);
    }

    function readyUp(){
        let newState = game;
        newState.users[myIndex].ready=true;
        socket.emit('state change', newState);
        checkAllReady(newState);
        console.log('ran ready up function')
    }

    function checkAllReady(state){
        let allReady = state.users.every((user)=>user.ready);
        setGame(state); // this new state in game variable is only accessible on the NEXT render!
        if (allReady){
          let newState = state;
          newState.message = `everyones ready, it is ${newState.users[newState.turn].nickname}'s turn`;
          socket.emit('state change', newState);
          console.log('ran check all ready, startTurns = true')
        } else{
          console.log('ran check all ready, startTurns = false')  
        }
    }

    function endTurn(){
        let newState = game;
        if (newState.turn === 3){
            newState.turn = 0;
        } else {
            newState.turn = newState.turn + 1;  
        }
        setGame(newState);
        socket.emit('state change', newState);
    }

    // set the cards in game to the current game state;
    let {myCards,player2Cards,player2Name,player3Cards,player3Name,player4Cards,player4Name,deckTop,pileTop}=setCardsToCurrentState(game,socket);

    //create component for each players hand
    return (
        <div className='table-container'>
            <div id='host-cards' className='myCards'>
                <div>{nickname}</div>
                <ClientCards cards={myCards}/>
            </div>

            <div id='player2' className='player2'>
                {player2Name!==''&&<div>{player2Name}</div>}
                <Player2Cards cards={player2Cards}/>
            </div>

            <div id='player3' className='player3'>
                {player3Name!==''&&<div>{player3Name}</div>}
                <Player3Cards cards={player3Cards}/>
            </div>

            <div id='player4' className='player4'>
                {player4Name!==''&&<div>{player4Name}</div>}
                <Player4Cards cards={player4Cards}/>
            </div>

            <div id='center-cards' className='center-cards'>
                <div className='deck'>
                    {deckTop&&<Card value={deckTop.value} suit = {deckTop.suit} hidden = {deckTop.hidden}></Card>}
                </div>
                <div className='pile'>
                    {pileTop&&<Card value={pileTop.value} suit={pileTop.suit} hidden = {false}></Card>}
                </div>
            </div>
            
            <div className='main-message'>
                <div id='host-start-button'>
                    {host && <button onClick = {startGame}>Start Game</button>}
                </div>
                <div id='instruction-message' className='instruction'>
                    <h4>{game.message}</h4>
                </div>
            </div>

            <div className='playButtons'>
                {<button onClick = {readyUp}>Ready</button>}
                {<button>Take card from deck</button>}
                {<button>Take card from pile</button>}
                {<button>Play a Double</button>}
                {<button onClick={endTurn}>End Turn</button>}
            </div>
        </div>
    )
}

export default Table;