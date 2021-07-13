class FieldManager
{
  constructor()
  {
    this.mTopId = 0;          // resetTopId()
    this.mFields = new Map(); // clearFields()
  }

  makeNextId()
  {
    return ++this.mTopId;
  }

  addField(props)
  {
    let id = this.makeNextId();
    this.setField(id, {
      id,
      ...props,
    })

    return this.getField(id);
  }

  setField(id, value)
  {
    this.mFields.set(id, value);
  }

  getField(id)
  {
    return this.mFields.get(id);
  }

  clearFields()
  {
    this.mFields = new Map();
  }

  resetTopId()
  {
    this.mTopId = 0;
  }

  clear()
  {
    this.clearFields();
    this.resetTopId();
  }

  serialize()
  {
    let items = {};
    let order = [];
    this.mFields.forEach((value, key) => {
      items[key] = value;
      order.push(key);
    })
    return {
      items,
      order
    }
  }
}


//////////////////////////////////////////
// GameConfig
module.exports = class GameConfig
{
  constructor()
  {
    this.mValues = {};
    this.mFieldManager = new FieldManager();
  }

  populateFields()
  {
    this.mFieldManager.addField({
      type: "hRange",
      key: "turnTimeLimit",
      label: "Turn Time Limit",
      description: "(in seconds)",
      min: 0,
      max: 300,
      step: 30,
      default: 120,
    })
  }

  // Returns json compatible value
  serializeFields()
  {
    return this.mFieldManager.serialize();
  }

  serializeValues()
  {
    return this.mValues;
  }
}