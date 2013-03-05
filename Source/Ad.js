// A function that loads ad scripts, redefines document.write() to buffer 
// the written contents, loads up referenced scripts asynchronously 
// and recursively evalutes them. Then puts original document.write() back. 
// The output is a nodelist.

R29.Ad = function() {
  R29.Script.apply(this, arguments);
};

R29.Ad.prototype = new R29.Script;
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
  (this.writers || (this.writers = [])).push(document.write)
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
  console.log('pop', this.writers[this.writers.length - 1]);
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
  var dummy = document.createElement('div');
  dummy.innerHTML = string;
  var children = dummy.childNodes;
  var nodes =  partial ? [] : this;
  for (var i = 0, node; node = children[i]; i++)
    nodes[i] = node
  nodes.length = i;

  if (partial) {
    var stack = this;
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
// Evaluate local scripts in node list, load up remote scripts in order of appearance
// if a scripts calls document.write(), it appends content after that script in a node list
// if a script write()'s another script, it evaluates and loads it recursively
R29.Ad.prototype.evaluate = function(callback, stack, context, partial) {
  if (!stack || partial) {
    stack = this.release(null, context, partial);
    if (!partial) stack = this;
  }
  for (var i = 0, async = [], node; node = stack[i]; i++) {
    if (node.tagName == 'SCRIPT' && (!node.type || node.type.toLowerCase() == 'javascript')) {
      if (node.src) {
        stack[i] = document.createElement('script')
        stack[i].src = node.src;
        node = stack[i];
        async.push(node);
        this.capture();
        node.onload = (function(element, thus) {
          // evaluate the content written by a remote script. If it written any
          // other script tags, it loads them recursively in order
          return function() {
            thus.evaluate(function() {
              async.shift();
              // load up queued scripts in order
              if (async.length)
                document.body.appendChild(async[0]);
              else
                callback.call(thus)
            }, thus, this, true);
          }
        }(node, this));
        if (async.length == 1)
          document.body.appendChild(node);
      } else {
        // evaluate local script and capture content added via document.write()
        // load up and evaluate any written scripts.
        this.capture(function() {
          eval(node.innerText);
        }, stack, node)
      }
    }
  }
  if (!async.length)
    callback.call(this);
  else
    this.callback = callback;
};
// flushes current buffer
R29.Ad.prototype.flush = function() {
  var buffer = this.buffer;
  delete this.buffer;
  return buffer;
};
R29.Ad.prototype.slice = Array.prototype.slice;
R29.Ad.prototype.indexOf = Array.prototype.indexOf;