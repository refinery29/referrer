R29.Log = function(options) {
  if (typeof options == 'object') {
    for (var property in options)
      this[property] = options[property];
  }
  if (this.storage && this.key)
    this.fromString(this.storage.getItem(this.key));
  if (this.string) this.fromString(this.string);
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


R29.Log.prototype.toString = function() {
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
  if (this.storage && this.key)
    this.storage.setItem(this.key, this.toString());
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

R29.Log.prototype.contains = function(object) {
  return this.indexOf(object, undefined, false) > -1
};

R29.Log.prototype.reset = function() {
  for (var i = 0; i < this.length; i++)
    delete this[i];
  this.length = 0;
  if (this.onChange)
    this.onChange();
};

!function(proto) {
  var methods = ['map', 'filter', 'slice', 'join'];
  for (var i = 0, j = methods.length; i < j; i++) {
    var method = methods[i];
    if (proto[method])
      R29.Log.prototype[method] = proto[method];
  }
}(Array.prototype)