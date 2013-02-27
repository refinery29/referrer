if (typeof describe == 'undefined') {
	var stack = [];
	var current;
	var attempt = function(condition, value, type) {
		if (condition)
			console.log(stack.join(' '))
		else
			console.error(stack.join(' '), ['Expected', value, 'to ' + type, current])
	}
	var matchers = {
		toBe: function(value) {
			attempt(current === value, value, 'be');
		},
		toEqual: function(a, b) {
			attempt(current == value, value, 'equal');
		}
	}
	describe = it = function(title, callback) {
		stack.push(title);
		callback();
		stack.pop();
	};
	xit = xitdescribe = function() {};
	expect = function(value) {
		current = value;
		return matchers;
	}
}

describe('R29.Referrer', function() {
	

describe('when user comes to the site by typing the address in', function() {
	it ('should know that it is a direct hit', function() {
		var referrers = new R29.Referrers({})
		expect(referrers.toString()).toBe('');
	})
});

describe('when user comes by a link from other site', function() {
	describe('and that site is a regular web site', function() {
		it ('should log R29.Referrers', function() {
			var referrers = new R29.Referrers({
				referrer: 'http://sub.subdomain.domain.com/path?key=value&param#fragment'
			})
			expect(referrers.toString()).toBe('subdomain.domain.com');
		})
	});

	describe('and that site is a known site', function() {
		it ('should log R29.Referrers omitting domain zone and log known params', function() {
			var referrers = new R29.Referrers({
				referrer: 'http://subdomain.google.com/path?q=hey bro&key=value&param#fragment'
			})
			expect(referrers.toString()).toBe('subdomain.google?q=hey%20bro');
			expect(referrers.was('google?q=hey bro')).toBe(true)
			expect(referrers.was('google?q=hey%20bro')).toBe(true)
		})
	});
});


describe('when user comes from email', function() {
	describe('and referrer parameter is set', function() {
		it ('should log the fact', function() {
			var referrers = new R29.Referrers({
				location: '?referrer=email'
			});
			expect(referrers.toString()).toBe('email')
			expect(referrers.was('email')).toBe(true);
		})
	})

	describe('and utm_source=email param is given', function() {
		it ('should log email hit', function() {
			var referrers = new R29.Referrers({
				location: '?utm_source=email'
			});
			expect(referrers.toString()).toBe('email')
			expect(referrers.was('email')).toBe(true);
		})

		describe('and utm_campaign param is given', function() {
			it ('should log campaign', function() {
				var referrers = new R29.Referrers({
					location: '?utm_source=email&utm_campaign=campaign'
				});
				expect(referrers.toString()).toBe('email?utm_campaign=campaign')
				expect(referrers.was('email')).toBe(true);
			})
		})
	})
	describe('and utm_campaign param is given', function() {
		it ('should log campaign', function() {
			referrers = new R29.Referrers({
				location: '?utm_campaign=campaign'
			});
			expect(referrers.toString()).toBe('?utm_campaign=campaign')
			expect(referrers.was('email')).toBe(false);
		})
	})

	describe('multiple sources', function() {
		it ('should concatenate string', function() {
			var referrers = new R29.Referrers({
				location: '?utm_source=telepathy'
			})
			referrers
			.push('http://google.com?q=носки', // encodes query 
			'https://google.co.fr?q=a%26b%3Fc%3Dd', // separator symbold is encoded
			'http://facebook.co.uk/something/123123123123', // shortened
			'https://facebook.fr/а б в/', // dir name is encoded
			'http://sales.co.uk',
			'http://sales.co.uk/', //duplicate
			'http://sales.su',
			'http://привет.рф', //encodes domain
			'http://google.co.uk?q=something&c=1', //only keeps q
			'https://reddit.com/', //mainpage hit
			'https://pinterest.com/somebody',
			'https://pinterest.com/somebody/', //duplicate
			'https://pinterest.com/something/',
			'https://pinterest.com/pin/55555', //ignored, /pin/ is in ignore list
			'https://pinterest.com/pinner/123', //shortened
			'https://pinterest.com') //mainpage
			expect(referrers.toString()).toBe('telepathy|google/?q=%D0%BD%D0%BE%D1%81%D0%BA%D0%B8|google/?q=a%26b%3Fc%3Dd|facebook/something|facebook/%D0%B0%20%D0%B1%20%D0%B2|sales.co.uk|sales.su|привет.рф|google/?q=something|reddit/|pinterest/somebody|pinterest/something|pinterest/pinner|pinterest/');
			expect(referrers.was('telepathy')).toBe(true);
			expect(referrers.was('google')).toBe(true);
			expect(referrers.was('google?q=a%26b%3Fc%3Dd')).toBe(true);
			expect(referrers.was('google?q=a&b?c=d')).toBe(false);
			expect(referrers.was('google?q=носки')).toBe(true);
			expect(referrers.was('google?q=н*и')).toBe(true);
			expect(referrers.was('google?q=н*ц')).toBe(false);
			expect(referrers.was('google?q=носки драные')).toBe(false);
			expect(referrers.was('google?q=%D0%BD%D0%BE%D1%81%D0%BA%D0%B8')).toBe(true);
			expect(referrers.was('google?q=носки')).toBe(true);
			expect(referrers.was('google?q=носки драные')).toBe(false);
			expect(referrers.was('facebook')).toBe(true);
			expect(referrers.was('facebook/')).toBe(false);
			expect(referrers.was('facebook/something')).toBe(true);
			expect(referrers.was('facebook/someone')).toBe(false);
			expect(referrers.was('facebook/something/123123123123')).toBe(false);
			expect(referrers.was('facebook/someone/123123123123')).toBe(false);
			expect(referrers.was('sales.co.uk')).toBe(true);
			expect(referrers.was('sales.co.uk/')).toBe(true);
			expect(referrers.was('sales.com')).toBe(false);
			expect(referrers.was('sales.com/')).toBe(false);
			expect(referrers.was('google')).toBe(true);
			expect(referrers.was('google?q=something')).toBe(true);
			expect(referrers.was('google?q=*thing')).toBe(true);
			expect(referrers.was('google?q=*thong')).toBe(false);
			expect(referrers.was('google?q=*th[oi]ng')).toBe(true);
			expect(referrers.was('google?q=other')).toBe(false);
			expect(referrers.was('bing')).toBe(false)
			expect(referrers.was('pinterest/somebody')).toBe(true)
			expect(referrers.was('pinterest/someone')).toBe(false)
			expect(referrers.was('pinterest')).toBe(true)
			expect(referrers.was('pinterest/')).toBe(true)
			expect(referrers.was('pinterest/pinner')).toBe(true)
			expect(referrers.was('pinterest/pinner/123')).toBe(false)
			expect(referrers.was('pinterest/pin')).toBe(false)
			expect(referrers.was('pinterest/pin/123')).toBe(false)
		})
	})
})
})