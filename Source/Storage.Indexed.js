

R29.Storage.Indexed = new R29.Storage(undefined, 'Indexed');
R29.Storage.Indexed.prototype.database = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB;
R29.Storage.Indexed.prototype.transaction = window.IndexedTransaction || window.mozDBTransaction  || window.webkitIndexedTransaction;
R29.Storage.Indexed.prototype.databases = {};
if (navigator.userAgent.indexOf('Chrome') > -1) {
  R29.Storage.Indexed.prototype.keyPath = 'key';
  R29.Storage.Indexed.prototype.valuePath = 'value';
}
R29.Storage.Indexed.prototype.open = function() {
  for (var i = 0, j = arguments.length, arg; i < j; i++) {
    switch (typeof (arg = arguments[i])) {
      case 'string':
        var name = arg;
        break;
      case 'number':
        var version = arg;
        break;
      case 'function':
        var callback = arg;
    }
  }
  var db = this.databases[name];
  if (db) {
    if (callback) callback.call(this, db)
    return db;
  }
  var self = this;
  var onUpgrade = function(event) {
    var db = event.target.source || event.target.result
    var found, names = db.objectStoreNames;
    for (var i = 0, id; (id = names[i++]) != null;)
      if (id == name) break;
    if (!id) db.createObjectStore(name, {
      keyPath: self.keyPath,
      autoIncrement: false
    }, true)
    return db;
  };
  if (!version) version = 3;
  var request = this.database.open(name, version, onUpgrade)
  request.onerror = request.onsuccess = request.onblocked = function(event) {
    var db = event.target.result
    if (db.version != version) {
      var request = db.setVersion(version);;
      request.onsuccess = function(e) {
        db = onUpgrade(e);
        setTimeout(function() {
          callback.call(self, self.databases[name] = db)
        }, 0)
      }
      return request;
    } else {
      return callback.call(self, self.databases[name] = db)
    }
  }
  request.onupgradeneeded = onUpgrade;
  return request;
}
R29.Storage.Indexed.prototype.openCursor = function() {
  var self = this;
  for (var i = 0, j = arguments.length, arg; i < j; i++) {
    switch (typeof (arg = arguments[i])) {
      case 'string':
        if (!prefix) var prefix = arg;
        break;
      case 'boolean': case 'number':
        if (arg) var mode = 'readwrite';
        break;
      case 'function':
        var callback = arg;
    }
  }
  return this.openStore(prefix, mode, function(store) {
    var cursor = store.openCursor();
    cursor.onsuccess = cursor.onerror = function(event) {
      callback.call(self, cursor.result, event);
    };
    return cursor;
  })
};
R29.Storage.Indexed.prototype.openStore = function() {
  var name = this.prefix, mode, callback;
  for (var i = 0, j = arguments.length, arg; i < j; i++) {
    switch (typeof (arg = arguments[i])) {
      case 'string':
        if (!name) name = arg;
        else mode = arg;
        break;
      case 'boolean': case 'number':
        if (arg) mode = 'readwrite';
        break;
      case 'function':
        callback = arg;
    }
  }
  return this.open(name, function(database) {
    var store = database.transaction([name], mode || 'readonly').objectStore(name);
    if (callback) callback.call(this, store);
    return store;
  })
};
R29.Storage.Indexed.prototype.close = function(name) {
  if (this.database) this.database.close();
};
R29.Storage.Indexed.prototype.setItem = function(key, value, prefix, callback, meta) {
  return this.openStore(prefix, true, function(store) {
    if (this.keyPath) {
      if (typeof value != 'object') {
        var obj = {};
        obj[this.keyPath] = key;
        obj[this.valuePath] = value;
      }
      var request = store.put(obj || value)
    } else {
      var request = store.put(value, key)
    }
    var self = this;
    request.onsuccess = request.onerror = function(event) {
      if (event.type == 'error') return;
      self.callback(callback, key, value, meta || event)
    }
    return request;
  });
};
R29.Storage.Indexed.prototype.removeItem = function(key, prefix, callback, meta) {
  return this.openStore(prefix, true, function(store) {
    var request = store['delete'](key), self = this;
    request.onsuccess = request.onerror = function(event) {
      if (event.type == 'error') return;
      self.callback(callback, key, undefined, meta || event)
    }
    return request;
  });
};
R29.Storage.Indexed.prototype.getItem = function(key, prefix, callback, meta) {
  return this.openStore(prefix, false, function(store) {
    var request = store.get(key), self = this;
    request.onsuccess = request.onerror = function(event) {
      if (event.type == 'error') return;
      var result = event.target.result;
      if (self.valuePath && result) result = result[self.valuePath];
      self.callback(callback, key, result, meta || event)
    }
    return request;
  });
};
R29.Storage.Indexed.prototype.getAllItems = function(prefix, callback, meta) {
  return this.openCursor(prefix, function(cursor, event) {
    if (!cursor) return;
    else var value = cursor.value;
    if (this.valuePath && value) value = value[this.valuePath];
    this.callback(callback, cursor.key, value, meta || event);
    return cursor['continue']();
  });
};