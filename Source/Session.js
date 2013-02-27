R29.Session = function() {
  return R29.Log.apply(this, arguments)
}

R29.Session.prototype = new R29.Log;
R29.Session.prototype.onCast = function(object) {
  switch (typeof object) {
    case 'object':
      switch (object.nodeType) {
        case 9:
          return R29.URI(String(object.location));
          break;
        case 1:
          return R29.URI(object.getAttribute('href') || object.getAttribute('action') || object.getAttribute('src'))
      }
  }
}