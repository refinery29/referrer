R29.Script = function(options) {
  if (options)
    this.setOptions(options);
  if (this.onInitialize)
    this.onInitialize();
  if (this.isEager())
    this.load();
};

R29.Script.prototype.groups = {};

R29.Script.prototype.setOptions = function(options) {
  if (options)
    for (var name in options)
      this[name] = options[name];
};

R29.Script.prototype.isEager = function() {
  return this.eager;
};

R29.Script.prototype.isLoaded = function(src) {
  return this.loaded == src;
};

R29.Script.prototype.load = function(src, onComplete, onStart) {
  if (!src)
    src = this.getURL && this.getURL() || this.src || this[location.protocol] || this.http;
  if (this.isLoaded(src)) {
    if (!this.loaded) {
      this.loaded = src;
      if (this.onCache)
        this.onCache();
      if (this.onComplete)
        this.onComplete();
      if (this.onSuccess)
        this.onSuccess()
      if (onComplete)
        onComplete.call(this);
    }
    return;
  }
  if (!src || (this.script && this.script == src)) return;
  var script = document.createElement('script');
  if (!this.script) this.script = script;
  var thus = this;
  var group = this.group;
  if (group)
    var queue = (this.groups[group] || (this.groups[group] = []))
  script.onload = script.onerror = function(event) {
    thus.onFinish(event, queue, onComplete, script)
  }
  script.type= 'text/javascript'
  if (src.nodeType)
    for (var i = 0, attribute; attribute = src.attributes[i++];)
      script.setAttribute(attribute.name, attribute.value);
  else
    script.src = src;  
  if (!queue || queue.push(script) == 1) {
    if (onStart)
      onStart.call(this);
    document.body.appendChild(script)
  } else if (onStart) {
    script.onstart = onStart
  }
  return script;
};

R29.Script.prototype.onFinish = function(event, queue, onComplete, script) {
  if (this.script == script) {
    this.loaded = script.src;
    if (this.onComplete)
      this.onComplete(event);
    if (event.type == 'error') {
      if (this.onError)
        this.onError(event)
    } else {
      if (this.onSuccess)
        this.onSuccess(event);
    }
  }
  if (onComplete)
    onComplete.call(this, event);
  if (queue) {
    queue.shift();
    var next = queue[0];
    if (next) {
      if (next.onstart) {
        next.onstart.call(this);
        delete next.onstart;
      }
      document.body.appendChild(next);
    }
  }
};