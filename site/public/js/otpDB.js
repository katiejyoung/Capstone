//Export for Server Use (secretKeeper.js)
module.exports = {
    createOTP: function() {
      return newOTP = new Map();
    },
    deleteOTP: function(key, otp) {
      return otp.delete(key);
    },
    getOTP: function(key, otp) {
      return otp.get(key);
    },
    replaceOTP: function(key, newOTP, oldOTP, otp) {
      if (otp.get(key) !== oldOTP) {
        throw new Error("Attempted to take multiple tokens simultaneously");
      }
      otp.set(key, newOTP);
    }
  }