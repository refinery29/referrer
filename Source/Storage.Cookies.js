
R29.Storage.Cookies = new R29.Storage(undefined, 'Cookies');
R29.Storage.Cookies.prototype.setItem = function(key, value, prefix, callback, meta) {
  document.cookie = prefix + key + '=' + value + ';expires=' + (new Date(+new Date + 365 * 60 * 60 * 24)).toGMTString();
  if (callback) this.callback(callback, key, value, meta)
};
R29.Storage.Cookies.prototype.removeItem = function(key, prefix, callback, meta) {
  document.cookie = prefix + key + '=;expires=Thu, 01-Jan-1970 00:00:01 GMT';
  if (callback) this.callback(callback, key, undefined, meta)
};
R29.Storage.Cookies.prototype.getItem = function(key, prefix, callback, meta) {
  switch (typeof prefix) {
    case 'undefined': case 'string':
      break;
    default:
      meta = callback, callback = prefix, prefix = key, key = null;
  }
  var skip = prefix.length;
  for (var cookie = document.cookie, p = 0; i = cookie.indexOf(';', p);) {
    if (!skip || cookie.substring(p, p + skip) == prefix) {
      var eql = cookie.indexOf('=', p);
      var index = cookie.substring(p + skip, eql);
      if (key && index != key) continue;
      var val = cookie.substring(eql + 1, i > -1 ? i : undefined);
      if (callback) this.callback(callback, index, val, meta);
      if (key) return val;
    }
    if (i == -1) break;
    else p = i + 2;
  };
};
R29.Storage.Cookies.prototype.getAllItems = R29.Storage.Cookies.prototype.getItem;
