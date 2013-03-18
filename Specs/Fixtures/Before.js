document.wwrite = document.write;
document.write = function() {};
R29.Script.prototype.include = function(include) {
  return function(src, callback) {
    var replaced = src.replace(/^[a-zA-Z0-9]+/, '_').replace('.js', '');
    if (window[replaced]) {
      setTimeout(function() {
        window[replaced]();
        callback({type: 'success'});
      }, 300)
      return window[replaced];
    } else {
      return include.call(this, src, callback);
    }
  }
}(R29.Script.prototype.include);