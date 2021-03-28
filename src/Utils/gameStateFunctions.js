const isMyTurn = (game, socket) =>{
    let turn = game.turn;
    if (game.users[turn]?.id === socket.id){
        return true;
    } else{
        return false
    }
}

const addPlayerPoints = (game) => {
    let gandalfID = game.gandalf[1];
    console.log(game);
    console.log(gandalfID);
    let newUsers = [...game.users];
    let lowestPoints = [1000,''];
    for (let i=0; i<newUsers.length; i++){
        let user = newUsers[i];
        let hand = user.hand;
        let userPoints = 0;
        for (let j=0; j<hand.length; j++){
            let pictureCards = ['J', 'Q', 'K'];
            let value = hand[j].value;
            if (value === 'A'){
                user.points += 1;
                userPoints +=1;
            } else if (pictureCards.indexOf(value) === -1){
                user.points += Number(value);
                userPoints += Number(value);
            } else {
                user.points += 10;
                userPoints += 10;
            }
        }
        if (userPoints<lowestPoints[0]){
            lowestPoints = [userPoints, user.id];
        }
    }
    let idx = newUsers.findIndex(user=>user.id===gandalfID);//find the index of the person who called gandalf
    console.log(idx);
    if (lowestPoints[1]===gandalfID){
        newUsers[idx].points -= lowestPoints[0]; //person called gandalf and won
    } else {
        newUsers[idx].points += 10; //person called gandalf and lost, add 10 points
    }
    let newState = {
        ...game,
        "message":'round over, points have been added!',
        "users":newUsers,
    }
    return newState
}


export { isMyTurn, addPlayerPoints };
