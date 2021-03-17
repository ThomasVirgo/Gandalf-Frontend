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
import {isMyTurn} from '../Utils/gameStateFunctions';



const Table = ({socket,input,host}) => {

    let {nickname, room, newRoom} = input;
    if (host){room = newRoom} //so that only need to refer to room 

    
    // remember that calling setState will re render the whole component...
    
    const [game, setGame] = useState(new GameState(room, nickname, socket.id));
    const [hiddenCards, setHiddenCards] = useState({
        "clientCards":[true,true,true,true],
        "player2":[true,true,true,true],
        "player3":[true,true,true,true],
        "player4":[true,true,true,true],
        "deck": true,
    });
    
    console.log('rendered. game state is: ', game);

    useEffect(()=>{
        console.log('ran use effect for socket connections');
        socket.on('user joined', (obj)=>{
            // let newState = game;
            // newState.users.push(new User(obj.nickname, obj.id));
            console.log(`${obj.nickname} has joined the game`);
            let newUsers = [...game.users,new User(obj.nickname, obj.id)];
            setGame({
                ...game,
                "users": newUsers
            })
        })

        //remove user from gamestate if they leave
        socket.on('user left', (obj)=>{
            let newUsers = [...game.users];
            let index = newUsers.findIndex((entry)=>entry.id === obj.id);
            newUsers.splice(index,1);
            setGame({
                ...game,
                "users": newUsers
            });
        })

        socket.on('game state change', (state) => {
            setGame(state);
        })
    }, [game, socket]);

    // change which cards are hidden according to the game state
    useEffect(()=>{
        if (game.period === 'look at two cards'){
            console.log('set hidden cards to show first two!');
            setHiddenCards(hiddenCards => {
                return {
                    ...hiddenCards,
                "clientCards":[false, false, true, true] 
                }
            });
        }

        if (game.period === 'turns started'){
            console.log('turns started, flipped cards back over...');
            setHiddenCards(hiddenCards=>{
                return {
                    ...hiddenCards,
                    "clientCards":[true,true,true,true]
                }
            })
        }
        
    }, [game])

    //note this function is only accessible for the host.
    function startGame(){
        //create a shuffled deck
        let deck = createDeck();

        //deal each user 4 cards
        let newState = dealCards(game,deck);
        newState.message = 'Remember the two cards that are face up. Then click ready!';
        newState.period = 'look at two cards';

        //need to show each player two cards
        setGame(newState);

        //emit the game state to the server
        socket.emit('start game', newState);
        console.log('host started game');
    }

    function readyUp(){
        let myUsers = [...game.users];
        let index = myUsers.findIndex((entry)=>entry.id === socket.id);
        myUsers[index].ready=true;
        let newState = {
            ...game,
            "users": myUsers 
        }
        setGame(newState); // this new state in game variable is only accessible on the NEXT render!
        socket.emit('state change', newState);
        checkAllReady(newState);
        console.log('ran ready up function')
    }

    function checkAllReady(state){
        let allReady = state.users.every((user)=>user.ready);
        if (allReady){
          state.message = `everyones ready, it is ${state.users[state.turn].nickname}'s turn`;
          state.period = 'turns started';
          socket.emit('state change', state);
          console.log('ran check all ready, turns started')
        } else{
          console.log('ran check all ready, turns not strated')  
        }
    }

    function takeFromDeck(){
        console.log('took a card from the deck');

        //show player the card
        setHiddenCards(hiddenCards=>{
            return {
                ...hiddenCards,
                "deck":false
            }
        });
        //they then get option to play this card straight to the pile or swap it out for another card. 
    }

    function playCardToPile(){
        //pop card from the deck
        let newDeck = [...game.deck];
        let newPile = [...game.pile];
        let cardPlayed = newDeck.pop();
        socket.emit('card played', `${nickname} played the ${cardPlayed.value} of ${cardPlayed.suit}`);
        newPile.push(cardPlayed);
        let newState = {
            ...game,
            "deck":newDeck,
            "pile":newPile
        }
        setHiddenCards({
            ...hiddenCards,
            "deck":true
        })
        endTurn(newState);
    }

    function takeFromPile(){
        console.log('took a card from the pile');

        //same as above
    }

    function endTurn(newState){
        //this function takes the adpated state and increments the turn and emits new state to all players. 
        if (newState.turn === newState.users.length-1){
            newState.turn = 0;
        } else {
            newState.turn = newState.turn + 1;  
        }
        newState.message = `${newState.users[newState.turn].nickname}'s turn!`
        setGame(newState);
        socket.emit('state change', newState);
    }

    // set the cards in game to the current game state;
    let {myCards,player2Cards,player2Name,player3Cards,player3Name,player4Cards,player4Name,deckTop,pileTop}=setCardsToCurrentState(game,socket);
    console.log('my cards are: ', myCards);
    console.log('their cards are: ', player2Cards);

    //create component for each players hand
    return (
        <div className='table-container'>
            <div id='host-cards' className='myCards'>
                <div>{nickname}</div>
                <ClientCards cards={myCards} hiddenCards= {hiddenCards} setHiddenCards = {setHiddenCards}/>
            </div>

            <div id='player2' className='player2'>
                {player2Name!==''&&<div>{player2Name}</div>}
                <Player2Cards cards={player2Cards} hiddenCards= {hiddenCards} setHiddenCards = {setHiddenCards}/>
            </div>

            <div id='player3' className='player3'>
                {player3Name!==''&&<div>{player3Name}</div>}
                <Player3Cards cards={player3Cards} hiddenCards= {hiddenCards} setHiddenCards = {setHiddenCards}/>
            </div>

            <div id='player4' className='player4'>
                {player4Name!==''&&<div>{player4Name}</div>}
                <Player4Cards cards={player4Cards} hiddenCards= {hiddenCards} setHiddenCards = {setHiddenCards}/>
            </div>

            <div id='center-cards' className='center-cards'>
                <div className='deck'>
                    {deckTop&&<Card value={deckTop.value} suit = {deckTop.suit} hidden = {hiddenCards.deck}></Card>}
                </div>
                <div className='pile'>
                    {pileTop&&<Card value={pileTop.value} suit={pileTop.suit} hidden = {false}></Card>}
                </div>
            </div>
            
            <div className='main-message'>
                <div id='host-start-button'>
                    {host && game.period === 'waiting for players' && <button onClick = {startGame}>Start Game</button>}
                </div>
                <div id='instruction-message' className='instruction'>
                    <h4>{game.message}</h4>
                </div>
            </div>

            <div className='playButtons'>
                {game.period === 'look at two cards' && <button onClick = {readyUp}>Ready</button>}
                {game.period === 'turns started' && isMyTurn(game,socket) && hiddenCards.deck && <button onClick = {takeFromDeck}>Take card from deck</button>}
                {game.period === 'turns started' && isMyTurn(game,socket) && hiddenCards.deck && <button onClick = {takeFromPile}>Take card from pile</button>}
                {game.period === 'turns started' && isMyTurn(game,socket) && hiddenCards.deck && <button>Play a Double</button>}
                {game.period === 'turns started' && isMyTurn(game,socket) && !hiddenCards.deck && <button onClick={playCardToPile}>Play Straight to Pile</button>}
                {game.period === 'turns started' && isMyTurn(game,socket) && !hiddenCards.deck && <button>Swap with card from my hand</button>}
            </div>
        </div>
    )
}

export default Table;