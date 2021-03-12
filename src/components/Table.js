import React, {useState, useEffect} from 'react';
import Spade from './Cards/Spades';
import Club from './Cards/Clubs';
import Diamond from './Cards/Diamonds';
import Heart from './Cards/Hearts';
import GameState from '../Classes/GameState';
import User from '../Classes/User';

const Table = ({socket,input,host}) => {

    let {nickname, room, newRoom} = input;
    if (host){room = newRoom} //so that only need to refer to room 

    const [game, setGame] = useState(new GameState(room, nickname));

    useEffect(()=>{
        //init
        console.log(game);
        socket.on('user joined', (obj)=>{
            let newState = game;
            newState.users.push(new User(obj.nickname));
            setGame(newState);
            console.log(newState);
        })
    });

    return (
        <div>
            <Spade value = {'A'}/>
            <Club value = {'2'}/>
            <Diamond value = {'9'}/>
            <Heart value = {'K'}/>
        </div>
    )
}

export default Table;