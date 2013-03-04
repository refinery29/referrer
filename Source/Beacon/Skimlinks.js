new R29.Beacon('Skimlinks', {
  getURL: function() {
    return 'http://s.skimresources.com/js/' + this.getID() + '.skimlinks.js'
  },
  isLoaded: function() {
    return typeof skimlinks != 'undefined';
  }
})