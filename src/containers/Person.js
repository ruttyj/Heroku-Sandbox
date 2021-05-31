

module.exports = class 
{
  constructor()
  {
    this.mList = new Map();
    this.mTopId = 0;
  }

  add(model)
  {
    let id = model.getId();
    this.mList.set(id, model);
    return model;
  }

  get(id)
  {
    if (this.mList.has(id)) {
      return this.mList.get(id);
    }
    return null;
  }

  getEveryoneElse(model)
  {
    let myId = model.getId();
    let result = [];
    this.mList.forEach((model, key) => {
      if (key !== myId) {
        result.push(model);
      }
    })

    return result;
  }

  getEveryone()
  {
    return this.list();
  }

  emitToEveryone(eventType, payload)
  {
    this.getEveryone().forEach(person => {
      person.emit(eventType, payload);
    })
  }

  emitToEveryoneElse(model, eventType, payload)
  {
    this.getEveryoneElse(model).forEach(person => {
      person.emit(eventType, payload);
    })
  }


  remove(id)
  {
    this.mList.remove(id);
  }
  
  has(id)
  {
    return this.mList.has(id);
  }

  count()
  {
    return this.mList.size;
  }

  isEmpty()
  {
    return this.count() === 0;
  }

  keys()
  {
    let result = [];
    this.mList.forEach((model, key) => {
      result.push(key);
    })

    return result;
  }

  list()
  {
    let result = [];
    this.mList.forEach((model) => {
      result.push(model);
    })

    return result;
  }
}