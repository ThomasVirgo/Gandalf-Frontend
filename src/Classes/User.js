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

    getTotal(){
        let total = 0;
        for (let i=0; i<this.hand.length; i++){
            total += this.hand[i];
        }
        return total;
    }
}

export default User;
