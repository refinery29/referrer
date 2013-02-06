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
				referrer: 'http://subdomain.google.com/path?q=hey%20bro&key=value&param#fragment'
			})
			expect(referrer.toString()).toBe('subdomain.google?q=hey%20bro');
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

	describe('and utm_medium=editorial param is given', function() {
		it ('should log email hit', function() {
			var referrer = new Referrer({
				location: '?utm_medium=editorial'
			});
			expect(referrer.toString()).toBe('email')
			expect(referrer.was('email')).toBe(true);
		})

		describe('and utm_campaign param is given', function() {
			it ('should log campaign', function() {
				var referrer = new Referrer({
					location: '?utm_medium=editorial&utm_campaign=campaign'
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
				location: '?utm_medium=editorial'
			}).push('http://facebook.co.uk/something')
			.push('http://sales.co.uk')
			.push('http://sales.co.uk')
			.push('http://sales.su')
			.push('http://google.co.uk?q=something&c=1')
			expect(referrer.toString()).toBe('email|facebook|sales.co.uk|sales.su|google?q=something');
			expect(referrer.was('email')).toBe(true);
			expect(referrer.was('facebook')).toBe(true);
			expect(referrer.was('sales.co.uk')).toBe(true);
			expect(referrer.was('sales.com')).toBe(false);
			expect(referrer.was('google')).toBe(true);
			expect(referrer.was('google?q=something')).toBe(true);
			expect(referrer.was('google?q=other')).toBe(false);
			expect(referrer.was('bing')).toBe(false)
		})
	})
})