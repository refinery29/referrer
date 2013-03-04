new R29.Beacon('Comscore', function() {
  http: 'http://sb.scorecardresearch.com/beacon.js',
  https: 'https://sb.scorecardresearch.com/beacon.js',
  variable: function() {
    return typeof COMSCORE != 'undefined' 
  }
})