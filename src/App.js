import './CSS/App.css';
import React, {useState, useEffect} from 'react';
import Landing from './components/Landing';
import Game from './components/Game'
const io = require('socket.io-client');
//const ENDPOINT = 'http://localhost:5000/';
const ENDPOINT = 'https://Gandalf-Server.thomasvirgo.repl.co'; //hosting backend server on repl.it

function App() {

  const room = 'room';
  const nickname = 'nickname';
  const newRoom = 'newRoom';

  //determines which component to render, landing or game. 
  const [host, setHost] = useState(false);
  const [isLanding, setIsLanding] = useState(true);
  const [socket, setSocket] = useState();
  const [landingInput, setLandingInput] = useState({
    [room]:'',
    [nickname]:'',
    [newRoom]:'',
  });

  useEffect(()=>{
    console.log('initalised with useEffect...')
    // create a socket when the user opens page
    const newSocket = io(ENDPOINT);
    newSocket.on('message', (msg)=>{console.log(msg)});
    newSocket.on('enter room', ()=>{enterRoom()});
    newSocket.on('entrance error', (error) => {alert(error)});
    setSocket(newSocket);

  },[])

  function handleLandingChange(event){
    setLandingInput({
        ...landingInput,
        [event.target.name]:event.target.value,
    });
  }

  function handleGameEntrance(event){
      event.preventDefault();
      console.log(`${landingInput.nickname} submitted code ${landingInput.room}`);
      if (landingInput.room && landingInput.nickname){
          socket.emit('join game', landingInput);
      }
  }

  function createNewRoom(event){
      event.preventDefault();
      console.log('create a new code!')
      socket.emit('new room', landingInput);
      setIsLanding(false);
      setHost(true); //this user created the game and hence they are the host..
  }

  function enterRoom(){
    setIsLanding(false);
  }

  return (
    <div>
      {isLanding ? <Landing handleChange = {handleLandingChange} handleSubmit = {handleGameEntrance} createNewCode = {createNewRoom}/>
       : <Game socket = {socket} input = {landingInput} host = {host}/>}
    </div>
  );
}

export default App;
