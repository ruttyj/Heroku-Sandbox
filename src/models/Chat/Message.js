module.exports = class 
{
  constructor(data={})
  {
    this.mMessage = data.message || "";
    this.mType = data.type || "message";
    this.authorId = data.authorId || null;
  }

  serialize()
  {
    return {
      message: this.mMessage,
      authorId: this.authorId,
      type: this.mType,
    }
  }
}