const Base = require('../Base');
const PlayerManager = require('./Players/PlayerManager');
const List = require('../../../lib/List');
const CardManager = require('./Cards/CardManager');

module.exports = class SkipBo extends Base {
  constructor() {
    super();
    this.mType = 'SKIPBO';
    this.mPlayerManager;
    this.mCardManager;
    this.mDeck;
    this.mPiles;
    this.reinit();
  }

  reinit() {
    this.mPlayerManager = new PlayerManager();

    // Create cards
    this.mCardManager = new CardManager();
    this.mCardManager.makeCards();
    
    // Add cards to the deck
    this.makeNewDeck();


    this.mPiles = [
      new List(),
      new List(),
      new List(),
      new List(),
    ];
  }

  makeNewDeck()
  {
    this.mDeck = new List();
    let cards = this.mCardManager.getCards();
    cards.forEach(card => {
      this.mDeck.add(card.getId());
    })
    this.mDeck.shuffle();
  }

  getCardManager()
  {
    return this.mCardManager;
  }

  getDeck()
  {
    return this.mDeck;
  }

  addPerson(person)
  {
    const personId = person.getId();
    const playerManager = this.getPlayerManager();
    playerManager.makePlayerFromPerson(personId);
  }

  getPlayerManager()
  {
    return this.mPlayerManager;
  }

  dealInitialCards()
  {
    const playerManager = this.getPlayerManager();
    const deck = this.getDeck();
    // Deal each player their deck
    const deckSize = 25;
    for (let i=0; i<deckSize; ++i)
    {
      // For each player deal a card
      playerManager.getPlayerList().forEach(player => {
        // Deal 1 card to the players deck
        const cardId = deck.pop();
        const playerDeck = player.getDeck();
        playerDeck.push(cardId);
      })
    }

    // Deal 5 cards to each player
    playerManager.getPlayerList().forEach(player => {
      const hand = player.getHand();
      for (let i=0; i<5; ++i)
      {
        const cardId = deck.pop();
        hand.add(cardId);
      }
    })
  }


  dealCheatCards()
  {
    const playerManager = this.getPlayerManager();
    const cardManager = this.getCardManager();
    const deck = this.getDeck();

    //------------------------------------
    // Initialize Card Map
    const cardMap = new Map();
    cardMap.set('WILD', new List());
    for (let i=1; i<13; ++i) {
      cardMap.set(i, new List());
    }
    deck.forEach(cardId => {
      const card = cardManager.getCard(cardId);
      if(card.getType() === 'NUMBER') {
        cardMap.get(card.getValue()).push(cardId);
      } else if (card.getType() === 'WILD') {
        cardMap.get('WILD').push(cardId);
      }
      console.log('card', card)
    })
    //------------------------------------


    //------------------------------------
    // Deal 5 cards to each player
    playerManager.getPlayerList().forEach(player => {
      const hand = player.getHand();
      for (let i=1; i<6; ++i)
      {
        let cardId = cardMap.get(i).pop();
        deck.removeItemByValue(cardId);
        hand.add(cardId);
      }
    })
    //------------------------------------


    //------------------------------------
    // Deal each player their deck
    const deckSize = 25;
    for (let i=0; i<deckSize; ++i)
    {
      // For each player deal a card
      playerManager.getPlayerList().forEach(player => {
        // Deal 1 card to the players deck
        const cardId = deck.pop();
        const playerDeck = player.getDeck();
        playerDeck.push(cardId);
      })
    }
    //------------------------------------
  }

  serializePiles()
  {
    return this.mPiles.map((pile, key) => {
      return {
        index:    key,
        topValue: pile.getCount(),  // value of the card not of the card ID
        cards:    pile.toArray(),   // array of card IDs
      }
    })
  }

  serializeCards()
  {
    let result = {};

    this.mCardManager.getCards().forEach(card => {
      result[card.getId()] = card.serialize();
    })

    return result;
  }

  serializeDeck()
  {
    return {
      count:    this.mDeck.getCount()
    }
  }

  serializePlayers()
  {
    let result = {
      items: {},
      order: [],
    }
    const playerManager = this.getPlayerManager();
    playerManager.getPlayerList().forEach(player => {
      const playerId = player.getId();
      result.items[playerId] = player.serializeOther();
      result.order.push(playerId);
    })
  
    return result;
  }

  serializeMe(playerId)
  {

  }
}