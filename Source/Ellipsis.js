R29.ellipsis = function(container, limit, pixels, label, whitespace) {
  var text = container.getAttribute('text-content');
  if (!text) {
    text = container.textContent;
    container.setAttribute('text-content', text);
  }

  // calculate element dimensions
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
  var width = container.offsetWidth - paddingLeft - paddingRight;
  var max = text.length;
  var now = 0;
  var state = true;
  if (!label) label = '…';
  var self = R29.ellipsis;

  // measure ellipsis element
  var more = R29.getElementsByClassName(container, 'ellipsis')[0];
  if (!more) {
    var stack = R29.ellipsis.stack[label];
    more = stack && stack.pop();
  }
  if (!more) {
    more = document.createElement('span');
    more.innerHTML = label;
  }
  var wrap = R29.getElementsByClassName(more, 'wrap')[0];
  if (!wrap) {
    var white = document.createElement('span');;
    white.className = 'whitespace';
    white.appendChild(document.createTextNode(whitespace || ' '));
    wrap = document.createElement('span');;
    wrap.className = 'wrap';
    wrap.style.whiteSpace = 'nowrap';
    for (var child; child = more.firstChild;)
      wrap.appendChild(child);
    more.appendChild(white)
    more.appendChild(wrap);
  } else
    var white = R29.getElementsByClassName(more, 'whitespace')[0];
  more.className = 'ellipsis';
  more.style.position = 'absolute';
  container.appendChild(more);
  var placeholder = wrap.offsetWidth;
  container.removeChild(more)
  more.style.position = '';

  // measure basline (first character)
  var baseline = R29.getRangeAt(container, 0).getBoundingClientRect()

  // find a spot for ellipsis
  for (var delta = max, n = 0; delta >= 0.25;) {
    delta /= 2;
    n += state ? delta : - delta;
    var now = Math.round(n);
    var range = R29.getRangeAt(container, now, range);
    var rectangle = range.getBoundingClientRect(); 
    var diff = rectangle.top - baseline.top;
    state = diff < height
    if ((height - diff) <= lineHeight && (rectangle.right - baseline.left) > width - placeholder) {
      state = false;
      if (delta < 2)
        delta = 2
    }
  }

  // move cursor to omit unfinished words and punctuation
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

  // put a cursor at the new spot
  if (offset)
    var range = R29.getRangeAt(container, now, range);
  var node = range.endContainer;

  // if there's enough room, remove ellipsis
  if ((range.overflown && !range.overflown) || now == max) {
    (self.stack[label] || (self.stack[label] = [])).push(more)
  // otherwise truncate text node, add ellipsis
  } else {
    var content = node.textContent;
    if (range.endOffset != content.length || (range.overflow == offset && offset)) {
      if (!node.replaced)
        node.replaced = content;
      node.textContent = content.substring(0, range.startOffset);
    }
    var next = node.nextSibling;
    node.parentNode.insertBefore(more, next)
    if (!next) next = more;
    for (var up = next; up; up = up.parentNode) {
      var right = next == up ? up : up.nextSibling
      for (; right; right = right.nextSibling) {
        switch (right.nodeType) {
          case 1:
            if (right != more)
              right.style.display = 'none';
            break;
          case 3:
            if (!right.replaced) right.replaced = right.textContent;
            right.textContent = '';
        }
      }
    }
  }

}
// walk elements to reach desired position (n-th character)
R29.getRangeAt = function(element, position, dummy) {
  for (var current = element, past = 0;;) {
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
    } else if (current.nodeType == 1) { 
      if (!overflown && current.style.display == 'none')
        current.style.display = '';
      var next = current.firstChild;
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
      next = null;
      continue;
    }
    break;
  }
  if (!text)
    return;
  // place dom range that can be measured
  if (!dummy) dummy = document.createRange();
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