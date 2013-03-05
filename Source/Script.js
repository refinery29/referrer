R29.Script = function(options) {
  if (options)
    this.setOptions(options);
  if (this.onInitialize)
    this.onInitialize();
  if (this.isEager())
    this.load();
};

R29.Script.prototype.setOptions = function(options) {
  if (options)
    for (var name in options)
      this[name] = options[name];
};

R29.Script.prototype.isEager = function() {
  return this.eager;
};

R29.Script.prototype.isLoaded = function() {
  return this.loaded;
};

R29.Script.prototype.load = function() {
  if (this.isLoaded()) {
    if (!this.loaded) {
      if (this.onBeforeLoad)
        this.onBeforeLoad()
      if (this.onPreload)
        this.onPreload();
      if (this.onLoad)
        this.onLoad();
    }
    return;
  }
  var src = this.getURL && this.getURL() || this.src || this[location.protocol] || this.http;
  if (src) {
    if (!this.script) return;
    var script = this.script = document.createElement('script');
    var thus = this;
    if (this.onFetch)
      this.onFetch(src, script);
    script.onload = function(event) {
      thus.loaded = true;
      if (thus.onBeforeLoad)
        thus.onBeforeLoad(event);
      if (thus.onLoad)
        thus.onLoad(event)
    }
    script.onerror = function(event) {
      if (this.onError)
        thus.onError(event)
    }
    script.src = src;
    document.appendChild(script)
  }
};