new R29.Beacon('Parsely'. {
  http: 'http://static.parsely.com/p.js',
  https: 'https://d1z2jf7jlzjs58.cloudfront.net/p.js',
  isLoaded: function() {
    return typeof PARSELY != 'undefined' 
  }
})