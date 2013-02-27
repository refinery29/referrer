R29.Log = function(prefix, limit, unique, adapter, separator) {
  if (typeof prefix == 'object') {
    for (var property in prefix)
      this[property] = prefix[property];
  } else {
    if (prefix)
      this.prefix = prefix;
    if (adapter)
      this.adapter = adapter;
    if (separator)
      this.separator = separator;
  }
  if (this.string) this.fromString(this.string);
  // this.storage = new R29.Storage(this.prefix, this.adapter);
};
R29.Log.prototype.length = 0;
R29.Log.prototype.size = 0;
R29.Log.prototype.separator = ', ';
R29.Log.prototype.string = '';
R29.Log.prototype.constructor = R29.Log;

R29.Log.prototype.clone = function() {
  var clone = new this.constructor;
  for (var property in this) {
    if (this.hasOwnProperty(property)) {
      var value = this[property];
      clone[property] = value && value.push && value.slice() || value;
    }
  }
  return clone;
}

R29.Log.prototype.concat = function() {
  var instance = this.clone();
  instance.push.apply(instance, arguments);
  return instance;
};


R29.Log.prototype.toString = function(object) {
  return this.join(this.joiner || this.separator)
};

R29.Log.prototype.fromString = function(object) {
  if (object)
    return this.push.apply(this, String(object).split(this.splitter || this.separator));
};

R29.Log.prototype.push = function() {
  for (var i = 0, j = arguments.length; i < j; i++) {
    var object = arguments[i];
    if (this.onCast)
      object = this.onCast(object);
    if (object != null && (!this.unique || this.indexOf(object) == -1)) {
      if (this.length === this.limit) {
        for (var k = 0, l = this.length - 1; k < l; k++)
          this[k] = this[k + 1];
      } else this.length++;
      this[this.length - 1] = object;
      this.size++;
      if (this.onPush)
        this.onPush(object, this.length - 1);
    }
  }
  if (this.onChange)
    this.onChange.apply(this, arguments)
  if (this.writable) this.write();
  return this.length;
};

R29.Log.prototype.indexOf = function(object, lastIndex, location) {
  var cast = this.onCast ? this.onCast(object, location) : object;
  if (this.length) for (var i = 0, j = this.length; i < j; i++) {
    if (this.equal ? this.equal(this[i], cast) : this[i] === cast)
      return i;
  }
  return -1;
};

!function(proto) {
  var methods = ['map', 'filter', 'slice', 'join'];
  for (var i = 0, j = methods.length; i < j; i++) {
    var method = methods[i];
    if (proto[method])
      R29.Log.prototype[method] = proto[method];
  }
}(Array.prototype)