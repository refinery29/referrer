R29.Document = function(document) {
  this.origin = document;
  // initialize persistent clientside storage
  this.storage = new R29.Storage('r29');
  // initialize session clientside storage
  this.session = new R29.Storage('r29', 'Session');
  // initialize a persistent log of referrers
  this.referrers = new R29.Referrers({
    storage: this.storage
  });
  // initialize a session log of locations and events
  this.events = new R29.Events({
    storage: this.session
  });
  // initialize console
  this.console = new R29.Console;
  // parse current URL
  this.location = new R29.URI(String(document.location));
  // parse referrer URL
  if (document.referrer)
    this.referrer = new R29.URI(String(document.referrer));
  // register current location
  this.events.push(this);
  // register current referrer
  this.referrers.push(this);
};

R29.Document.prototype.reset = function() {
  this.events.reset();
  this.referrers.reset();
};

R29.document = new R29.Document(document);

R29 = (function() {
  for (var property in R29) 
    R29.document[property] = R29[property];
  return R29.document;
})();
