module.exports = class PlayerContainer 
{
  constructor()
  {
    this.mItems = new Map();
  }

  add(player)
  {
    this.mItems.set(player.id, player);
  }

  forEach(callback=()=>{}) 
  {
    this.mItems.forEach(callback)
  }

  map(callback=()=>{}) 
  {
    return this.mItems.map(callback)
  }

  move(fromIndex, toIndex)
  {

  }

  swap(fromIndex, toIndex)
  {

  }
}