import User from './User';

class GameState{
    constructor(room, nickname, id){
        this.room=room;
        this.users = [new User(nickname, id)];
        this.deck = [];
        this.pile = [];
        this.count = 0;
    }
}

export default GameState;