class GameState{
    constructor(room){
        this.room=room;
        this.users = [];
        this.deck = [];
        this.pile = [];
        this.count = 0;
    }
}

export default GameState;