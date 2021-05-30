module.exports = class 
{
  constructor()
  {
    this.mList = new Map();
    this.mTopId = 0;
  }

  make(data)
  {
    const model = this.create(data);
    this.store(model);
    return model;
  }

  has(id)
  {
    return this.mList.has(id);
  }

  get(id)
  {
    if (this.has(id))
      return this.mList.get(id);
    return null; 
  }

  keyedList()
  {
    let results = {};
    this.mList.forEach((value, key) => {
      results[key] = value;
    })

    return results;
  }


  list()
  {
    let results = [];
    this.mList.forEach((value) => {
      results.push(value);
    })

    return results;
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