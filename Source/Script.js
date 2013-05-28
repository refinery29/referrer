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

R29.Script.prototype.isLoading = function(src) {
  if (this.global) {
    var scripts = document.getElementsByTagName('script');
    for (var i = 0, script; script = scripts[i++];)
      if (script.src.indexOf(src) > -1)
        return script;
  }
  return this.loading == src;
}

R29.Script.prototype.include = function(src, callback) {
  var script = document.createElement('script');
  script.type= 'text/javascript';
  script.onload = script.onerror = callback;
  script.src = src;
  return script;
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
  var loading = this.isLoading(src);
  if (loading) {
    if (!this.loading) {
      if (onStart)
        onStart.call(this);
      this.loading = src;
      if (loading.nodeType) {
        this.script = loading;
        var thus = this;
        loading.addEventListener('load', function(event) {
          thus.onFinish(event, queue, onComplete, loading);
        })
      } else if (this.isLoaded != LSD.Script.prototype.isLoaded) {
        // poll periodically?
      }
    }
    return;
  }
  if (!src || this.loading == src) return;
  var thus = this;
  var group = this.group;
  this.loading = src;
  var script = this.include(src, function(event) {
    delete thus.loading
    thus.onFinish(event, queue, onComplete, script)
  })
  if (!this.script) this.script = script;
  if (group)
    var queue = (this.groups[group] || (this.groups[group] = []))
  if (!queue || queue.push(script) == 1) {
    if (onStart)
      onStart.call(this);
    if (script.nodeType)
      document.body.appendChild(script)
    else
      setTimeout(script, 10)
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
        this.onError(event, script)
    } else {
      if (this.onSuccess)
        this.onSuccess(event, script);
    }
  }
  if (onComplete)
    onComplete.call(this, event, script);
  if (queue) {
    queue.shift();
    var next = queue[0];
    if (next) {
      if (next.onstart) {
        next.onstart.call(this);
        delete next.onstart;
      }
      if (next.nodeType)
        document.body.appendChild(next);
      else 
        setTimeout(next, 10);
    }
  }
};