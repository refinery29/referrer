Referrer
===


A simple library to parse and normalize referrers. 

* Supports multiple sources (per user/per session)
* Allows logging sources based on ?utm_ parameters
* Supports all domain zones
* Allows querying referrers (did user come from a link in email subscription? from facebook? from a specific site?)
* Deduplicates sources
* Allows logging additional params for known sites (keywords for search engines, twitter/facebook username)


Example
====

	var referrer = new Referrer(document);
	// checks ?utm_ params on current page, tracks referrer. 
	//Saves into cookies or local storage

	// track hit explicitly
	referrer.push('http://google.com?q=something');

	// Now you can query referrer
	if (referrer.was('email'))
		alert ('email lol')

	// query known sites
	referrer.was('facebook');
	// query domains
	referrer.was('gizoogle.com');
	// query domains with multiple zones
	referrer.was('sales.co.uk');

	// query known referrers with parameter
	referrer.was('google') //true;
	referrer.was('google?q=something') //true;
	referrer.was('google?q=otherthing') //false;

	// query parameters with wildcars
	referrer.was('google?q=some*') 

	// query url encoded parameters
	referrer.was('http://google.com?q=exposé')
	referrer.was('http://google.com?q=expos%C3%A9')

	// query main page
	referrer.was('reddit/')

	// query known websites directories
	// there're per-site settings for max. deepness to keep
	// and also exceptions list to avoid saving specific paths 
	referrer.was('pinterest/somebody')
	referrer.was('reddit/r/something')
