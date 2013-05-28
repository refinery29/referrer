R29.Beacon = function(name, options) {
  R29.Beacon[name] = this;
  this.name = name;
  R29.Script.call(this, options)
};

R29.Beacon.prototype = new R29.Script;

R29.Beacon.prototype.applicable = true;
R29.Beacon.prototype.immediate = false;
R29.Beacon.prototype.eager = false;

R29.Beacon.initialize = function(options) {
  if (!this.queueing)
    this.queueing = window.addEventListener('load', R29.Beacon.onPageLoad) || true;
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

R29.Beacon.prototype.isImmediate = function() {
  return this.immediate;
};

R29.Beacon.prototype.isApplicable = function() {
  return this.applicable;
};
/*
Example config: 

  * Loads multiple beacons
  * Sets up the configuration
  * Checks if they were loaded before or bundled
  * Executes callbacks

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
*/