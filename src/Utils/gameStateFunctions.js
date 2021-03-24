const isMyTurn = (game, socket) =>{
    let turn = game.turn;
    if (game.users[turn]?.id === socket.id){
        return true;
    } else{
        return false
    }
}

const addPlayerPoints = (game) => {
    let newUsers = [...game.users];
    for (let i=0; i<newUsers.length; i++){
        let user = newUsers[i];
        let hand = user.hand;
        for (let j=0; j<hand.length; j++){
            let pictureCards = ['J', 'Q', 'K'];
            let value = hand[j].value;
            if (value === 'A'){
                user.points += 1;
            } else if (pictureCards.indexOf(value) === -1){
                user.points += Number(value);
            } else {
                user.points += 10;
            }
        }
    }
    let newState = {
        ...game,
        "message":'round over, points have been added!',
        "users":newUsers,
    }
    return newState
}


export { isMyTurn, addPlayerPoints };
