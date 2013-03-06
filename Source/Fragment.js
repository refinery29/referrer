// A function that loads ad scripts, redefines document.write() to buffer 
// the written contents, loads up referenced scripts asynchronously 
// and recursively evalutes them. Then puts original document.write() back. 
// The output is a nodelist.

R29.Fragment = function() {
  var ad = document.createDocumentFragment();
  var proto = R29.Fragment.prototype;
  for (var property in proto)
    ad[property] = proto[property];
  R29.Script.apply(ad, arguments);
  return ad;
};
R29.Fragment.prototype = new R29.Script;
R29.Fragment.prototype.writers = [];

// To capture ad output we have to redefine document.write(). If multiple ads
// are loaded asynchronously and in parallel, each ad instance needs to have its
// own document.write(), which will lead to conflicts. So ads are queued and
// loaded one after another. Ads block one another when they are included
// in a usual way, but this loader doesnt let them block the page loading.
R29.Fragment.prototype.group = 'ad';


R29.Fragment.prototype.onFetch = function() {
  this.capture()
}
R29.Fragment.prototype.onBeforeLoad = function() {
  this.release()
};

// override document.write() to capture written contents into a buffer
// if a callback is passed, function executes it and releases 
// the content immediately
R29.Fragment.prototype.capture = function(callback, stack, context) {
  var thus = this;
  var buffer = [];
  this.writers.push([this, buffer, stack]);
  if (document.write == this.documentWrite) {
    document.write = this.overloadedWrite;
    document.getElementById = this.overloadedGetElementById;
  }
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
R29.Fragment.prototype.release = function(buffer, context, partial) {
  var parsed = this.parse(buffer, context, partial);
  this.writers.pop()
  if (!this.writers.length) {
    document.write = this.documentWrite;
    document.getElementById = this.documentGetElementById;
  }
  return parsed;
};
// Write contents into a current buffer
R29.Fragment.prototype.write = function(string, buffer) {
  (buffer || this.buffer).push(string)
};
// Convert html strings from a buffer into HTML elements
R29.Fragment.prototype.parse = function(string, context, partial) {
  if (string == null) {
    var flushed = true;
    string = this.flush();
  }
  if (string == null) return;
  if (string.push) string = string.join('')
  var dummy = this.dummy;
  if (!dummy) dummy = R29.Fragment.prototype.dummy = document.createElement('div');
  dummy.innerHTML = string;
  var children = dummy.childNodes;
  var nodes =  partial ? [] : this;
  for (var i = 0, node; node = children[i]; i++)
    if (nodes.nodeType) {
      nodes.appendChild(node)
      i--;
    } else
      nodes[i] = node
  // add parsed nodes into a result node list
  if (partial) {
    nodes.length = i;
    var stack = this;
    if (stack.nodeType) {
      for (var j = children.length; j--;)
        stack.insertBefore(children[j], context.parentNode == stack ? context.nextSibling : undefined)
    } else {
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
  }

  return nodes;
};
// Evaluate inline scripts in node list, load up remote scripts in order of appearance
// if a scripts calls document.write(), it appends content after that script in a node list
// if a script write()'s another script, it evaluates and loads it recursively.
R29.Fragment.prototype.evaluate = function(callback, stack, context, partial) {
  if (!stack || partial) {
    var released = this.release(null, context, partial);
    if (!stack) stack = released;
  }
  var children = stack.childNodes || stack;
  for (var i = Array.prototype.indexOf.call(children, context) + 1; node = children[i]; i++) {
    if (node.tagName == 'SCRIPT' && (!node.type || node.type.toLowerCase() == 'javascript')) {
      var script = this.execute(node, stack, callback);
      if (script) {
        children[i].original = script;
        break;
      }
    }
  }
  if (!node)
    callback.call(this);
};
// Executes or loads a single script
R29.Fragment.prototype.execute = function(node, stack, callback) {
  if (node.src) {
    // load or queue up a script if another ad is currently loading
    return this.load(node, function(event) {
      event.target.parentNode.removeChild(event.target);
      this.evaluate(callback, this, node, true);
    }, function() {
      // redefine document.write()
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
R29.Fragment.prototype.flush = function() {
  var buffer = this.buffer;
  delete this.buffer;
  return buffer;
};

['slice', 'splice', 'map', 'indexOf'].forEach(function(method) {
  R29.Fragment.prototype[method] = function() {
    return Array.prototype[method].apply(this.childNodes, arguments);
  }
});

R29.Fragment.prototype.getElementById = function(id) {
  if (this.buffer) this.parse();
  id = id.toLowerCase();
  for (var i = 0, child; child = this.childNodes[i++];)
    if (child.nodeType == 1) {
      if (child.id.toLowerCase() == id)
        return child;
      if (child = R29.Fragment.prototype.getElementById.call(child, id))
        return child;
    }
  return null;
};

R29.Fragment.prototype.getElementsByTagName = function(tag) {
  if (this.buffer) this.parse();
  tag = tag.toUpperCase();
  var result = [];
  for (var i = 0, child; child = this.childNodes[i++];) {
    if (child.nodeType == 1) {
      if (child.tagName == tag || tag == '*') result.push(child);
      var children = child.getElementsByTagName(tag);
      for (var j = 0, subchild; subchild = children[j++];)
        result.push(subchild);
    }
  }
  return result;
}

// keep reference to original element methods
R29.Fragment.prototype.documentWrite = document.write;
R29.Fragment.prototype.documentGetElementById = document.getElementById;

// following methods are set on document object when .capture() is called
// they get reverted to original methods when .release() is called

// make document.getElementById first look inside ad buffers
R29.Fragment.prototype.overloadedGetElementById = function(id) {
  var proto = R29.Fragment.prototype, writers = proto.writers;
  for (var i = 0, writer; writer = writers[i++];) {
    if (writer[0].buffer) writer[0].parse();
    var result = writer[0].getElementById(id);
    if (result) return result;
  }
  return proto.getElementById.call(this, id);
};

// make document.write() output the content into a buffer detached from DOM
R29.Fragment.prototype.overloadedWrite = function(content) {
  var proto = R29.Fragment.prototype
  var writers = proto.writers;
  if (writers.length) {
    writers[writers.length - 1][1].push(content)
  } else {
    proto.documentWrite.call(document, content);
  }
};