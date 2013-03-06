// A function that loads ad scripts, redefines document.write() to buffer 
// the written contents, loads up referenced scripts asynchronously 
// and recursively evalutes them. Then puts original document.write() back. 
// The output is a nodelist.

R29.Ad = function() {
  R29.Script.apply(this, arguments);
};
R29.Ad.prototype = new R29.Script;
R29.Ad.prototype.writers = [];

// To capture ad output we have to redefine document.write(). If multiple ads
// are loaded asynchronously and in parallel, each ad instance needs to have its
// own document.write(), which will lead to conflicts. So ads are queued and
// loaded one after another. Ads block one another when they are included
// in a usual way, but this loader doesnt let them block the page loading.
R29.Ad.prototype.group = 'ad';


R29.Ad.prototype.onFetch = function() {
  this.capture()
}
R29.Ad.prototype.onBeforeLoad = function() {
  this.release()
};

// override document.write() to capture written contents into a buffer
// if a callback is passed, function executes it and releases 
// the content immediately
R29.Ad.prototype.capture = function(callback, stack, context) {
  var thus = this;
  var buffer = [];
  this.writers.push(document.write);
  console.log('capture')
  document.write = function(string) {
    return thus.write(string, buffer);
  };
  if (callback) {
    callback.call(this);
    var captured = this.release(buffer, context, !!stack);
    if (stack) 
      buffer.length = 0;
    return stack || buffer;
  } else {
    this.buffer = buffer;
  }
};
// release and parse HTML contents written into a buffer
R29.Ad.prototype.release = function(buffer, context, partial) {
  var parsed = this.parse(buffer, context, partial);
  console.log('release', parsed)
  document.write = this.writers.pop();
  return parsed;
};
// Write contents into a current buffer
R29.Ad.prototype.write = function(string, buffer) {
  (buffer || this.buffer).push(string)
};
// Convert html strings from a buffer into HTML elements
R29.Ad.prototype.parse = function(string, context, partial) {
  if (string == null) {
    var flushed = true;
    string = this.flush();
  }
  if (string == null) return;
  if (string.push) string = string.join('')
  var dummy = this.dummy;
  if (!dummy) dummy = R29.Ad.prototype.dummy = document.createElement('div');
  dummy.innerHTML = string;
  var children = dummy.childNodes;
  var nodes =  partial ? [] : this;
  for (var i = 0, node; node = children[i]; i++)
    nodes[i] = node
  nodes.length = i;
  // add parsed nodes into a result node list
  if (partial) {
    var stack = this;
    // add nodes after a given context or at the end
    if (context == null)
      i = stack.length
    else
      i = stack.indexOf(context)
    // shift nodes to free up space for captured nodes
    for (var j = stack.length; --j > i;)
      stack[j + children.length] = stack[j]
    // insert captured nodes
    stack.length = children.length + stack.length;
    for (var j = children.length; j--;)
      stack[j + i + 1] = children[j]
  }

  return nodes;
};
// Evaluate inline scripts in node list, load up remote scripts in order of appearance
// if a scripts calls document.write(), it appends content after that script in a node list
// if a script write()'s another script, it evaluates and loads it recursively.
R29.Ad.prototype.evaluate = function(callback, stack, context, partial) {
  if (!stack || partial) {
    var released = this.release(null, context, partial);
    if (!stack) stack = released;
  }
  for (var i = stack.indexOf(context) + 1; node = stack[i]; i++) {
    if (node.tagName == 'SCRIPT' && (!node.type || node.type.toLowerCase() == 'javascript')) {
      var script = this.execute(node, stack, callback);
      if (script) {
        stack[i] = script;
        break;
      }
    }
  }
  if (!node)
    callback.call(this);
};
// Executes or loads a single script
R29.Ad.prototype.execute = function(node, stack, callback) {
  if (node.src) {
    // load or queue up a script if another ad is currently loading
    return this.load(node, function(event) {
      console.log('oncopmplete', node.src)
      this.evaluate(callback, this, event.target, true);
    }, function() {
      // redefine document.write()
      console.log('onstart', node.src)
      this.capture();
    })
  } else {
    // evaluate local script and capture content added via document.write()
    // load up and evaluate any written scripts.
    this.capture(function() {
      // eval in global scope so var definitions set global variables
      // http://perfectionkills.com/global-eval-what-are-the-options/
      (1, eval)(node.innerText);
    }, stack, node)
  }
}
// flushes current buffer
R29.Ad.prototype.flush = function() {
  var buffer = this.buffer;
  delete this.buffer;
  return buffer;
};
R29.Ad.prototype.slice = Array.prototype.slice;
R29.Ad.prototype.map = Array.prototype.map;
R29.Ad.prototype.indexOf = Array.prototype.indexOf;