new R29.Beacon({
  http: 'http://edge.quantserve.com/quant.js',
  onInitialize: function() {
    window._qoptions= { qacct: this.getID() };
  },
  isLoaded: function() {
    return typeof quantserve != 'undefined'
  }
});