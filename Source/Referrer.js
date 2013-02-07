var Referrer = function(object) {
	if (object == null) return;
	if (object.location) {
		if (object.nodeType)
			this.writable = object;
		var location = this.handleString(object.location, true);
		this.stack = location ? [location] : [];
		if (this.writable)
			this.stack.push.apply(this.stack, this.fromString(this.read(null, object)))
	}
	return this.push(object);
};

Referrer.prototype.push = function() {
	var referrer = this;
	for (var i = 0, j = arguments.length; i < j; i++) {
		var object = arguments[i];
		var handled = referrer.handleObject(object);
		if (handled && referrer.indexOf(handled) == -1)
			referrer = referrer.concat(handled);
	}
	this.stack = referrer.stack;
	if (this.writable) this.write();
	return this;
};

Referrer.prototype.concat = function() {
	if (this.stack == null)
		this.stack = [];
	var referrer = new Referrer;
	referrer.writable = this.writable;
	referrer.stack = this.stack ? this.stack.slice() : [];
	referrer.stack.push.apply(referrer.stack, arguments);
	return referrer;
};

Referrer.prototype.write = function(key, value) {
	if (key == null)
		key = this._key;
	if (typeof value == 'undefined')
		value = this.toString();
	if (window.localStorage) {
		window.localStorage.setItem(this._key, value);
	} else {
		document.cookie = key + '=' + value;
	}
};

Referrer.prototype.read = function(key) {
	if (key == null)
		key = this._key;
	if (window.localStorage) {
		return window.localStorage.getItem(this._key) || '';
	} else {
		for (var p, i, l = key.length; p != -1;) {
			i = document.cookie.indexOf('; ', p)
			var bit = document.cookie.substr(p || 0, i == -1 ? undefined : i)
			if (bit.substring(0, l) == key)
				return bit.substring(l + 1);
			p = i;
		}
	}
};

Referrer.prototype.handleObject = function(object, location) {
	if (typeof object != 'string')
		object = String(object.referrer || '');
	if (object)
		return this.handleString(object, location);
}

Referrer.prototype.handleString = function(object, location) {
	if (object.indexOf('//') == -1)
		object = '//' + object
	return this.normalize(this.parse(String(object)), location);
};

Referrer.prototype.fromString = function(object) {
	return object.split('|')
};

Referrer.prototype.toString = function(object) {
	if (object == null) 
		object = this.stack;
	if (!object)
		return '';
	if (object.map)
		return object.map(this.toString).join('|');
	var result = object.host || '';
	if (object.directory || object.file)
		result += (object.directory || '/') + (object.file || '');
	if (object.query)
		result += '?' + object.query
	return result;
};

Referrer.prototype.indexOf = function(object, lastIndex, location) {
	var stack = this.stack;
	var handled = typeof object == 'string' ? this.handleObject(object, location) : object;
	if (stack) for (var i = 0, j = stack.length; i < j; i++) {
		if (this.equal(stack[i], handled))
			return i;
	}
	return -1;
};

Referrer.prototype.normalize = function(object, location) {
	var normalized = {};
	if (object.host) {
		var domains = object.host.split('.');
		var subdomains = domains.slice();
		var zones = [];
		for (var domain; domain = subdomains.pop();) {
			if (this._zones.indexOf(domain) > -1)
				zones.unshift(domain);
			else break;
		}
		var subdomain = subdomains.pop();
		var params = this._sites[domain];
		normalized.host
			= (subdomain && subdomain != 'www' ? subdomain + '.' : '')
			+ domain
			+ (!params && zones.length ? '.' + zones.join('.') : '');
	}
	if (params) {
		if (location === false) {
			if (object.directory) 
				normalized.directory = this.encode(object.directory);
			if (object.file)
				normalized.file = this.encode(object.file);
		} else {
			params: for (var i = 0, j = params.length; i < j; i++) {
				var value = params[i];
				switch (typeof value) {
					case 'number':
						var path = (object.directory || '/') + (object.file || '');
						var bits = path.split('/');
						bits.shift();
						for (var k = 0; k < value; k++)
							if (bits[k])
								normalized.directory = (normalized.directory || '') + '/' + this.encode(bits[k]);
						if (bits[k + 1])
							normalized.file = this.encode(bits[k + 1]);
						break;
					case 'object':
						if (value.push && (object.directory || object.file)) {
							var path = (object.directory ? object.directory.substring(1) : '') + (object.file || '');
							for (var k = 0, l = value.length; k < l; k++) {
								var p = value[k];
								if (path.substring(0, p.length) == p 
								&& (path.length == p.length
								|| path.charAt(p.length) == '/'))
									break params;
							}
						}
				}
			}
			if (!normalized.directory && !normalized.file && !object.file && (!object.directory || object.directory == '/'))
				normalized.directory = '/';
		}
	}
	if (object.query) {
		var bits = object.query.split('&');
		var query = '';
		for (var i = 0, j = bits.length; i < j; i++) {
			var bit = bits[i];
			var parts = bit.split('=');
			var key = parts[0]
			var value = parts[1];
			if (location) {
				if (key == 'referrer')
					return this.handleString(value);
				if (key.substring(0, 4) == 'utm_') {
					var subkey = key.substring(4);
					if (subkey == 'source')
						normalized.host = value;
					else
						query += (query.length ? '&' : '') + key + '=' + this.encode(value);
				}
			} else {
				if (params && params.indexOf(key) > -1)
					query += (query.length ? '&' : '') + this.encode(key) + '=' + this.encode(value);
			}
		}
		if (query.length)
			normalized.query = query;
	}
	for (var i in normalized)
		return normalized;
}

Referrer.prototype.encode = function(string) {
	if (/\%[0-9A-F][0-9A-F]/.test(string)) return string;
	return encodeURI(string);
};

Referrer.prototype.parse = function(url) {
  var match = url.match(this._regex)
  if (match) for (var i = 1, j = match.length; i < j; i++) {
    if (!parsed) var parsed = {};
    if (match[i]) parsed[this._parts[i - 1]] = match[i];
  }
  return parsed;
};

Referrer.prototype.was = function(object) {
	return this.indexOf(object, undefined, false) > -1
};

Referrer.prototype.equal = function(object, needle) {
	if (needle.host) {
		if (!object.host || object.host.substring(object.host.length - needle.host.length) != needle.host)
			return false;
	}
	if (needle.query) {
		var parsed = {};
		if (!object.query) return false;
		var bits = object.query.split('&');
		for (var i = 0, j = bits.length; i < j; i++) {
			var parts = bits[i].split('=');
			parsed[parts[0]] = parts[1];
		}
		var bits = needle.query.split('&');
		for (var i = 0, j = bits.length; i < j; i++) {
			var parts = bits[i].split('=');
			if (parsed[parts[0]] != parts[1])
				return false;
		}
	}
	var p = (needle.directory || '/') + (needle.file || '');
	var path = (object.directory || '/') + (object.file || '');
	if (needle.directory || needle.file)
		if (p == '/' && needle.directory
			? path && path != '/'
			: (path.substring(0, p.length) != p)
				|| (p.length != path.length && path.charAt(p.length) != '/'))
		return false;
	return true;
}

Referrer.prototype._key = 'referrer';

Referrer.prototype._regex = /^(?:(\w+):)?(?:\/\/(?:(?:([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?)?(\.\.?$|(?:[^?#\/]*\/)*)([^?#]*)(?:\?([^#]*))?(?:#(.*))?/;
Referrer.prototype._parts = ['scheme', 'user', 'password', 'host', 'port', 'directory', 'file', 'query', 'fragment'];

Referrer.prototype._sites = {
	'google': ['q'],
	'bing': ['q'],
	'yahoo': ['p'],	
	'facebook': [1],					
	'twitter': [1], 					
	'reddit': [2], 						
	'pinterest': [['pin'], 1],
	'stubleupon': [1]					
};

Referrer.prototype._zones = ['aero', 'asia', 'biz', 'cat', 'com', 'coop', 'info', 'int', 'jobs', 'mobi', 'museum', 'name', 'net', 'org', 'post', 'pro', 'tel', 'travel', 'xxx', 'edu', 'gov', 'mil', 'edu', 'gov', 'mil', 'ac', 'ad', 'ae', 'af', 'ag', 'ai', 'al', 'am', 'an', 'ao', 'aq', 'ar', 'as', 'at', 'au', 'aw', 'ax', 'az', 'ba', 'bb', 'bd', 'be', 'bf', 'bg', 'bh', 'bi', 'bj', 'bm', 'bn', 'bo', 'br', 'bs', 'bt', 'bv', 'bw', 'by', 'bz', 'ca', 'cc', 'cd', 'cf', 'cg', 'ch', 'ci', 'ck', 'cl', 'cm', 'cn', 'co', 'cr', 'cs', 'cu', 'cv', 'cx', 'cy', 'cz', 'dd', 'de', 'dj', 'dk', 'dm', 'do', 'dz', 'ec', 'ee', 'eg', 'eh', 'er', 'es', 'et', 'eu', 'fi', 'fj', 'fk', 'fm', 'fo', 'fr', 'ga', 'gb', 'gd', 'ge', 'gf', 'gg', 'gh', 'gi', 'gl', 'gm', 'gn', 'gp', 'gq', 'gr', 'gs', 'gt', 'gu', 'gw', 'gy', 'hk', 'hm', 'hn', 'hr', 'ht', 'hu', 'id', 'ie', 'il', 'im', 'in', 'io', 'iq', 'ir', 'is', 'it', 'je', 'jm', 'jo', 'jp', 'ke', 'kg', 'kh', 'ki', 'km', 'kn', 'kp', 'kr', 'kw', 'ky', 'kz', 'la', 'lb', 'lc', 'li', 'lk', 'lr', 'ls', 'lt', 'lu', 'lv', 'ly', 'ma', 'mc', 'md', 'me', 'mg', 'mh', 'mk', 'ml', 'mm', 'mn', 'mo', 'mp', 'mq', 'mr', 'ms', 'mt', 'mu', 'mv', 'mw', 'mx', 'my', 'mz', 'na', 'nc', 'ne', 'nf', 'ng', 'ni', 'nl', 'no', 'np', 'nr', 'nu', 'nz', 'om', 'pa', 'pe', 'pf', 'pg', 'ph', 'pk', 'pl', 'pm', 'pn', 'pr', 'ps', 'pt', 'pw', 'py', 'qa', 're', 'ro', 'rs', 'ru', 'rw', 'sa', 'sb', 'sc', 'sd', 'se', 'sg', 'sh', 'si', 'sj', 'sk', 'sl', 'sm', 'sn', 'so', 'sr', 'ss', 'st', 'su', 'sv', 'sx', 'sy', 'sz', 'tc', 'td', 'tf', 'tg', 'th', 'tj', 'tk', 'tl', 'tm', 'tn', 'to', 'tp', 'tr', 'tt', 'tv', 'tw', 'tz', 'ua', 'ug', 'uk', 'us', 'uy', 'uz', 'va', 'vc', 've', 'vg', 'vi', 'vn', 'vu', 'wf', 'ws', 'ye', 'yt', 'yu', 'za', 'zm', 'zw', 'xn--lgbbat1ad8j', 'xn--54b7fta0cc', 'xn--fiqs8s', 'xn--fiqz9s', 'xn--wgbh1c', 'xn--node', 'xn--j6w193g', 'xn--h2brj9c', 'xn--mgbbh1a71e', 'xn--fpcrj9c3d', 'xn--gecrj9c', 'xn--s9brj9c', 'xn--xkc2dl3a5ee0h', 'xn--45brj9c', 'xn--mgba3a4f16a', 'xn--mgbayh7gpa', 'xn--80ao21a', 'xn--mgbx4cd0ab', 'xn--l1acc', 'xn--mgbc0a9azcg', 'xn--mgb9awbf', 'xn--mgbai9azgqp6j', 'xn--ygbi2ammx', 'xn--wgbl6a', 'xn--p1ai', 'xn--mgberp4a5d4ar', 'xn--90a3ac', 'xn--yfro4i67o', 'xn--clchc0ea0b2g2a9gcd', 'xn--3e0b707e', 'xn--fzc2c9e2c', 'xn--xkc2al3hye2a', 'xn--mgbpl2fh', 'xn--mgbtf8fl', 'xn--kprw13d', 'xn--kpry57d', 'xn--o3cw4h', 'xn--pgbs0dh', 'xn--j1amh', 'xn--mgbaam7a8h', 'xn--mgb2ddes']