module.exports = class CardAction
{
  static TARGET_ALL = 'all';
  static TARGET_ONE = 'one';

  static ACTION_COLLECT_FUNDS     = 'collectFunds';
  static ACTION_COLLECT_PROPERTY  = 'collectProperty';
  static ACTION_SWAP_PROPERTY     = 'swapProperty';

  constructor(card)
  {
    this.mCanBePrevented = true;
  }
}