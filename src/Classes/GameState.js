import User from './User';

class GameState{
    constructor(room, nickname, id){
        this.room=room;
        this.turn = 0;
        this.message = 'waiting for host to start the game...';
        this.users = [new User(nickname, id)];
        this.deck = [];
        this.pile = [];
        this.count = 0;
        this.show2 = true; //becomes false once each player has looked at 2 cards.
    }
}

export default GameState;