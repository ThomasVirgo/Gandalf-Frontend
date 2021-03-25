import User from './User';

class GameState{
    constructor(room, nickname, id){
        this.room=room;
        this.turn = 0;
        this.message = 'waiting for host to start the game...';
        this.users = [new User(nickname, id)];
        this.deck = [];
        this.pile = [];
        this.period = 'waiting for players';
        this.gandalf = [false, ''];
        this.round = 1;
        this.startIdx = 0; 
    }
}

export default GameState;