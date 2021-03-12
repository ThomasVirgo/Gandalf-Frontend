class User{
    constructor(nickname){
        this.nickname = nickname;
        this.points = 0;
        this.hand = [];
        this.numCards = 4;
    }

    updatePoints(x){
        this.points += x;
    }

    updateNumCards(){
        this.numCards = this.hand.length;
    }

    getTotal(){
        let total = 0;
        for (let i=0; i<this.hand.length; i++){
            total += this.hand[i];
        }
        return total;
    }
}

export default User;
