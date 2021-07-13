const ActionAugmentContainer = require('./ActionAugments/ActionAugmentContainer');

//////////////////////////////////////////
// CARD
module.exports = class Card 
{
  constructor()
  {
    this.mValue = 0;
    this.mTags = new Map();
    this.mLabel = 'Unlabeled';
    this.mAugments = new 
    this.mEffects = new ActionAugmentContainer();
  }

  addTag(tag) 
  {
    this.mTags.set(tag, true);
  }

  removeTag(tag)
  {
    this.mTags.delete(tag, true);
  }

  getValue()
  {
    return this.mValue;
  }
}