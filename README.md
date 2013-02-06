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

// Now you can query referrer
if (referrer.was('email')) {
	alert ('email lol')
}
// query known sites
referrer.was('facebook');
// query domains
referrer.was('gizoogle.com');
// query domains with multiple zones
referrer.was('sales.co.uk');

// track hit explicitly
referrer.push('http://google.com?q=something');
// query referrer
referrer.was('google') //true;
referrer.was('google?q=something') //true;
referrer.was('google?q=otherthing') //false;