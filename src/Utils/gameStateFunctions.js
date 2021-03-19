const isMyTurn = (game, socket) =>{
    let turn = game.turn;
    if (game.users[turn].id === socket.id){
        return true;
    } else{
        return false
    }
}


const playMagicCard = (state, cardPlayed) => {
    console.log('magic card played was',cardPlayed);
    //7 or 8 look at your own
    //9 or 10 look at somebody elses
    //J swap with someone else
    //
}

export { isMyTurn, playMagicCard };
