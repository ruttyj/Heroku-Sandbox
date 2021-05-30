module.exports = class 
{
  constructor()
  {
    this.mList = new Map();
    this.mTopId = 0;
  }

  makePerson(data)
  {
    const model = this.create(data);
    this.store(model);
    return model;
  }

  get(id)
  {
    if (this.mList.has(id))
      return this.mList.get(id);
    return null; 
  }

  create(data)
  {
    
  }

  store(model)
  {
    let id = this._getOrAssignId(model);
    this.mList.set(id, model);
  }

  remove(id) 
  {
    this.mList.remove(id);
  }

  _getOrAssignId(model)
  {
    let id = model.getId();
    if (id === 0 || !id) {
      id = ++this.mTopId;
      model.setId(id);
    }
    return id;
  }
  
}