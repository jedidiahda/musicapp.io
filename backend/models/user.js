let users = [
  {
    username: "user1",
    password: "123456"
  },
  {
    username: "user2",
    password: "123456"
  },
  {
    username: "user3",
    password: "123456"
  },
];

class User{
  constructor(username,password){
    this.username = username;
    this.password = password;
  }

  static getUser(username){
    return users.find(u => u.username === username);
  }

  
}

module.exports = User;