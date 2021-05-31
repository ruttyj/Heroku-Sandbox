module.exports = class 
{
  constructor(data={})
  {
    this.mIsTyping = data.isTyping || null;
    this.authorId = data.authorId || null;
  }

  serialize()
  {
    return {
      isTyping: this.mIsTyping,
      authorId: this.authorId,
    }
  }
}