class User{
    constructor(nickname, id){
        this.nickname = nickname;
        this.id = id;
        this.points = 0;
        this.hand = [];
        this.ready = false;
    }

    updatePoints(x){
        this.points += x;
    }

    updateNumCards(){
        this.numCards = this.hand.length;
    }
    //methods dont work when passing object via socket.io!, write a util function instead. 
    getTotal(){
        let total = 0;
        for (let i=0; i<this.hand.length; i++){
            let pictureCards = ['J', 'Q', 'K'];
            let cardValue = this.hand[i].value;
            if (cardValue === 'A'){
                total += 1;
            } else if (pictureCards.indexOf(cardValue) === -1){
                total += Number(cardValue);
            } else {
                total += 10;
            }
        }
        this.points += total;
    }
}

export default User;
