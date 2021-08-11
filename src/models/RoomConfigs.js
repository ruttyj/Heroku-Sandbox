const PersonContainer = require('../containers/Person');
const List = require('../lib/List');
const UnorderedMap = require('../lib/UnorderedMap');
const OrderedMap = require('../lib/OrderedMap');
const Person = require('./Person');
module.exports = class RoomConfigs
{
  constructor(room)
  {
    this.mRoom = room;
    this.mReadyPeople = new Map();
    this.mFields = new OrderedMap();
    this.mFields.setKeyField('key');

    this.mValues = new UnorderedMap();
    this.initFields();
  }

  initFields()
  {
    this.mFields.add({
      label: "Open room",
      key: 'Is_ROOM_OPEN',
      type: "bool",
      default: true,
    });

    this.mFields.add({
      label: "Game",
      key: 'GAME_TYPE',
      type: "select",
      options: ['PLAYDEAL', 'SKIPBOO', 'UNO'],
      default: 'PLAYDEAL',
    });


    this.mFields
        .forEach(field => this.updateField(field.key, field.default))
  }

  updateField(fieldKey, value)
  {
    this.mValues.set(fieldKey, value);
  }

  getRoom()
  {
    return this.mRoom;
  }

  setPersonIsReady(personId, value=true)
  {
    this.mReadyPeople.set(personId, value);
  }

  getIsEveryoneReady()
  {
    const people = this.getRoom().getPeople();
    const members = people.filter((person) => person.hasTag(Person.TYPE_MEMBER));
    const ready = members.filter((person) => person.hasTag(Person.IS_READY));

    const isEveryoneReady = members.length > 0 && ready.length === members.length;

    return isEveryoneReady;
  }

  serialize()
  {
    return {
      values: this.mValues.serialize(),
      fields: this.mFields.serialize(),
    }
  }
}