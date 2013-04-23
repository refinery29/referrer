R29.URI = function(object) {
  if (!(this instanceof R29.URI))
    return new R29.URI(object);
  if (typeof object == 'string')
    return this.parse(object, this)
  else
    for (var property in object)
      this[property] = object[property];
};

R29.URI.prototype = R29.URI;
// normalize parsed result to be Location-compatible
R29.URI.prototype.parse = function(url, parsed) {
  var match = url.match(this._regex)
  if (match) for (var i = 1, j = match.length; i < j; i++) {
    if (!parsed) var parsed = new R29.URI;
    var value = match[i];
    if (value)
      parsed.set(this._parts[i - 1], value);
  }
  return parsed;
};


R29.URI.prototype.set = function(property, value) {
  var prop = this.properties[property];
  if (prop) prop.call(this, value);
  else this[property] = value;
  return this;
}

R29.URI.prototype.clone = function(object) {
  var uri = new R29.URI;
  for (var property in this)
    if (this.hasOwnProperty(property))
      uri[property] = this[property];
  if (object)
    for (var property in object)
      uri.set(property, object[property]);
  return uri;
};

R29.URI.prototype.toString = function(object) {
  var object = object || this;
  var url = '';
  if (object.scheme)
    url += object.scheme + '://';
  if (object.user) {
    url += object.user;
    if (object.password) url += ':' + object.password;
    url += '@';
  }
  if (object.host)
    url += object.host;
  if (object.port)
    url += ':' + object.port;
  if (object.directory != null)
    url += '/' + (object.directory || '');
  if (object.file)
    url += '/' + object.file;
  else if (object.directory)
    url += '/'
  if (object.query != null)
    url += '?' + object.query;
  if (object.fragment != null)
    url += '#' + object.fragment;
  return url;
};

R29.URI.prototype.fromQueryString = function(value, data) {
  if (!data) data = {};
  for (var pair, bits, pairs = value.split('&'), i = 0, j = pairs.length; i < j; i++) {
    pair = pairs[i].split('=');
    var name = pair[0], val = pair[1];
    if (val != null) val = decodeURIComponent(val);
    name = decodeURIComponent(name);
    var keys = name.match(/([^\]\[]+|(\B)(?=\]))/g);
    if (!keys) continue;
    for (var key, bit, path = data, k = 0, l = keys.length; (key = keys[k]) || k < l; k++) {
      if (k == l - 1) 
        key ? (path[key] = val) : path.push(val);
      else 
        path = (path[key] || (path[key] = path[key] = (keys[k + 1] == "") ? [] : {}))
    }
  }
  return data;
};

R29.URI.prototype.toQueryString = function(object, base, index){
  if (typeof object == 'object') {
    if (object == null) return '';
    var queryString = [];
    if (object.push) {
      var complex = false;
      for (var i = 0, j = object.length; i < j; i++) {
        var item = object[i];
        if (item != null) 
          if (typeof item == "object") {
            complex = true;
            break;
          }
      }
      for (var i = 0; i < j; i++) {
        var key = base ? base + '[' + (complex ? i : '') + ']' : i;
        queryString.push(this.toQueryString(object[i], key))
      }
    } else {
      for (var i in object) {
        var key = base ? base + '[' + i + ']' : i;
        queryString.push(this.toQueryString(object[i], key))
      }
    }
    return queryString.join('&');
  } else {
    return base + '=' + encodeURIComponent(object);
  }
}

R29.URI.prototype.properties = {
  query: function(value) {
    if (value != null) {
      if (value.charAt(0) == '?')
        value = value.substring(1);
      this.query = value;
      this.search = '?' + value;
      this.data = this.fromQueryString(value);
    } else if (this.query != null) {
      this.query = this.search = this.data = undefined
    }
  },

  data: function(value) {
    var query = this.toQueryString(value);
    if (query) {
      this.search = '?' + query;
      this.query = query;
      this.data = value
    } else {
      this.data = this.query = this.search = undefined;
    }
  },

  fragment: function(value) {
    if (value != null) {
      if (value.charAt(0) == '#')
        value = value.substring(1);
      this.fragment = value;
      this.hash = '#' + value;
    } else if (this.fragment != null) {
      this.hash = this.fragment = undefined
    }
  },

  host: function(value) {
    this.domains = value.split('.');
    var subdomains = this.domains.slice();
    var labels = this.domains.slice();
    var zones = [];
    for (var label; label = subdomains.pop();) {
      if (this._zones.indexOf(label) > -1) {
        zones.unshift(label);
        labels.pop();
      } else break;
    }
    if (label) {
      this.label = label;
      this.domain = label;
    }
    if (zones.length) {
      this.zones = zones;
      this.zone = zones.join('.');
      this.domain += '.' + this.zone;
    } else if (this.zones) {
      this.zones = this.zone = undefined;
    }
    if (subdomains.length) {
      this.prefix = subdomains[0]
      this.subdomain = subdomains.join('.')
      this.subdomains = subdomains;
    } else if (this.subdomains) {
      this.subdomain = this.subdomains = this.prefix = undefined
    }
    this.labels = labels;
    this.hostname = this.host = value;
  },

  domain: function(value) {
    if (this.subdomains)
      value = this.subdomains.join('.') + '.' + value;
    this.properties.host.call(this, value);
  },

  port: function(value) {
    if (value != null) {
      value = String(value)
      if (value.charAt(0) == ':')
        value = value.substring(1);
      this.port = parseInt(value);
    } else if (this.port != null)
      this.port = undefined;
    this.port = value == null ? undefined : value;
  },

  label: function(value) {
    if (this.subdomain)
      value = this.subdomain + '.' + value;
    if (this.zone)
      value += '.' + this.zone;
    this.properties.host.call(this, value);
  },

  zone: function(value) {
    value = value ? '.' + value : '';
    if (this.label)
      value = this.label + value;
    if (this.subdomain)
      value = this.subdomain + '.' + value;
    this.properties.host.call(this, value);
  },

  zones: function(value) {
    this.properties.zone.call(this, value && value.join('.'));
  },

  subdomain: function(value) {
    if (this.domain) {
      if (value) 
        value += '.' + this.domain;
      else 
        value = this.domain;
    }
    this.properties.host.call(this, value);
  },

  subdomains: function(value) {
    if (this.domain) {
      if (value && value.length) 
        value = value.join('.') + '.' + this.domain;
      else 
        value = this.domain;
    } else {
      value = value && value.join('.') 
    }
    this.properties.host.call(this, value);
  },

  prefix: function(value) {
    var subdomain = value;
    if (this.subdomains && this.subdomains.length > 1) {
      if (value)
        subdomain = value + '.' + this.subdomains.slice(1).join('.')
      else
        subdomain = this.subdomains.slice(1).join('.')
    }
    this.properties.subdomain.call(this, subdomain);
  },

  scheme: function(value) {
    value = value.replace(/:*(?:\/\/)?$/, '');
    this.scheme = value;
    this.protocol = value + ':';
    this.origin = value + '://';
  },

  directory: function(value) {
    if (value != null) {
      if (value.charAt(0) == '/')
        value = value.substring(1)
      if (value.charAt(value.length - 1) == '/')
        value = value.substring(0, value.length - 1)
      this.directory = value;
      if (this.file) {
        if (value) {
          value += '/' + this.file
        } else {
          value = this.file
          this.directory = undefined
        }
      }
    } else {
      if (this.directory != null)
        this.directory = undefined
      value = this.file;
      if (value == null) return;
    }
    this.path = this.pathname = '/' + value;
  },

  file: function(value) {
    if (value) {
      var index = value.lastIndexOf('.');
      if (index > -1) {
        this.basename = value.substring(0, index);
        this.extension = value.substring(index + 1)
      } else {
        this.basename = value;
        if (this.extension != null)
          this.extension = undefined;
      }
      this.file = value;
    } else if (this.file != null)
      this.basename = this.extension = this.file = undefined;
    if (value == null)
      value = '';
    if (this.directory)
      value = this.directory + '/' + value;
    this.path = this.pathname = '/' + value;
  },

  basename: function(value) {
    if (value) {
      this.basename = value
      if (this.extension)
        value += '.' + this.extension
    } else if (this.basename)
      this.basename = undefined;
    this.properties.file.call(this, value);
  },

  extension: function(value) {
    if (value) {
      this.extension = value;
      if (!this.basename)
        value = undefined
      else
        value = this.basename + '.' + value
    } else {
      if (this.extension) this.extension = undefined;
      value = this.basename
    }
    this.properties.file.call(this, value);
  },

  path: function(value) {
    if (value) {
      if (value.charAt(0) == '/')
        value = value.substring(1)
      var index = value.lastIndexOf('/');
      if (index > -1) {
        var file = value.substring(index + 1);
        this.directory = value.substring(0, index);
      } else if (value) {
        var file = value;
        this.directory = undefined;
      } else {
        var file = undefined;
        this.directory = value;
      }
    } else if (this.directory != null)
      this.directory = undefined;
    this.properties.file.call(this, file);
  }
};

R29.URI.prototype.properties.search = R29.URI.prototype.properties.query;
R29.URI.prototype.properties.hash = R29.URI.prototype.properties.fragment;
R29.URI.prototype.properties.hostname = R29.URI.prototype.properties.host;
R29.URI.prototype.properties.origin = R29.URI.prototype.properties.scheme;
R29.URI.prototype.properties.protocol = R29.URI.prototype.properties.scheme;
R29.URI.prototype.properties.pathname = R29.URI.prototype.properties.path;

R29.URI.prototype._regex = /^(?:(\w+):)?(?:\/\/(?:(?:([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?)?(\.\.?$|(?:[^?#\/]*\/)*)([^?#]*)(?:\?([^#]*))?(?:#(.*))?/;
R29.URI.prototype._parts = ['scheme', 'user', 'password', 'host', 'port', 'directory', 'file', 'query', 'fragment'];
R29.URI.prototype._zones = ['aero', 'asia', 'biz', 'cat', 'com', 'coop', 'info', 'int', 'jobs', 'mobi', 'museum', 'name', 'net', 'org', 'post', 'pro', 'tel', 'travel', 'xxx', 'edu', 'gov', 'mil', 'edu', 'gov', 'mil', 'ac', 'ad', 'ae', 'af', 'ag', 'ai', 'al', 'am', 'an', 'ao', 'aq', 'ar', 'as', 'at', 'au', 'aw', 'ax', 'az', 'ba', 'bb', 'bd', 'be', 'bf', 'bg', 'bh', 'bi', 'bj', 'bm', 'bn', 'bo', 'br', 'bs', 'bt', 'bv', 'bw', 'by', 'bz', 'ca', 'cc', 'cd', 'cf', 'cg', 'ch', 'ci', 'ck', 'cl', 'cm', 'cn', 'co', 'cr', 'cs', 'cu', 'cv', 'cx', 'cy', 'cz', 'dd', 'de', 'dj', 'dk', 'dm', 'do', 'dz', 'ec', 'ee', 'eg', 'eh', 'er', 'es', 'et', 'eu', 'fi', 'fj', 'fk', 'fm', 'fo', 'fr', 'ga', 'gb', 'gd', 'ge', 'gf', 'gg', 'gh', 'gi', 'gl', 'gm', 'gn', 'gp', 'gq', 'gr', 'gs', 'gt', 'gu', 'gw', 'gy', 'hk', 'hm', 'hn', 'hr', 'ht', 'hu', 'id', 'ie', 'il', 'im', 'in', 'io', 'iq', 'ir', 'is', 'it', 'je', 'jm', 'jo', 'jp', 'ke', 'kg', 'kh', 'ki', 'km', 'kn', 'kp', 'kr', 'kw', 'ky', 'kz', 'la', 'lb', 'lc', 'li', 'lk', 'lr', 'ls', 'lt', 'lu', 'lv', 'ly', 'ma', 'mc', 'md', 'me', 'mg', 'mh', 'mk', 'ml', 'mm', 'mn', 'mo', 'mp', 'mq', 'mr', 'ms', 'mt', 'mu', 'mv', 'mw', 'mx', 'my', 'mz', 'na', 'nc', 'ne', 'nf', 'ng', 'ni', 'nl', 'no', 'np', 'nr', 'nu', 'nz', 'om', 'pa', 'pe', 'pf', 'pg', 'ph', 'pk', 'pl', 'pm', 'pn', 'pr', 'ps', 'pt', 'pw', 'py', 'qa', 're', 'ro', 'rs', 'ru', 'rw', 'sa', 'sb', 'sc', 'sd', 'se', 'sg', 'sh', 'si', 'sj', 'sk', 'sl', 'sm', 'sn', 'so', 'sr', 'ss', 'st', 'su', 'sv', 'sx', 'sy', 'sz', 'tc', 'td', 'tf', 'tg', 'th', 'tj', 'tk', 'tl', 'tm', 'tn', 'to', 'tp', 'tr', 'tt', 'tv', 'tw', 'tz', 'ua', 'ug', 'uk', 'us', 'uy', 'uz', 'va', 'vc', 've', 'vg', 'vi', 'vn', 'vu', 'wf', 'ws', 'ye', 'yt', 'yu', 'za', 'zm', 'zw', 'xn--lgbbat1ad8j', 'xn--54b7fta0cc', 'xn--fiqs8s', 'xn--fiqz9s', 'xn--wgbh1c', 'xn--node', 'xn--j6w193g', 'xn--h2brj9c', 'xn--mgbbh1a71e', 'xn--fpcrj9c3d', 'xn--gecrj9c', 'xn--s9brj9c', 'xn--xkc2dl3a5ee0h', 'xn--45brj9c', 'xn--mgba3a4f16a', 'xn--mgbayh7gpa', 'xn--80ao21a', 'xn--mgbx4cd0ab', 'xn--l1acc', 'xn--mgbc0a9azcg', 'xn--mgb9awbf', 'xn--mgbai9azgqp6j', 'xn--ygbi2ammx', 'xn--wgbl6a', 'xn--p1ai', 'xn--mgberp4a5d4ar', 'xn--90a3ac', 'xn--yfro4i67o', 'xn--clchc0ea0b2g2a9gcd', 'xn--3e0b707e', 'xn--fzc2c9e2c', 'xn--xkc2al3hye2a', 'xn--mgbpl2fh', 'xn--mgbtf8fl', 'xn--kprw13d', 'xn--kpry57d', 'xn--o3cw4h', 'xn--pgbs0dh', 'xn--j1amh', 'xn--mgbaam7a8h', 'xn--mgb2ddes']