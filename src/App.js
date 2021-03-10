import './CSS/App.css';
import React, {useState, useEffect} from 'react';
import Landing from './components/Landing';
import Game from './components/Game'
const io = require('socket.io-client');
//const ENDPOINT = 'http://localhost:5000/';
const ENDPOINT = 'https://Gandalf-Server.thomasvirgo.repl.co'; //hosting backend server on repl.it

function App() {

  //determines which component to render, landing or game. 
  const [isLanding, setIsLanding] = useState(true);
  const [socket, setSocket] = useState();

  useEffect(()=>{
    console.log('initalised with useEffect...')
    // create a socket when the user opens page
    const newSocket = io(ENDPOINT);
    newSocket.on('message', (msg)=>{console.log(msg)});
    setSocket(newSocket);

  },[])

  return console.log(socket), (
    <div>
      {isLanding ? <Landing socket = {socket}/> : <Game/>}
    </div>
  );
}

export default App;
