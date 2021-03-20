import React, {useState, useEffect} from 'react';
import GameState from '../Classes/GameState';
import User from '../Classes/User';
import '../CSS/Table.css';
import createDeck from '../Utils/CreateDeck';
import dealCards from '../Utils/DealCards';
import Card from './Card';
import setCardsToCurrentState from '../Utils/setCards';
import {isMyTurn} from '../Utils/gameStateFunctions';



const Table = ({socket,input,host}) => {

    let {nickname, room, newRoom} = input;
    if (host){room = newRoom} //so that only need to refer to room 

    
    // remember that calling setState will re render the whole component..., but all other code will be run first before changng value of state. 
    
    const [game, setGame] = useState(new GameState(room, nickname, socket.id));
    const [hiddenCards, setHiddenCards] = useState({
        "clientCards":[true,true,true,true],
        "player2":[true,true,true,true],
        "player3":[true,true,true,true],
        "player4":[true,true,true,true],
        "deck": true,
    });
    const [inProcess, setInProcess] = useState([false, '']); // second value is 'deck' or 'pile' depending on which one they want to swap with.
    const [jackSwap, setJackSwap] = useState([]);

    const defaultHiddenCards = {
        "clientCards":[true,true,true,true],
        "player2":[true,true,true,true],
        "player3":[true,true,true,true],
        "player4":[true,true,true,true],
        "deck": true,
    };

    // console.log('rendered. game state is: ', game);
    // console.log('hidden cards: ', hiddenCards, isMyTurn(game,socket));
    // console.log('in swap:', inProcess);

    let idx;
    if (game.users!==[]){
        idx = game.users.findIndex((entry)=>entry.id === socket.id);  
    }
    

    useEffect(()=>{
        console.log('ran use effect for socket connections');
        socket.on('user joined', (obj)=>{
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

        let magicCards = ['7','8', '9', '10', 'J', 'Q'];
        if (magicCards.indexOf(cardPlayed.value)!==-1){
            if (cardPlayed.value === '7' || cardPlayed.value === '8'){
                setInProcess([false, 'look at own']);
                endTurn(newState); //end turn so everyone can see theyve played a 7 or 8 but then setTimeout to remove buttons and hide cards. 
                setTimeout(()=>setHiddenCards(defaultHiddenCards), 1000*10); //need to set message saying you have 10 seconds to look at a card
                //setTimeout(()=>setInProcess([false,'']), 1000*10); 
            } else if (cardPlayed.value === '9' || cardPlayed.value === '10'){
                setInProcess([false, 'look at theirs']);
                endTurn(newState);
                setTimeout(()=>setHiddenCards(defaultHiddenCards), 1000*10); //need to set message saying you have 10 seconds to look at someone elses card
                setTimeout(()=>setInProcess([false,'']), 1000*10);
            } else if (cardPlayed.value === 'J'){
                endTurn(newState);
                setInProcess([false, 'pick your card to swap']);
                setTimeout(()=>setInProcess([false,'']), 10000*20);
            } else if (cardPlayed.value === 'Q'){
                //increment turn an extra time
                if (newState.turn === newState.users.length-1){
                    newState.turn = 0;
                } else {
                    newState.turn = newState.turn + 1;  
                };
                endTurn(newState);
            }
            else {
                endTurn(newState);
            }
        } else {
          endTurn(newState);  
        }    
    }

    function show(cardIndex, player){
        
        if (player==='client'){
            let arr = [true,true,true,true];
            arr[cardIndex] = false;
            setHiddenCards({
                ...hiddenCards,
                "clientCards": arr
            })
        } else {
            let arr = [true,true,true,true];
            arr[cardIndex] = false; 
            setHiddenCards({
                ...hiddenCards,
                [player]:arr,
            })
        }
        setInProcess([false, '']);
    }

    function swap(cardIndex, deck_or_pile){
        let numMap = ['first', 'second', 'third', 'fourth'];
        console.log(`tried to swap card number ${cardIndex}`);
        let newDeck = [...game.deck];
        let newPile = [...game.pile];
        let newHand = [...game.users[idx].hand];
        let newUsers = [...game.users];

        if (deck_or_pile ==='deck'){
            // swap a card from hand with top of deck
            newPile.push(newHand.splice(cardIndex, 1, newDeck.pop())[0]); //splice returns an array of the deleted elements
            socket.emit('card played', `${nickname} swapped out their ${numMap[cardIndex]} card for a card from the deck`);
        } else {
            // swap a card from hand with top of pile. Deck remains unchanged. 
            let pileCard = newPile.pop(); // top of pile
            let handCard = newHand[cardIndex];
            newHand[cardIndex]=pileCard;
            newPile.push(handCard);
            socket.emit('card played', `${nickname} swapped out their ${numMap[cardIndex]} card for a card from the pile`);
        }
        newUsers[idx].hand = newHand;
        let newState = {
            ...game,
            "deck": newDeck,
            "pile": newPile,
            "users": newUsers 
        };
        //setGame(newState);
        endTurn(newState);
        let myHiddenCards = [true, true, true, true];
        myHiddenCards[cardIndex] = false;
        setHiddenCards({...hiddenCards, "deck":true});
        setTimeout(()=>setHiddenCards({...hiddenCards,"deck":true,"clientCards":myHiddenCards}), 200); //show user the card they've just added to hand
        setTimeout(()=>setHiddenCards({...hiddenCards,"deck":true,"clientCards":[true,true,true,true]}), 5000);
        setInProcess([false, '']);
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

    function cardClicked(player, card, index){
        console.log(player, card);
        if (inProcess[0] && player === 'client' && inProcess[1] === 'deck'){
            swap(index, 'deck');
        }
        if (inProcess[0] && player === 'client' && inProcess[1] === 'pile'){
            swap(index, 'pile');
        }
        if (inProcess[1] === 'look at own' && player === 'client'){
            show(index, player);
        }
        if (inProcess[1] === 'look at theirs' && player !== 'client'){
            show(index, player);
        }
        if (inProcess[1] === 'pick your card to swap' && player === 'client'){
            //store this card
            setJackSwap([card,index])
            setInProcess([false, 'pick their card to swap']);
        }
        if (inProcess[1] === 'pick their card to swap' && player !== 'client'){
            //store this card
            performJackSwap(jackSwap, [card,index])
            setInProcess([false, '']);
        }
    };

    function performJackSwap(myCardArr, theirCardArr){
        console.log('to be completed', myCardArr, theirCardArr);
    };

    // set the cards in game to the current game state;
    let {myCards,player2Cards,player2Name,player3Cards,player3Name,player4Cards,player4Name,deckTop,pileTop}=setCardsToCurrentState(game,socket);
    
    let myCardElements = (myCards.map((card,index)=><div onClick = {()=>cardClicked('client', card, index)} key={index}><Card value = {card.value} suit = {card.suit} hidden = {hiddenCards.clientCards[index]}/></div>))
    let player2Elements = (player2Cards.map((card,index)=><div onClick = {()=>cardClicked('player2', card, index)} key={index}><Card value = {card.value} suit = {card.suit} hidden = {hiddenCards.player2[index]}/></div>))
    let player3Elements = (player3Cards.map((card,index)=><div onClick = {()=>cardClicked('player3', card, index)} key={index}><Card value = {card.value} suit = {card.suit} hidden = {hiddenCards.player3[index]}/></div>))
    let player4Elements = (player4Cards.map((card,index)=><div onClick = {()=>cardClicked('player4', card, index)} key={index}><Card value = {card.value} suit = {card.suit} hidden = {hiddenCards.player4[index]}/></div>))
    
    return (
        <div className='table-container'>
            <div id='host-cards' className='myCards'>
                <div>{nickname}</div>
                {myCardElements}
            </div>

            <div id='player2' className='player2'>
                {player2Name!==''&&<div>{player2Name}</div>}
                {player2Elements}
            </div>

            <div id='player3' className='player3'>
                {player3Name!==''&&<div>{player3Name}</div>}
                {player3Elements}
            </div>

            <div id='player4' className='player4'>
                {player4Name!==''&&<div>{player4Name}</div>}
                {player4Elements}
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

                {game.period === 'turns started' && isMyTurn(game,socket) && hiddenCards.deck && !inProcess[0] && <button onClick = {takeFromDeck}>Take card from deck</button>}
                {game.period === 'turns started' && isMyTurn(game,socket) && hiddenCards.deck && !inProcess[0] && <button onClick = {()=>setInProcess([true,'pile'])}>Take card from pile</button>}
                
                {game.period === 'turns started' && isMyTurn(game,socket) && !hiddenCards.deck && !inProcess[0] &&<button onClick={playCardToPile}>Play Straight to Pile</button>}
                {game.period === 'turns started' && isMyTurn(game,socket) && !hiddenCards.deck && !inProcess[0] &&<button onClick={()=>setInProcess([true, 'deck'])}>Swap with card from my hand</button>}

                {inProcess[0] && <h3>click the card you want to swap</h3>}

                {inProcess[1] === 'look at own' && <h3>click on one of your own cards you want to see, it will disappear in 10 seconds.</h3>}

                {inProcess[1] === 'look at theirs' && <h3>click someone elses card you want to see, it will disappear in 10 seconds.</h3>}

                {inProcess[1] === 'pick your card to swap' && <h3>click on one of your own cards you want to swap.</h3>}
                {inProcess[1] === 'pick their card to swap' && <h3>click on someone elses card you want to swap your card with.</h3>}
                
            </div>
        </div>
    )
}

export default Table;