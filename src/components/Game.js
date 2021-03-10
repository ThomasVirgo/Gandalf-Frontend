import React from 'react';
import History from './History';
import Chat from './Chat';
import Table from './Table';
import '../CSS/Game.css';

const Game = ({socket,input,host}) => {

    //const {nickname, room, newRoom} = input;

    return (
        <div id = 'main-game-container' className = 'grid-container'>
            <div id = 'history' className = 'history'>
                <History socket = {socket} input = {input} host = {host}/>
            </div>

            <div id = 'chat' className = 'chat'>
                <Chat socket = {socket} input = {input} host = {host}/>
            </div>

            <div id = 'game-table' className = 'table'>
                <Table socket = {socket} input = {input} host = {host}/>
            </div>
        </div>
        // <div>
        //     <h1>Game Page.</h1>
        //     <h2>{socket.id}</h2>
        //     <h2>{room || newRoom}</h2>
        //     <h2>{nickname}</h2>
        // </div>
    )
}

export default Game;
