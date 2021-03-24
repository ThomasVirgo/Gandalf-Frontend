const setCardsToCurrentState = (game, socket) => {
    let users = [...game.users];
    let myIndex = users.findIndex(user => user.id===socket.id);

    // get your own cards
    let idxList = [0,1,2,3];
    let myCards = users[myIndex]?.hand;

    idxList.splice(myIndex,1);

    if (myIndex===1){idxList=[2,3,0]};
    if (myIndex===2){idxList=[3,0,1]}

    let player2Cards = [];
    let player2Name = '';
    if (users[idxList[0]]){
        player2Cards = users[idxList[0]].hand;
        player2Name = users[idxList[0]].nickname;
    }

    let player3Cards = [];
    let player3Name = '';
    if (users[idxList[1]]){
        player3Cards = users[idxList[1]].hand;
        player3Name = users[idxList[1]].nickname;
    }

    let player4Cards = [];
    let player4Name = '';
    if (users[idxList[2]]){
        player4Cards = users[idxList[2]].hand;
        player4Name = users[idxList[2]].nickname;
    }

    let deckTop = game.deck[game.deck.length-1];
    let pileTop;
    if (game.pile.length > 0){pileTop=game.pile[game.pile.length-1]};

    return {
        myCards,
        player2Cards,
        player2Name,
        player3Cards,
        player3Name,
        player4Cards,
        player4Name,
        deckTop,
        pileTop
    }
}

export default setCardsToCurrentState;