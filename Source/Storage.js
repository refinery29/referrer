/*
  Storage API is simple, yet effective. It uses reverse `value`, `key` signature
  to be compatible with array iterators and callbacks. 

 * `R29.Storage.get(key) to get value by key
 * `R29.Storage(key, value)` to set a value by key
 * `R29.Storage(key)` to unset a value by key
 * `R29.Storage(array)` to sync array with storage (store values from array 
   and fetch values from cookies, use array values in case of conflicts)
 * `[1,2,3].forEach(R29.Storage)` to store values from native array. 
 * `R29.Storage([])` to populate a native array with values from cookies
 * `new R29.Storage('clients')` create a storage with prefix
 * `new R29.Storage.Cookies` create a storage with specific adapter
*/

R29.Storage = function(key, value, old, meta, prefix, storage, get, self, length) {
  if (length == null) {
    length = arguments.length;
    var initial = true;
  }
  if (this.getAllItems) {
    if (prefix == null) prefix = key;
    if (storage == null) storage = value;
    if (!length) return;
    var constructor = function(k, v, o, m, p) {
      if (this instanceof constructor) {
        return R29.Storage.call(this, undefined, undefined, undefined, undefined,
                                      k != null ? k : prefix, 
                                      v != null ? v : storage, 
                                      o != null ? o : get, 
                                      constructor, arguments.length)
      } else {
        if (this.R29)
          var s = k, k = v, v = s;
        return R29.Storage.call(this, k, v, o, m, prefix, storage, get, constructor, arguments.length)
      }
    }
    return !initial ? constructor : R29.Storage.initialize(constructor, true, key, value);
  }
  if (!storage) 
    if (R29.Storage.Local.prototype.adapter)
      storage = 'Local';
    else if (R29.Storage.Indexed && R29.Storage.Indexed.prototype.database)
      storage = 'Indexed';
    else if (R29.Storage.Cookies)
      storage = 'Cookies';
    else
      storage = 'Session';
  if (typeof storage == 'string') 
    storage = R29.Storage[storage].prototype;
  var prototype = this.prototype;
  var context = (!prototype || !prototype.setItem) && this !== R29 && !this.R29 && this;
  if ((length != null ? length : (length = arguments.length)) > 4 && this !== R29) {
    switch (typeof prefix) {
      case 'function':
        var callback = prefix;
        break;
      case 'object':
        var context = prefix;
    }
    var set = value !== undefined;
  } else {
    for (var i = 0, j = Math.min(4, length), arg; i < j; i++) {
      switch (typeof (arg = arguments[i])) {
        case 'function':
          var callback = arg;
          break;
        case 'object':
          var context = arg;
          break;
        case 'undefined':
          if (i == 1)
            var single = true;
          break;
        case 'string': case 'number':
          if (i == 1) {
            var single = true;
          } else if (i == 0 && !context) 
            var set = false;
          if (context || callback || (i > 1 && set != null)) {
            var prefix = arg;
          } else if (i == 1 && callback !== key)
            var set = true;
      }
    }
  }
  if (meta == 'storage') return;
  meta = 'storage';
  if (prefix == null) if (single && ((callback && callback === key) || (context && context === key))) 
    prefix = value;
  else
    prefix = context && context.push && context.prefix || ''
  if (set != null && !get) {
    if (set) {
      storage.setItem(key, value, prefix, callback || context || this, meta, storage);
    } else {
      storage.removeItem(key, prefix, callback || context || this, meta, storage);
    }
  } else if (!context && (!callback || callback !== key)) {
    var result = storage.getItem(key, prefix, callback || context || this, meta, storage);
    return (result == null) ? undefined : result;
  } else {  
    if (context.push && context._watch) 
      context.watch(undefined, self);
    storage.getAllItems(prefix, callback || context || this, meta, storage);
  }
};
R29.Storage.initialize = function(storage, proto, k, v) {
  if (!storage) storage = this;
  if (proto) storage.prototype = new R29.Storage;
  storage._object = true;
  storage.set = storage;
  storage.get = new storage(k, v, true);
  storage.setItem = storage.set                          
  storage.getItem = storage.get;
  return storage;
};
R29.Storage.prototype.setItem = function(key, value, prefix, callback, meta) {
  if (typeof value != 'string') value = String(value);
  if (callback && callback.push && callback.length <= key)
    this.adapter.setItem(prefix + 'length', key + 1);
  this.adapter.setItem(prefix + key, value);
  if (callback) this.callback(callback, key, value, meta)
};
R29.Storage.prototype.removeItem = function(key, prefix, callback, meta) {
  if (callback && callback.push && callback.length == key - 1)
    this.adapter.setItem(prefix + 'length', key - 1);
  this.adapter.removeItem(prefix + key);
  if (callback) this.callback(callback, key, undefined, meta)
};
R29.Storage.prototype.getItem = function(key, prefix, callback, meta) {
  var value = this.adapter.getItem(prefix + key);
  if (value === null) value = undefined;
  if (callback) this.callback(callback, String(key), value, meta);
  return value;
}
R29.Storage.prototype.getAllItems = function(prefix, callback, meta) {
  var j = this.adapter.getItem(prefix + 'length');
  for (var i = 0; i < j; i++) 
    this.getItem(i, prefix, callback, meta);
};
R29.Storage.prototype.callback = function(callback, key, value, meta) {
  if (callback._watch) {
    callback[typeof value == 'undefined' ? 'unset' : 'set'](key, value, undefined, 'storage');
  } else if (callback.call) 
    callback.call(this, key, value, meta)
  else if (typeof value != 'undefined') 
    callback[key] = value;
  else {
    delete callback[key];
    if (callback.push && callback.length == parseInt(key) + 1)
      callback.length = key;
  }
}
R29.Storage.prototype.prefix = '';
R29.Storage.Local = new R29.Storage(undefined, 'Local');
R29.Storage.Local.prototype.adapter = localStorage;

R29.Storage.Session = new R29.Storage(undefined, 'Session');
R29.Storage.Session.prototype.adapter = sessionStorage;

R29.Storage.initialize();