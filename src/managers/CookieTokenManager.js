const { isDef } = require('../lib/utils');

module.exports = class 
{
  constructor()
  {
    this.mTokens = new Map();
    this.mClientHasTokens = new Map();
    this.tokenHasClients = new Map();
    this.mTopId = 0;
  }

  generateToken()
  {
    const rand = () => Math.random().toString(36).substr(2);
    const makeToken = () => rand() + rand();

    let token;
    do {
      token = makeToken();
    } while (this.mTokens.has(token));

    this.mTokens.set(token, {});

    return token;
  }

  associateTokenAndClient(token, clientId)
  {
    if (this.mTokens.has(token)) {
      let tokens = this.mClientHasTokens.get(clientId) || {};
      if (!isDef(tokens[token])) {
        tokens[token] = true;
        this.mClientHasTokens.set(clientId, tokens);
      }

      let clientIds = this.tokenHasClients.get(token) || {};
      if (!isDef(clientIds[token])) {
        clientIds[clientId] = true;
        this.tokenHasClients.set(token, clientIds);
      }
    }
  }

  dissociateTokenAndClient(token, clientId)
  {
    if (this.mTokens.has(token)) {
      let tokens = this.mClientHasTokens.get(clientId) || {};
      if (isDef(tokens[token])) {
        delete tokens[token];
        if (Object.keys(tokens).length === 0) {
          this.mClientHasTokens.remove(clientId);
        }
      }

      let clientIds = this.tokenHasClients.get(token) || {};
      if (isDef(clientIds[token])) {
        delete clientIds[clientId];
        if (Object.keys(clientIds).length === 0) {
          this.tokenHasClients.remove(token);
        }
      }
    }
  }

  dissociateClient(clientId)
  {
    let tokensKeyed = this.mClientHasTokens.get(clientId) || {};
    console.log("dissociate", clientId);
    let tokens = Object.keys(tokensKeyed);
    tokens.forEach((token) => {
      let toClients = this.tokenHasClients.get(token) || {};
      if (isDef(toClients[clientId])) 
        delete toClients[clientId];
    });
    this.mClientHasTokens.remove(clientId);
  }

  getClientIdsForToken(token)
  {
    return Object.keys(this.tokenHasClients.get(token) || {});
  }

  getTokensForClientId(clientId)
  {
    return Object.keys(this.mClientHasTokens.get(clientId) || {});
  }

  getTokenForClientId(clientId) {
    let tokens = this.getTokensForClientId(clientId);
    if (isDef(tokens)) {
      return tokens[0];
    }
    return null;
  }

  // @TODO clean up tokens

}
