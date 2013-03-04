new R29.Beacon('Kissmetrics', {
  src: '//i.kissmetrics.com/i.js',
  onLoad: function() {
    if (!this.id) throw 
    this.load.call({
      src: '//doug1izaerwt3.cloudfront.net/' + this.getID() + '.1.js'
    });
  },
  onInitialize: function() {
    this.queue = (window._kmk || (_kmk = []))
  },
  isLoaded: function() {
    return typeof KM != 'undefined'
  }
})