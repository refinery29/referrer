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
    if (!parsed) var parsed = {};
    var value = match[i];
    if (value) {
      var part = this._parts[i - 1];
      switch (part) {
        case 'query':
          parsed.search = value;
          break;
        case 'fragment':
          parsed.hash = '#' + value;
          break;
        case 'host':
          parsed.domains = value.split('.');
          var subdomains = parsed.domains.slice();
          var zones = [];
          for (var label; label = subdomains.pop();) {
            if (this._zones.indexOf(label) > -1)
              zones.unshift(label);
            else break;
          }
          if (label) {
            parsed.label = label;
            parsed.domain = label;
            if (zones.length) {
              parsed.zones = zones;
              parsed.zone = zones.join('.');
              parsed.domain += '.' + parsed.zone;
            }
          }
          if (subdomains.length) {
            parsed.subdomain = subdomains[0]
            parsed.subdomains = subdomains;
          }
          parsed.hostname = value;
          break;
        case 'protocol':
          parsed.scheme = value + ':';
          break;
        case 'directory':
          parsed.path = parsed.pathname = value;
          break;
        case 'file':
          parsed.path = (parsed.pathname || '') + value;
      }
      parsed[part] = value;
    }
  }
  return parsed;
};

R29.URI.prototype.toString = function(object) {
  var object = object || this;
  var url = '';
  if (object.scheme) url += object.scheme + '://';
  if (object.user) {
    url += object.user;
    if (object.password) url += ':' + object.password;
    url += '@';
  }
  if (object.host) url += object.host;
  if (object.port) url += ':' + object.port;
  if (object.directory != null) url += (object.directory || '/');
  if (object.file) url += object.file;
  if (object.query) url += '?' + object.query;
  if (object.fragment) url += '#' + object.fragment;
  return url;
};
R29.URI.prototype._regex = /^(?:(\w+):)?(?:\/\/(?:(?:([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?)?(\.\.?$|(?:[^?#\/]*\/)*)([^?#]*)(?:\?([^#]*))?(?:#(.*))?/;
R29.URI.prototype._parts = ['protocol', 'user', 'password', 'host', 'port', 'directory', 'file', 'query', 'fragment'];
R29.URI.prototype._zones = ['aero', 'asia', 'biz', 'cat', 'com', 'coop', 'info', 'int', 'jobs', 'mobi', 'museum', 'name', 'net', 'org', 'post', 'pro', 'tel', 'travel', 'xxx', 'edu', 'gov', 'mil', 'edu', 'gov', 'mil', 'ac', 'ad', 'ae', 'af', 'ag', 'ai', 'al', 'am', 'an', 'ao', 'aq', 'ar', 'as', 'at', 'au', 'aw', 'ax', 'az', 'ba', 'bb', 'bd', 'be', 'bf', 'bg', 'bh', 'bi', 'bj', 'bm', 'bn', 'bo', 'br', 'bs', 'bt', 'bv', 'bw', 'by', 'bz', 'ca', 'cc', 'cd', 'cf', 'cg', 'ch', 'ci', 'ck', 'cl', 'cm', 'cn', 'co', 'cr', 'cs', 'cu', 'cv', 'cx', 'cy', 'cz', 'dd', 'de', 'dj', 'dk', 'dm', 'do', 'dz', 'ec', 'ee', 'eg', 'eh', 'er', 'es', 'et', 'eu', 'fi', 'fj', 'fk', 'fm', 'fo', 'fr', 'ga', 'gb', 'gd', 'ge', 'gf', 'gg', 'gh', 'gi', 'gl', 'gm', 'gn', 'gp', 'gq', 'gr', 'gs', 'gt', 'gu', 'gw', 'gy', 'hk', 'hm', 'hn', 'hr', 'ht', 'hu', 'id', 'ie', 'il', 'im', 'in', 'io', 'iq', 'ir', 'is', 'it', 'je', 'jm', 'jo', 'jp', 'ke', 'kg', 'kh', 'ki', 'km', 'kn', 'kp', 'kr', 'kw', 'ky', 'kz', 'la', 'lb', 'lc', 'li', 'lk', 'lr', 'ls', 'lt', 'lu', 'lv', 'ly', 'ma', 'mc', 'md', 'me', 'mg', 'mh', 'mk', 'ml', 'mm', 'mn', 'mo', 'mp', 'mq', 'mr', 'ms', 'mt', 'mu', 'mv', 'mw', 'mx', 'my', 'mz', 'na', 'nc', 'ne', 'nf', 'ng', 'ni', 'nl', 'no', 'np', 'nr', 'nu', 'nz', 'om', 'pa', 'pe', 'pf', 'pg', 'ph', 'pk', 'pl', 'pm', 'pn', 'pr', 'ps', 'pt', 'pw', 'py', 'qa', 're', 'ro', 'rs', 'ru', 'rw', 'sa', 'sb', 'sc', 'sd', 'se', 'sg', 'sh', 'si', 'sj', 'sk', 'sl', 'sm', 'sn', 'so', 'sr', 'ss', 'st', 'su', 'sv', 'sx', 'sy', 'sz', 'tc', 'td', 'tf', 'tg', 'th', 'tj', 'tk', 'tl', 'tm', 'tn', 'to', 'tp', 'tr', 'tt', 'tv', 'tw', 'tz', 'ua', 'ug', 'uk', 'us', 'uy', 'uz', 'va', 'vc', 've', 'vg', 'vi', 'vn', 'vu', 'wf', 'ws', 'ye', 'yt', 'yu', 'za', 'zm', 'zw', 'xn--lgbbat1ad8j', 'xn--54b7fta0cc', 'xn--fiqs8s', 'xn--fiqz9s', 'xn--wgbh1c', 'xn--node', 'xn--j6w193g', 'xn--h2brj9c', 'xn--mgbbh1a71e', 'xn--fpcrj9c3d', 'xn--gecrj9c', 'xn--s9brj9c', 'xn--xkc2dl3a5ee0h', 'xn--45brj9c', 'xn--mgba3a4f16a', 'xn--mgbayh7gpa', 'xn--80ao21a', 'xn--mgbx4cd0ab', 'xn--l1acc', 'xn--mgbc0a9azcg', 'xn--mgb9awbf', 'xn--mgbai9azgqp6j', 'xn--ygbi2ammx', 'xn--wgbl6a', 'xn--p1ai', 'xn--mgberp4a5d4ar', 'xn--90a3ac', 'xn--yfro4i67o', 'xn--clchc0ea0b2g2a9gcd', 'xn--3e0b707e', 'xn--fzc2c9e2c', 'xn--xkc2al3hye2a', 'xn--mgbpl2fh', 'xn--mgbtf8fl', 'xn--kprw13d', 'xn--kpry57d', 'xn--o3cw4h', 'xn--pgbs0dh', 'xn--j1amh', 'xn--mgbaam7a8h', 'xn--mgb2ddes']