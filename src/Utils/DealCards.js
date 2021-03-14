const dealCards = (currentState, deck) => {
    let users = currentState.users;
    let newState = currentState;
    for (let i=0; i<users.length; i++){
        let cards = [];
        // give them 4 cards from the deck, and remove these from deck. 
        for (let j=0; j<4; j++){
            let currCard = deck.pop();
            cards.push(currCard);
        }
        newState.users[i].hand = cards;
    }
    newState.deck = deck;
    return newState;
}

export default dealCards;

