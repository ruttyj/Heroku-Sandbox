const CardAction = require('../CardAction');

module.exports = class CollectionAction extends CardAction
{
  constructor(card)
  {
    super(card);
    this.mCanBePrevented = true;
  }
}