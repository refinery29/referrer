new R29.Beacon('Errorception', {
  src: '//d15qhc0lu1ghnk.cloudfront.net/beacon.js',
  isLoaded: function() {
    return typeof _errs != 'undefined' && 'meta' in _errs;
  },
  onInitialize: function() {
    window._errs=[this.getID()];
    window.onerror = function() {
      _errs.push(arguments);
    }
  }
})