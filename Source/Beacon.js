R29.Beacon = function(name, options) {
  R29.Beacon[name] = this;
  this.name = name;
  if (options)
    this.setOptions(options);
  if (this.onInitialize)
    this.onInitialize();
  if (this.isEager() || R29.Beacon.loaded)
    this.load();
};

R29.Beacon.prototype.setOptions = function(options) {
  if (options)
    for (var name in options)
      this[name] = options[name];
};

R29.Beacon.prototype.applicable = true;
R29.Beacon.prototype.lazy = true;
R29.Beacon.prototype.deferred = true;

R29.Beacon.initialize = function(options) {
  if (!this.queueing)
    this.queueing = window.addEventListener('load', R29.Beacon.onPageLoad)
  for (var name in options)
    if (!this[name])
      this.prototype[name] = options[name];
  for (var name in this) {
    var beacon = this[name];
    if (beacon && beacon.initialize)
      beacon.initialize(options && options[name]);
  }
};

R29.Beacon.onPageLoad = function() {
  var Beacon = R29.Beacon;
  Beacon.loaded = true;
  for (var name in Beacon) {
    var beacon = Beacon[name]
    if (beacon && beacon.initialize && beacon.initialized && !beacon.isEager())
      beacon.load();
  }
}

R29.Beacon.prototype.initialize = function(options) {
  if (!this.isApplicable())
    return;
  this.initialized = true;
  if (!this.isLoaded())
    this.load();
};

R29.Beacon.prototype.getID = function() {
  if (!this.id) throw "Beacon." + this.name + "#id is not set"
  return this.id
};

R29.Beacon.prototype.getDomain = function() {
  if (this.domain) return domain;
  var domain = this.host;
  if (!domain)
    domain = R29.domain.location.toString('label', 'zone');
  if (this.wildcard) domain = '.' + domain;
  return domain;
}

R29.Beacon.prototype.load = function() {
  if (this.isLoaded()) {
    if (!this.loaded && this.onLoad)
      this.onLoad();
    return;
  }
  var src = this.getURL && this.getURL() || this.src || this[location.protocol] || this.http;
  if (src) {
    if (!this.script) return;
    var script = this.script = document.createElement('script');
    var thus = this;
    if (this.onBeforeLoad)
      this.onBeforeLoad(src, script);
    script.onload = function(event) {
      thus.loaded = true;
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

R29.Beacon.prototype.isEager = function() {
  return this.eager;
};

R29.Beacon.prototype.isDeferred = function() {
  return this.deferred;
};

R29.Beacon.prototype.isLoaded = function() {
  return this.loaded;
};

R29.Beacon.prototype.isApplicable = function() {
  return this.applicable;
};

R29.Beacon.initialize({
  Buzzfeed: {},
  Comscore: {
    eager: true
  },
  GoogleAnalytics: {
    eager: true
  },
  Errorception: {
    id: "50cf5eded4e7c6d6270000f0"
  },
  Kissmetrics: {
    id: "28f434ced31b13b1e72933456b631d3ed1aa6cd3"
  },
  Parsely: {},
  Quantcast: {
    id: "p-fesXMHo90Ka_A"
  },
  Skimlinks: {
    id: "30283X879131"
  },
  Viglink: {
    id: "1570e0e48abafda91ef0898a9c8ba7d4"
  },
  Woopra: {}
})