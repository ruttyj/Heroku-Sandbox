module.exports = class 
{
  constructor()
  {
    this.mMessages = [];
  }

  clear()
  {
    this.mMessages = [];
  }

  add(message)
  {
    this.mMessages.push(message);
  }

  serialize()
  {
    return {
      messages: this.mMessages.map(message => message.serialize()),
    }
  }
}