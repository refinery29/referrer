R29.Events = function() {
  return R29.Log.apply(this, arguments)
}

R29.Events.prototype = new R29.Log;
!function(proto) {
  for (var property in proto)
    if (!R29.Events.prototype[property])
      R29.Events.prototype[property] = proto[property];
}(R29.Console.prototype);
R29.Events.prototype.key = 'locations';
R29.Events.prototype.onCast = function(object) {
  switch (typeof object) {
    case 'object':
      switch (object.nodeType) {
        case 9:
          return R29.URI(String(object.location));
          break;
        case 1:
          return R29.URI(object.getAttribute('href') || object.getAttribute('action') || object.getAttribute('src'))
      }
      if (object.location)
        return R29.URI(String(object.location));
  }
}