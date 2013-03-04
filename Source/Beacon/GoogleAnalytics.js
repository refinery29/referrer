new Beacon('GoogleAnalytics', {
  http: 'http://www.google-analytics.com/ga.js',
  https: 'https://ssl.google-analytics.com/ga.js',
  isLoaded: function() {
    return typeof gaGlobal != 'undefined'
  },
  onInitialize: function() {
    this.queue = (window._gaq || (_gaq = []));
  }
})  