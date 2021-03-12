import User from './User';

class GameState{
    constructor(room, initialUser){
        this.room=room;
        this.users = [new User(initialUser)];
        this.deck = [];
        this.pile = [];
        this.count = 0;
    }
}

export default GameState;