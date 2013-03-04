new R29.Beacon('Woopra', {
  src: '//static.woopra.com/js/woopra.js',
  onInitialize: function() {
    window.woopraReady = function(tracker) {
      tracker.setDomain(this.getDomain());
      tracker.setIdleTimeout(300000);
      tracker.trackPageview({ type:'pageview',url:window.location.pathname+window.location.search,title:document.title});
      return false;
    }
  },
  isLoaded: function() {
    return typeof woopraTracker != 'undefined'
  }
})