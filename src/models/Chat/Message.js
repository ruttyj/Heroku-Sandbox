module.exports = class 
{
  constructor(data={})
  {
    this.mMessage = data.message || "";
    this.mType = data.type || "message";
    this.authorId = data.authorId || null;
    this.authorName = data.authorName || null;
  }

  serialize()
  {
    return {
      message: this.mMessage,
      authorName: this.authorName,
      authorId: this.authorId,
      type: this.mType,
    }
  }
}