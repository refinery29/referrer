if (typeof describe == 'undefined') {
	var stack = [];
	var current;
	var matchers = {
		toBe: function(value) {
			console[current === value ? 'log' : 'error'](stack.join(' '), '(Expected identity)', [current, value]);
		},
		toEqual: function(a, b) {
			console[current == value ? 'log' : 'error'](stack.join(' '), '(Expected equality)', [current, value]);
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

describe('when user comes to the site by typing the address in', function() {
	it ('should know that it is a direct hit', function() {
		var referrer = new Referrer({})
		expect(referrer.toString()).toBe('');
	})
});

describe('when user comes by a link from other site', function() {
	describe('and that site is a regular web site', function() {
		it ('should log referrer', function() {
			var referrer = new Referrer({
				referrer: 'http://sub.subdomain.domain.com/path?key=value&param#fragment'
			})
			expect(referrer.toString()).toBe('subdomain.domain.com');
		})
	});

	describe('and that site is a known site', function() {
		it ('should log referrer omitting domain zone and log known params', function() {
			var referrer = new Referrer({
				referrer: 'http://subdomain.google.com/path?q=hey bro&key=value&param#fragment'
			})
			expect(referrer.toString()).toBe('subdomain.google?q=hey%20bro');
			expect(referrer.was('google?q=hey bro')).toBe(true)
			expect(referrer.was('google?q=hey%20bro')).toBe(true)
		})
	});
});


describe('when user comes from email', function() {
	describe('and referrer parameter is set', function() {
		it ('should log the fact', function() {
			var referrer = new Referrer({
				location: '?referrer=email'
			});
			expect(referrer.toString()).toBe('email')
			expect(referrer.was('email')).toBe(true);
		})
	})

	describe('and utm_source=email param is given', function() {
		it ('should log email hit', function() {
			var referrer = new Referrer({
				location: '?utm_source=email'
			});
			expect(referrer.toString()).toBe('email')
			expect(referrer.was('email')).toBe(true);
		})

		describe('and utm_campaign param is given', function() {
			it ('should log campaign', function() {
				var referrer = new Referrer({
					location: '?utm_source=email&utm_campaign=campaign'
				});
				expect(referrer.toString()).toBe('email?utm_campaign=campaign')
				expect(referrer.was('email')).toBe(true);
			})
		})
	})
	describe('and utm_campaign param is given', function() {
		it ('should log campaign', function() {
			var referrer = new Referrer({
				location: '?utm_campaign=campaign'
			});
			expect(referrer.toString()).toBe('?utm_campaign=campaign')
			expect(referrer.was('email')).toBe(false);
		})
	})

	describe('multiple sources', function() {
		it ('should concatenate string', function() {
			var referrer = new Referrer({
				location: '?utm_source=telepathy'
			})
			.push('http://google.com?q=носки') // encodes query 
			.push('https://google.co.fr?q=a%26b%3Fc%3Dd') // separator symbold is encoded
			.push('http://facebook.co.uk/something/123123123123') // shortened
			.push('https://facebook.fr/а б в/') // dir name is encoded
			.push('http://sales.co.uk')
			.push('http://sales.co.uk/') //duplicate
			.push('http://sales.su')
			.push('http://привет.рф') //encodes domain
			.push('http://google.co.uk?q=something&c=1') //only keeps q
			.push('https://reddit.com/') //mainpage hit
			.push('https://pinterest.com/somebody')
			.push('https://pinterest.com/somebody/') //duplicate
			.push('https://pinterest.com/something/')
			.push('https://pinterest.com/pin/55555') //ignored, /pin/ is in ignore list
			.push('https://pinterest.com/pinner/123') //shortened
			.push('https://pinterest.com') //mainpage
			expect(referrer.toString()).toBe('telepathy|google/?q=%D0%BD%D0%BE%D1%81%D0%BA%D0%B8|google/?q=a%26b%3Fc%3Dd|facebook/something|facebook/%D0%B0%20%D0%B1%20%D0%B2|sales.co.uk|sales.su|привет.рф|google/?q=something|reddit/|pinterest/somebody|pinterest/something|pinterest/pinner|pinterest/');
			expect(referrer.was('telepathy')).toBe(true);
			expect(referrer.was('google')).toBe(true);
			expect(referrer.was('google?q=a%26b%3Fc%3Dd')).toBe(true);
			expect(referrer.was('google?q=a&b?c=d')).toBe(false);
			expect(referrer.was('google?q=носки')).toBe(true);
			expect(referrer.was('google?q=н*и')).toBe(true);
			expect(referrer.was('google?q=н*ц')).toBe(false);
			expect(referrer.was('google?q=носки драные')).toBe(false);
			expect(referrer.was('google?q=%D0%BD%D0%BE%D1%81%D0%BA%D0%B8')).toBe(true);
			expect(referrer.was('google?q=носки')).toBe(true);
			expect(referrer.was('google?q=носки драные')).toBe(false);
			expect(referrer.was('facebook')).toBe(true);
			expect(referrer.was('facebook/')).toBe(false);
			expect(referrer.was('facebook/something')).toBe(true);
			expect(referrer.was('facebook/someone')).toBe(false);
			expect(referrer.was('facebook/something/123123123123')).toBe(false);
			expect(referrer.was('facebook/someone/123123123123')).toBe(false);
			expect(referrer.was('sales.co.uk')).toBe(true);
			expect(referrer.was('sales.co.uk/')).toBe(true);
			expect(referrer.was('sales.com')).toBe(false);
			expect(referrer.was('google')).toBe(true);
			expect(referrer.was('google?q=something')).toBe(true);
			expect(referrer.was('google?q=*thing')).toBe(true);
			expect(referrer.was('google?q=*thong')).toBe(false);
			expect(referrer.was('google?q=other')).toBe(false);
			expect(referrer.was('bing')).toBe(false)
			expect(referrer.was('pinterest/somebody')).toBe(true)
			expect(referrer.was('pinterest/someone')).toBe(false)
			expect(referrer.was('pinterest')).toBe(true)
			expect(referrer.was('pinterest/pinner')).toBe(true)
			expect(referrer.was('pinterest/pinner/123')).toBe(false)
			expect(referrer.was('pinterest/pin')).toBe(false)
			expect(referrer.was('pinterest/pin/123')).toBe(false)
		})
	})
})