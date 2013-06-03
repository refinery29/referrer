R29.ellipsis = function(container, limit, pixels, label) {
  var text = container.getAttribute('text-content');
  if (!text) {
    text = container.textContent;
    container.setAttribute('text-content', text);
  }
  var lineHeight = parseFloat(R29.getComputedStyle(container, 'lineHeight', 'line-height'));
  var paddingTop = parseFloat(R29.getComputedStyle(container, 'paddingTop', 'padding-top'));
  var paddingBottom = parseFloat(R29.getComputedStyle(container, 'paddingBottom', 'padding-bottom'));
  var paddingLeft = parseFloat(R29.getComputedStyle(container, 'paddingLeft', 'padding-left'));
  var paddingRight = parseFloat(R29.getComputedStyle(container, 'paddingRight', 'padding-right'));
  if (pixels) {
    var height = limit;
  } else {
    var lines = limit || parseInt(container.getAttribute('maxlines')) || 2;
    var height = lineHeight * lines;
  }
  var max = text.length;
  var now = 0;
  var state = true;
  var baseline = R29.getRangeAt(container, 0).getBoundingClientRect()
  if (!label) label = '…';
  var self = R29.ellipsis;
  var more = R29.getElementsByClassName(container, 'ellipsis')[0];
  if (!more) {
    var stack = R29.ellipsis.stack[label];
    more = stack && stack.pop() || document.createElement('span');
    more.className = 'ellipsis';
    more.innerHTML = label;
    more.style.position = 'absolute';
    container.appendChild(more);
    var placeholder = more.offsetWidth;
    container.removeChild(more)
    more.style.position = '';
  } else {
    var placeholder = more.offsetWidth;
    if (more.parentNode)
      more.parentNode.removeChild(more)
  }

  var width = container.offsetWidth - paddingLeft - paddingRight;
  for (var range = max, n = 0; range >= 0.25;) {
    range /= 2;
    n += state ? range : - range;
    var now = Math.round(n);
    var r = R29.getRangeAt(container, now);
    var rectangle = r.getBoundingClientRect(); 
    var diff = rectangle.top - baseline.top;
    state = diff < height
    if ((height - diff) <= lineHeight && (rectangle.right - baseline.left) > width - placeholder) {
      state = false;
      if (range < 2)
        range = 2
    }
  }
  var offset = 0;
  if (now != max) {
    for (var chr; chr = text.charAt(now - offset);) {
      if (self.boundaries.indexOf(chr) > -1) {
        var bound = true;
      } else if (self.ignore.indexOf(chr) == -1) {
        if (ignored || bound) {
          offset--;
          break;
        }
      } else {
        var ignored = true;
        bound = false;
      }
      offset ++;
    }
    now -= offset;
  }
  var range = R29.getRangeAt(container, now);
  var node = range.endContainer;
  if ((range.overflown && !range.overflown) || now == max) {
    var removed = true;
    if (more.parentNode) {
      (self.stack[label] || (self.stack[label] = [])).push(more)
      more.parentNode.removeChild(more);
    }
    //return;
  }
  for (var current = node, past = 0;;) {
    if (current.nodeType == 3) {
      if (current == node) {
        var content = current.textContent;
        if (range.endOffset != content.length || (range.overflow == offset && offset)) {
          if (!current.replaced)
            current.replaced = content;
          current.textContent = content.substring(0, range.startOffset);
        }
        if (!removed)
          node.parentNode.insertBefore(more, next)
      }
    }
    var next = current.firstChild;
    for (; !next && current != container; current = current.parentNode) {
      next = current.nextSibling;
      if (next == more)
        next = next.nextSibling;
    }
    if (next) {
      current = next;
      continue;
    }
    break;
  }
}
R29.getRangeAt = function(element, position, real) {
  for (var current = element, past = 0;;) {
    var ellipsis = current.className == 'ellipsis';
    var next = ellipsis && current.nextSibling || current.firstChild;
    if (ellipsis)
      current.parentNode.removeChild(current)
    if (current.nodeType == 3) {
      if (overflown)
        break;
      var text = current;
      var replaced = current.replaced;
      if (replaced) {
        current.textContent = replaced;
        current.replaced = null;
      }
      var content = current.textContent;
      var length = content.length;
      var overflow = past + length - position;
      if (overflow < 0) {
        past += length;
      } else {
        var overflown = current;
      }
    }
    for (; !next; ) {
      next = current.nextSibling;
      if (!next) {
        if (current.parentNode == element)
          break;
        else
          current = current.parentNode;
      }
    }
    if (next) {
      current = next;
      continue;
    }
    break;
  }
  if (!text)
    return;
  var dummy = document.createRange();
  var length = text.textContent.length;
  var last = Math.min(position - past, length - 1);
  dummy.overflown = overflown == current;
  dummy.overflow = overflow;
  dummy.setStart(text,  last);
  dummy.setEnd(text, last + 1);
  return dummy;
}

// chars that may preceed ellipsis
R29.ellipsis.boundaries = [' ', ' ', '\
'];
// chars that should not preceed ellipsis
R29.ellipsis.ignore = ['(', ','];

R29.ellipsis.stack = {};