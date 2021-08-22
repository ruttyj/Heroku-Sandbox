export default function ({ get, socket, wrapName, game }) {

  function getCardIds()
  {
    return get([wrapName('me'), 'hand', 'cards'], []);
  }

  function getCards()
  {
    return getCardIds().map(cardId => game.getCard(cardId));
  }

  function getDeckCount()
  {
    return get([wrapName('me'), 'deck', 'count'], null);
  }

  function getDeckTopCard()
  {
    const topCardId = get([wrapName('me'), 'deck', 'topCardId'], null);
    if (topCardId) {
      return game.getCard(topCardId);
    }

    return null;
  }

  return {
    getCards,
    getDeckCount,
    getDeckTopCard,
  }
}