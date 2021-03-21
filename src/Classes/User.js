class User{
    constructor(nickname, id){
        this.nickname = nickname;
        this.id = id;
        this.points = 0;
        this.hand = [];
        this.ready = false;
    }
}

export default User;
