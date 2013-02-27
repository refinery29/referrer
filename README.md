R29.js
===

A library of a few simple stand-alone modules that enable advanced session tracking capabilities on clientside. Modules can be used separately or together (e.g. a R29.Referrers is a STORED LOG of URLs)

R29.Referrers
====

A simple library to parse and normalize R29.Referrers. 


    referrers = new R29.Referrers(document);
    // checks ?utm_ params on current page, tracks R29.Referrers. 
    //Saves into cookies or local storage

    // track hit explicitly
    R29.Referrers.push('http://google.com?q=something');

    // Now you can query R29.Referrers
    if (R29.Referrers.was('email'))
      alert ('email lol')

    // query known sites
    R29.Referrers.was('facebook');
    // query domains
    R29.Referrers.was('gizoogle.com');
    // query domains with multiple zones
    R29.Referrers.was('sales.co.uk');

    // query known R29.Referrers with parameter
    R29.Referrers.was('google') //true;
    R29.Referrers.was('google?q=something') //true;
    R29.Referrers.was('google?q=otherthing') //false;

    // query parameters with wildcars
    R29.Referrers.was('google?q=some*')
    // query parameters with regexes 
    R29.Referrers.was('google?q=*some(one|body)*')

    // query url encoded parameters
    R29.Referrers.was('http://google.com?q=exposé')
    R29.Referrers.was('http://google.com?q=expos%C3%A9')

    // query main page
    R29.Referrers.was('reddit/')

    // query known websites directories
    // there're per-site settings for max. deepness to keep
    // and also exceptions list to avoid saving specific paths 
    R29.Referrers.was('pinterest/somebody')
    R29.Referrers.was('reddit/r/something')


Session
===

Session is a temporary history of all events and visited pages by a single user. Implements analytics hooks, allows query 


    var session = new R29.Session;

    // log currently loaded page
    session.push(document);

    // log a page hit, /beauty
    session.push('/beauty')

    // log an internal page hit, /beauty/slideshow
    session.push('#slideshow')


    // implement GA event hook
    session.onPush = function(arg) {
      if (arg.push) //array was given, treat it as event
        _gaq.push(['_trackEvent'].concat(arg))
    }

    // log an event
    session.push(['slideshow', 'slide', 5, true])

    // console-compatible API
    session.log('hello workd');

    session.time('page load');
    window.onload = function() {
      session.timeEnd('page load')
    }
    
    // query session for values
    session.indexOf('/beauty') //0, user was on /beauty page
    session.indexOf('/ugliness') //-1, user was not on /ugliness page
    
    


Storage
===

A powerful object with multiple adapters (Cookies, localStorage, sessionStorage, IndexDB, REST, Queue) that implements a key-value storage.

      
    // get value by key
    R29.Storage.get(key);
   
    // set a value by key
    R29.Storage(key, value)

     // remove a value by key
    R29.Storage(key)

    // sync array with storage (store values from array and fetch 
    // values from storage, use array values in case of conflicts)
    R29.Storage(array)

    // store values from native array
    [1,2,3].forEach(R29.Storage)

    // populate a native array with values from cookies
    R29.Storage([]) 
   
    // create a localSession-compatible storage with prefix
    var storage = new R29.Storage('clients');
    storage.getItem('somethng', function(value) {})

    // create a storage with specific adapter
    new R29.Storage.Cookies



Log
===

Log is a simple array-like abstraction that holds multiple values, trims them and queries

    // all settings are optional
    var log = new R29.Log({
      // limit number of items in log
      limit: 10,
      // separator used for serialization
      separator: '|',
      // parse the string to set initial values
      string: 'a|b|c,
      // add an offset from a previous logs
      size: 5,
      // only store unique items
      unique: true
    })
    // implement a hook to store values
    log.onChange = function() {
      R29.Storage.setItem('article_ids', this.toString());
    }
    // add items into log, will transparently trim it to 10 items
    for (var i = 0; i < 20; i++) 
      log.push(i);

    // number of items in a trimmed log 
    log.length // 10
    // number of total items
    log.size // 25 = 20 added items + 5 offset

    // Array methods work transparently
    log.map(function(a) {
      return a + 1
    }) // [11, 12, ... 19, 20, 21]



URI
===

A location-compatible URI parser with query parsing capabilities and subdomains

    var uri = new R29.URI('//www.something.google.com?a=b#c')
    uri.scheme // 'http:'
    uri.host // 'www.something.google.com'
    uri.search // 'a=b'
    uri.hash // '#c'


    // custom additions
    uri.subdomain // 'www'
    uri.domain // 'google.com'
    uri.zone // 'com'
    uri.subdomains // 'www.something'
    uri.params.a // 'b';

    //serialize normalized url
    uri.toString() // http://www.something.google.com?a=b#c
    //serialize compact url
    uri.toString(true) //something.google.com?a=b
    //serialize with a parameter filter
    uri.toString(function(key, value) {
      if (key == 'a') //only serialize param named a
        return true;
    })