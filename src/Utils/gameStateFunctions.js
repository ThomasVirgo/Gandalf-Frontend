const isMyTurn = (game, socket) =>{
    let turn = game.turn;
    if (game.users[turn].id === socket.id){
        return true;
    } else{
        return false
    }
}

export { isMyTurn };
