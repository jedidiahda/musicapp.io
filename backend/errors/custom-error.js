class CustomError extends Error{
  statusCode = 400;
  constructor(msg){
    super(msg);
  }

  static getStatusCode(){
    this.statusCode;
  }
  
}

module.exports = CustomError;