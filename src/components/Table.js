import React, {useState, useEffect} from 'react';
import GameState from '../Classes/GameState';
import User from '../Classes/User';
import '../CSS/Table.css';
import createDeck from '../Utils/CreateDeck';
import dealCards from '../Utils/DealCards';
import Card from './Card';
import setCardsToCurrentState from '../Utils/setCards';
import {isMyTurn, addPlayerPoints} from '../Utils/gameStateFunctions';



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
    const [slapSwap, setSlapSwap] = useState([]);
    const [dblTrpl, setdblTrpl] = useState([]);

    const defaultHiddenCards = {
        "clientCards":[true,true,true,true],
        "player2":[true,true,true,true],
        "player3":[true,true,true,true],
        "player4":[true,true,true,true],
        "deck": true,
    };

    function showGameState(){console.log(game)};
    function showProcessState(){console.log(inProcess)};
    

    let idx;
    if (game.users!==[]){
        idx = game.users.findIndex((entry)=>entry.id === socket.id);  
    }
    

    useEffect(()=>{
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
        if (game.period === 'look at two cards' && !game.users[idx].ready){
            setHiddenCards(hiddenCards => {
                return {
                    ...hiddenCards,
                "clientCards":[false, false, true, true],
                "player2":[true,true,true,true], 
                "player3":[true,true,true,true], 
                "player4":[true,true,true,true],
                "deck": true 
                }
            });
        }

        if (game.gandalf[0] && game.gandalf[1] === game.users[game.turn]?.id){
            setHiddenCards(hiddenCards => ({
                ...hiddenCards,
                "clientCards":[false,false,false,false],
                "player2": [false,false,false,false],
                "player3": [false,false,false,false],
                "player4": [false,false,false,false],
            }))
            setInProcess([true,'']);
            //let newState = addPlayerPoints(game);
            setGame({
                ...game,
                "gandalf":[false, ''],
                "period":'ready to end round'
            })
        }
    }, [game, idx])

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

    //note this function is only accessible to the host
    function endRound(){
        let newState = addPlayerPoints(game);
        newState.period = 'ready to start new round';
        newState.message = 'waiting for host to start next round';
        changeState(newState);
    }

    function startNewRound(){
        //add button that shows when period is 'ready to start new round'
        console.log('new round started');
        let deck = createDeck();
        let newState = dealCards(game,deck);
        newState.pile = [];
        newState.message = 'Remember the two cards that are face up. Then click ready!';
        newState.period = 'look at two cards';
        newState.users.forEach(user => user.ready = false);
        newState.round ++; 
        if (newState.startIdx === newState.users.length-1){
            newState.startIdx = 0;
        } else {
            newState.startIdx ++;  
        }
        newState.turn = newState.startIdx;
        setInProcess([false, '']);
        changeState(newState);
        console.log('the new round started with this state: ', newState);
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
        setHiddenCards(defaultHiddenCards);
        socket.emit('state change', newState);
        checkAllReady(newState);
        setInProcess([false,'']);
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
        //show player the card
        setHiddenCards(hiddenCards=>{
            return {
                ...hiddenCards,
                "deck":false
            }
        });
        setInProcess([true, 'deck card taken']);
        //they then get option to play this card straight to the pile or swap it out for another card. 
        // add a setinProcess!
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
                setInProcess([true, 'look at own']); 
            } else if (cardPlayed.value === '9' || cardPlayed.value === '10'){
                setInProcess([true, 'look at theirs']);
            } else if (cardPlayed.value === 'J'){
                socket.emit('card played', `${nickname} played a jack, and is in process of swapping.`)
                setInProcess([true, 'pick your card to swap', newState]);
            } else if (cardPlayed.value === 'Q'){
                //increment turn an extra time, i.e. twice
                if (newState.users.length === 2){
                    setInProcess([false,""]);
                } else if (newState.users.length === 3){
                    if (newState.turn === 0){
                        newState.turn = 2;
                    } else {
                        newState.turn -= 1;
                    }
                } else if (newState.users.length === 4){
                    if (newState.turn < 2){
                        newState.turn += 2;
                    } else {
                        newState.turn -= 2;
                    }
                }    
            }
        } else {
            setInProcess([true, 'ready to end turn']);
        }
        changeState(newState)       
    }

    function changeState(newState){
        // this function takes the new game state and sends it to everyone. Also updates client state via setState.
        setGame(newState)
        socket.emit('state change', newState);
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
        //setInProcess([false, '']);
    }

    function swap(cardIndex, deck_or_pile){
        let numMap = ['first', 'second', 'third', 'fourth'];
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
        changeState(newState);
        let myHiddenCards = [true, true, true, true];
        myHiddenCards[cardIndex] = false; //show user the card they've just added
        setHiddenCards({...hiddenCards, "clientCards":myHiddenCards, "deck":true});
    }


    function cardClicked(player, card, index){
        console.log(player, card);
        if (inProcess[0] && player === 'client' && inProcess[1] === 'deck'){
            swap(index, 'deck');
            setInProcess([true, 'ready to end turn']);
        }
        if (inProcess[0] && player === 'client' && inProcess[1] === 'pile'){
            swap(index, 'pile');
            setInProcess([true, 'ready to end turn']);
        }
        if (inProcess[1] === 'look at own' && player === 'client'){
            show(index, player);
            setInProcess([true, 'ready to end turn']);
        }
        if (inProcess[1] === 'look at theirs' && player !== 'client'){
            show(index, player);
            setInProcess([true, 'ready to end turn']);
        }
        if (inProcess[1] === 'pick your card to swap' && player === 'client'){
            //store this card, third item of inprocess at this point is the state.
            setJackSwap([card,index, inProcess[2]])
            setInProcess([true, 'pick their card to swap']);
        }
        if (inProcess[1] === 'pick their card to swap' && player !== 'client'){
            //store this card
            performJackSwap(jackSwap, [card,index,player])
            setInProcess([true, 'ready to end turn']);
        }
        if (player === 'pile' && !game?.slap[0] && game.users[idx].hand.length > 1){
            setInProcess([true, 'slap']);
            let newState = {...game};
            newState.slap = [true, socket.id];
            newState.message = `${nickname} has slapped the ${card.value} of ${card.suit}`
            changeState(newState);
        }
        if (inProcess[1] === 'slap' && player !== 'client'){
            let theirCardArr = [card,index,player];
            setSlapSwap(theirCardArr);
            setInProcess([true,'slap correct']);
        }
        if (inProcess[1] === 'slap correct' && player === 'client'){
            let myCardArr = [card,index,player];
            performSlap(myCardArr, slapSwap);
            setInProcess([false, '']);
        }
        if (inProcess[1] === 'double' && player === 'client' && dblTrpl.length<2){
            let double = [...dblTrpl];
            if (double.length === 0) {
                double.push([card,index]);
                setdblTrpl(double);
            } 
            if (double.length === 1){
                let firstCard = double[0][0];
                if (firstCard.value !== card.value || firstCard.suit !== card.suit){
                    double.push([card,index]);
                    setdblTrpl(double);
                    setInProcess([true, 'double chosen']);
                }
            }
        }  
    };

    function multiPlayed(deck_or_pile){
        let cardsChosen = [...dblTrpl];
        let cardVal = cardsChosen[0][0].value;
        let correct = cardsChosen.every(cardArr => cardArr[0].value === cardVal); //check all the cards chosen have same value
        if (!correct){
            let newState = {...game};
            newState.users[idx].points += 10;
            changeState(newState);
            endTurn();
            return
        } 
        //otherwise must have got it correct
        let newState = {...game};
        let myHand = newState.users[idx].hand;
        if (deck_or_pile === 'deck'){
            let lowestIdx = cardsChosen[0][1];
            for (let i=0; i<cardsChosen.length; i++){
                if (cardsChosen[i][1] < lowestIdx){lowestIdx=cardsChosen[i][1]}
            }
            //keep the cards that arent in chosen cards
            let newHand = myHand.filter(card => {
                return cardsChosen.every(cardArr => cardArr[0].value !== card.value || cardArr[0].suit !== card.suit)
            });
            let deckCard = newState.deck.pop();
            newHand.splice(lowestIdx, 0, deckCard); //add card from deck into hand
            cardsChosen.forEach(cardArr=>newState.pile.push(cardArr[0])); //add double or triple to the pile
            newState.users[idx].hand = newHand;
            setInProcess([true, 'ready to end turn']);
            changeState(newState);
            //show them the deck card they took
            show(lowestIdx, 'client');
            setdblTrpl([]);
        }
    }

    function performJackSwap(myCardArr, theirCardArr){
        let myHand = [...game.users[idx].hand];
        let myCard = myCardArr[0];
        let theirCard = theirCardArr[0];
        let theirUserIdx = game.users.findIndex((userObj) => {
            return userObj.hand.some(entry=>entry.value===theirCard.value && entry.suit === theirCard.suit)
        });
        let theirHand = [...game.users[theirUserIdx].hand];
        //swap the cards
        myHand[myCardArr[1]] = theirCard;
        theirHand[theirCardArr[1]] = myCard;
        let newUsers = [...game.users];
        newUsers[idx].hand = myHand;
        newUsers[theirUserIdx].hand = theirHand;
        let newState = {
            ...myCardArr[2],
            "users":newUsers
        }
        changeState(newState);
        setJackSwap([]);
    };

    function performSlap(myArr, theirArr){
        let myHand = [...game.users[idx].hand];
        let myCard = myArr[0];
        let theirCard = theirArr[0];
        let theirUserIdx = game.users.findIndex((userObj) => {
            return userObj.hand.some(entry=>entry.value===theirCard.value && entry.suit === theirCard.suit)
        });
        let theirHand = [...game.users[theirUserIdx].hand];
        let newState= {...game};
        if (theirCard.value === pileTop.value){
            newState.pile.push(theirCard);
            theirHand[theirArr[1]] = myCard;
            myHand.splice(myArr[1],1); 
            newState.users[idx].hand = myHand;
            newState.users[theirUserIdx].hand = theirHand;
            newState.slap = [false, ''];
            changeState(newState);
        } else {
            newState.users[idx].points += 10;
            newState.slap = [false, ''];
            changeState(newState)
        }
    }

    function callGandalf(){
        
        let newState = {
            ...game,
            "gandalf":[true, socket.id]
        }
        if (newState.turn === newState.users.length-1){
            newState.turn = 0;
        } else {
            newState.turn = newState.turn + 1;  
        }
        changeState(newState);
        setInProcess([false, '']);
    }

    function endTurn(){
        // need to have changed cards state before this!!
        let newState = {...game};
        if (newState.turn === newState.users.length-1){
            newState.turn = 0;
        } else {
            newState.turn = newState.turn + 1;  
        }
        newState.message = `${newState.users[newState.turn].nickname}'s turn!`
        changeState(newState);
        setInProcess([false,'']);
        setHiddenCards(defaultHiddenCards);
    }

    // set the cards in game to the current game state;
    let {myCards,player2Cards,player2Name,player3Cards,player3Name,player4Cards,player4Name,deckTop,pileTop}=setCardsToCurrentState(game,socket);
    
    let myCardElements = (myCards?.map((card,index)=><div onClick = {()=>cardClicked('client', card, index)} key={index}><Card value = {card.value} suit = {card.suit} hidden = {hiddenCards.clientCards[index]}/></div>))
    let player2Elements = (player2Cards.map((card,index)=><div onClick = {()=>cardClicked('player2', card, index)} key={index}><Card value = {card.value} suit = {card.suit} hidden = {hiddenCards.player2[index]}/></div>))
    let player3Elements = (player3Cards.map((card,index)=><div onClick = {()=>cardClicked('player3', card, index)} key={index}><Card value = {card.value} suit = {card.suit} hidden = {hiddenCards.player3[index]}/></div>))
    let player4Elements = (player4Cards.map((card,index)=><div onClick = {()=>cardClicked('player4', card, index)} key={index}><Card value = {card.value} suit = {card.suit} hidden = {hiddenCards.player4[index]}/></div>))
    
    let leaderboard = (game?.users?.map((user,index)=><div key={index}>{user.nickname}: {user.points}</div>));
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
                    {pileTop&&<div onClick = {()=>cardClicked('pile', pileTop)}><Card value={pileTop.value} suit={pileTop.suit} hidden = {false}></Card></div>}
                </div>
            </div>
            
            <div className='main-message'>
                <div id='host-start-button'>
                    {host && game.period === 'waiting for players' && <button onClick = {startGame}>Start Game</button>}
                    {host && game.period === 'ready to end round' && <button onClick = {endRound}>End round</button>}
                    {host && game.period === 'ready to start new round' && <button onClick = {startNewRound}>Start new round</button>}
                    <button onClick = {showGameState}>Show Game State</button>
                    <button onClick = {showProcessState}>Show Process State</button>
                </div>
                <div id='instruction-message' className='instruction'>
                    <h4>{game.message}</h4>
                </div>
                <div>
                    <h5>Leaderboard</h5>
                   {leaderboard}  
                </div>
                
            </div>

            {!game.slap[0] && <div className='playButtons'>
                {game.period === 'look at two cards' && <button onClick = {readyUp}>Ready</button>}

                {game.period === 'turns started' && isMyTurn(game,socket) && !inProcess[0] && <button onClick = {takeFromDeck}>Take card from deck</button>}
                {game.period === 'turns started' && isMyTurn(game,socket) && !inProcess[0] && <button onClick = {()=>setInProcess([true,'pile'])}>Take card from pile</button>}
                {game.period === 'turns started' && isMyTurn(game,socket) && !inProcess[0] && <button onClick = {()=>setInProcess([true,'double'])}>Play a double</button>}
                {game.period === 'turns started' && isMyTurn(game,socket) && !inProcess[0] && <button onClick = {()=>setInProcess([true,'triple'])}>Play a triple</button>}
                {game.period === 'turns started' && isMyTurn(game,socket) && !inProcess[0] && !game.gandalf[0] && <button onClick = {callGandalf}>Gandalf!</button>}
                
                {inProcess[1] === 'deck card taken' &&<button onClick={playCardToPile}>Play Straight to Pile</button>}
                {inProcess[1] === 'deck card taken' &&<button onClick={()=>setInProcess([true, 'deck'])}>Swap with card from my hand</button>}

                {(inProcess[1] === 'double chosen' || inProcess[1] === 'triple chosen')&&<button onClick={()=>multiPlayed('deck')}>swap with deck</button>}
                {(inProcess[1] === 'double chosen' || inProcess[1] === 'triple chosen')&&<button onClick={()=>multiPlayed('pile')}>swap with pile</button>}

                {(inProcess[1] === 'deck' || inProcess[1] === 'pile') && <h3>click the card/cards you want to swap</h3>}
                
                {inProcess[1] === 'look at own' && <h3>click on one of your own cards you want to see, it will disappear in 10 seconds.</h3>}

                {inProcess[1] === 'look at theirs' && <h3>click someone elses card you want to see, it will disappear in 10 seconds.</h3>}

                {inProcess[1] === 'pick your card to swap' && <h3>click on one of your own cards you want to swap.</h3>}
                {inProcess[1] === 'pick their card to swap' && <h3>click on someone elses card you want to swap your card with.</h3>}

                {inProcess[1] === 'double' && <h3>click the two cards in your double</h3>}
                {inProcess[1] === 'triple' && <h3>click the three cards in your triple</h3>}
                
                {inProcess[1] === 'ready to end turn' && <button onClick = {endTurn}>End Turn</button>}
            </div>}
            <div id='slap options'>
                {inProcess[1] === 'slap' && <h3>click on someone elses card that you think matches the card on top of the pile.</h3>}
                {inProcess[1] === 'slap correct' && <h3>click on the card you want to give them</h3>}
            </div>
        </div>
    )
}

export default Table;