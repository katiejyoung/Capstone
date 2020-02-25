//Source: https://levelup.gitconnected.com/rate-limiting-a0783293026a

//Export for Server Use (secretKeeper.js)
module.exports = {
  createTokens: function() {
    return newTokens = new Map();
  },
  deleteToken: function(key, tokens) {
    return tokens.delete(key);
  },
  getToken: function(key, tokens) {
    return tokens.get(key);
  },
  replaceToken: function(key, newToken, oldToken, tokens) {
    if (tokens.get(key) !== oldToken) {
      throw new Error("Attempted to take multiple tokens simultaneously");
    }
    tokens.set(key, newToken);
  }
}
