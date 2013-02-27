R29.Console = function() {
  return R29.Log.apply(this, arguments);
}
R29.Console.prototype = new R29.Log;
R29.Console.prototype.adapter = window.console;
R29.Console.prototype.onPush = function(args) {
  if (!this.adapter) return;
  var type = args[0];
  if (!this.adapter[type])
    type = 'log';
  else
    args = args.slice(1);
  return this.adapter[type].apply(this.adapter, args);
};
['log', 'error', 'warn', 'info', 'group', 'table'].forEach(function(method) {
  R29.Console.prototype[method] = function() {
    return this.debug(method, Array.prototype.slice.call(arguments))
  };
});
['time', 'timeEnd', 'profile', 'profileEnd'].forEach(function(method) {
  R29.Console.prototype[method] = function() {
    return this.debug(method, Array.prototype.slice.call(arguments), new Date, method.indexOf('End') > -1)
  };
});
R29.Console.prototype.debug = function(type, args, time, end) {
  if (!this.adapter) return;
  if (time) {
    if (end)
      args.push(time - this.times.pop())
    else
      (this.times || (this.times = [])).push(time)
  }
  args.unshift(type);
  this.push(args);
}