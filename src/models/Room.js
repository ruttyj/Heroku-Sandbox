const PersonManager = require('./PersonManager');

module.exports = class Connection 
{
  constructor()
  {
    this.mId = '0';
    this.mCode = 'default';
    this.mPersonManager = new PersonManager();
  }

  /*******************************************************
   *                         Id
   *******************************************************/
  setId(value)
  {
      this.mId = value;
  }

  getId()
  {
      return this.mId;
  }

  /*******************************************************
   *                         Code
   *******************************************************/
  setCode(value)
  {
      this.mCode = value;
  }

  getCode()
  {
      return this.mCode;
  }


  /*******************************************************
   *                      Serialize
   *******************************************************/
  serialize()
  {
    return {
      id: this.getId(),
      code: this.getCode(),
    }
  }
}
