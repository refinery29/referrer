R29.Referrers = function() {
	R29.Log.apply(this, arguments);
};

R29.Referrers.prototype = new R29.Log; 
R29.Referrers.prototype.key = 'referrers';
R29.Referrers.prototype.unique = true;
R29.Referrers.prototype.separator = '|';

R29.Referrers.prototype.onCast = function(object, location) {
	if (!object) return;8
	if (object.location)
		this.push(this.normalize(String(object.location), true));
	if (typeof object != 'string') {
		if (object.referrer)
			object = String(object.referrer);
		else if (object.parse)
			return object;
		else 
			return;
	}
	if (object) {
		if (object.indexOf('//') == -1)
			object = '//' + object
		return this.normalize(String(object), location);
	}
	return object;
}

R29.Referrers.prototype.normalize = function(object, location) {
	if (typeof object == 'string')
		object = R29.URI.parse(object);
	var normalized = new R29.URI;
	if (object.host) {
		var params = this._sites[object.label];
		normalized.host = object.label;
		var subdomains = object.subdomains;
		var subdomain = subdomains && subdomains[subdomains.length - 1];
		if (subdomain && subdomain != 'www')
			normalized.host = subdomain + '.' + normalized.host;
		if (!params && object.zone)
			normalized.host += '.' + object.zone;
	}
	if (params) {
		if (location === false) {
			if (object.directory != null) 
				normalized.directory = this.encode(object.directory);
			if (object.file)
				normalized.file = this.encode(object.file);
		} else {
			var path = (object.directory || '')
			if (object.file) {
				if (path) path += '/'
				path += object.file
			}
			params: for (var i = 0, j = params.length; i < j; i++) {
				var value = params[i];
				switch (typeof value) {
					case 'number':
						var bits = path.split('/');
						for (var k = 0; k < Math.min(bits.length, value); k++)
							if (k + 1 == value)
								normalized.file = this.encode(bits[k]);
							else if (bits[k])
								normalized.directory = (normalized.directory || '') + (k ? '/' : '') + this.encode(bits[k]);
						break;
					case 'object':
						if (value.push && (object.directory || object.file)) {
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
				normalized.directory = '';
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
					return this.onCast(value);
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

R29.Referrers.prototype.encode = function(string) {
	if (/\%[0-9A-F][0-9A-F]/.test(string)) return string;
	return encodeURI(string);
};

R29.Referrers.prototype.equal = function(object, needle) {
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
			var val = parts[1];
			if (val.indexOf('*') > -1) {
				val = decodeURI(val).replace(/\*/g, '.*').replace(/[^\[\]\(\)\*\{\}]+/g, function(value) {
					return encodeURI(value);
				})
				if (!new RegExp(val, 'ig').exec(parsed[parts[0]]))
					return false;
			} else if (parsed[parts[0]] != val)
				return false;
		}
	}
	var p = (needle.directory ? needle.directory : '') + (needle.file || '');
	var path = (object.directory ? object.directory : '') + (object.file || '');
	if (needle.directory != null || needle.file)
		if (p === '' && needle.directory != null
			? path !== '' || object.directory == null
			: path === '' ? p != '/' : (path.substring(0, p.length) != p)
				|| (p.length != path.length && path.charAt(p.length) != '/'))
		return false;
	return true;
}

R29.Referrers.prototype._sites = {
	'google': ['q'],
	'bing': ['q'],
	'yahoo': ['p'],	
	'facebook': [1],					
	'twitter': [1], 					
	'reddit': [2], 						
	'pinterest': [['pin'], 1],
	'stubleupon': [1]					
};
