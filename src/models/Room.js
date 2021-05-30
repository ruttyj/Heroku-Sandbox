const PersonContainer = require('../containers/Person');

module.exports = class Connection 
{
  constructor(data={})
  {
    this.mId = data.id || 0;
    this.mCode = data.code || 'default';
    this.mPeople = new PersonContainer();
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
   *                      People
   *******************************************************/
  addPerson(person)
  {
    this.mPeople.add(person);
  }

  removePerson(personId)
  {
    this.mPeople.remove(personId);
  }

  hasPerson(personId)
  {
    return this.mPeople.has(personId);
  }

  hasPeople()
  {
    return !this.mPeople.isEmpty();
  }

  /*******************************************************
   *                      Serialize
   *******************************************************/
  serialize()
  {
    return {
      id: this.getId(),
      code: this.getCode(),
      personCount: this.mPeople.count(),
      people: this.mPeople.keys(),
    }
  }
}
