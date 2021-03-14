import React, {useState, useEffect} from 'react';
import GameState from '../Classes/GameState';
import User from '../Classes/User';
import '../CSS/Table.css';
import createDeck from '../Utils/CreateDeck';
import dealCards from '../Utils/DealCards';
import Card from './Card';


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

    let users = game.users;
    let idxList = [0,1,2,3];
    let myIndex = users.findIndex(user => user.id===socket.id);
    let myCards = users[myIndex].hand;
    idxList.splice(myIndex,1);

    if (myIndex===1){idxList=[2,3,0]};
    if (myIndex===2){idxList=[3,0,1]}

    let player2Cards = [];
    let player2Name = '';
    if (users[idxList[0]]){
        player2Cards = users[idxList[0]].hand;
        player2Name = users[idxList[0]].nickname;
    }

    let player3Cards = [];
    let player3Name = '';
    if (users[idxList[1]]){
        player3Cards = users[idxList[1]].hand;
        player3Name = users[idxList[1]].nickname;
    }

    let player4Cards = [];
    let player4Name = '';
    if (users[idxList[2]]){
        player4Cards = users[idxList[2]].hand;
        player4Name = users[idxList[2]].nickname;
    }

    let deckTop = game.deck[game.deck.length-1];
    let pileTop;
    if (game.pile.length > 0){pileTop=game.pile[game.pile.length-1]}; 

    return (
        <div className='table-container'>
            <div id='host-cards' className='myCards'>
                <div>{nickname}</div>
                {myCards[0]&&<div><Card value = {myCards[0].value} suit = {myCards[0].suit}/></div>}
                {myCards[1]&&<div><Card value = {myCards[1].value} suit = {myCards[1].suit}/></div>}
                {myCards[2]&&<div><Card value = {myCards[2].value} suit = {myCards[2].suit}/></div>}
                {myCards[3]&&<div><Card value = {myCards[3].value} suit = {myCards[3].suit}/></div>}
            </div>

            <div id='player2' className='player2'>
                {player2Name!==''&&<div>{player2Name}</div>}
                {player2Cards[0]&&<div><Card value = {player2Cards[0].value} suit = {player2Cards[0].suit}/></div>}
                {player2Cards[1]&&<div><Card value = {player2Cards[1].value} suit = {player2Cards[1].suit}/></div>}
                {player2Cards[2]&&<div><Card value = {player2Cards[2].value} suit = {player2Cards[2].suit}/></div>}
                {player2Cards[3]&&<div><Card value = {player2Cards[3].value} suit = {player2Cards[3].suit}/></div>}
            </div>

            <div id='player3' className='player3'>
                {player3Name!==''&&<div>{player3Name}</div>}
                {player3Cards[0]&&<div><Card value = {player3Cards[0].value} suit = {player3Cards[0].suit}/></div>}
                {player3Cards[1]&&<div><Card value = {player3Cards[1].value} suit = {player3Cards[1].suit}/></div>}
                {player3Cards[2]&&<div><Card value = {player3Cards[2].value} suit = {player3Cards[2].suit}/></div>}
                {player3Cards[3]&&<div><Card value = {player3Cards[3].value} suit = {player3Cards[3].suit}/></div>}
            </div>

            <div id='player4' className='player4'>
                {player4Name!==''&&<div>{player4Name}</div>}
                {player4Cards[0]&&<div><Card value = {player4Cards[0].value} suit = {player4Cards[0].suit}/></div>}
                {player4Cards[1]&&<div><Card value = {player4Cards[1].value} suit = {player4Cards[1].suit}/></div>}
                {player4Cards[2]&&<div><Card value = {player4Cards[2].value} suit = {player4Cards[2].suit}/></div>}
                {player4Cards[3]&&<div><Card value = {player4Cards[3].value} suit = {player4Cards[3].suit}/></div>}
            </div>

            <div id='center-cards' className='center-cards'>
                <div className='deck'>
                    <Card value={deckTop.value} suit = {deckTop.suit}></Card>
                </div>
                <div className='pile'>
                    {pileTop&&<Card value={pileTop.value} suit={pileTop.suit}></Card>}
                </div>
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