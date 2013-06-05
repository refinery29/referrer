R29.ellipsis = function(container, limit, pixels, label, whitespace) {
  var text = container.getAttribute('text-content');
  if (!text) {
    text = container.textContent;
    container.setAttribute('text-content', text);
  }

  // calculate element dimensions
  var lineHeight = R29.getComputedStyle(container, 'lineHeight', 'line-height');
  if (lineHeight == 'normal' || lineHeight.match(/^[\d.]+(em)$/)) {
    var fontSize = parseFloat(R29.getComputedStyle(container, 'fontSize', 'font-size'));
    lineHeight = (parseFloat(lineHeight) || 1.5) * fontSize;
  } else {
    lineHeight = parseFloat(lineHeight)
  }
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
  if (!whitespace) whitespace = ' ';
  var self = R29.ellipsis;

  // measure ellipsis element
  var more = R29.getElementsByClassName(container, 'ellipsis')[0];
  if (!more) {
    var stack = R29.ellipsis.stack[whitespace + label];
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
    white.appendChild(document.createTextNode(whitespace));
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
  var offsetLeft = 0, offsetTop = 0, start = 0;
  for (var parent = container; parent; parent = parent.offsetParent) {
    offsetLeft += parent.offsetLeft;
    offsetTop += parent.offsetTop;
  }
  var collapse = 0, shift = 0, collapsed;
  //console.group(text.replace(/[\s\n]+/mg, '').substring(0, 40));
  // find a spot for ellipsis
  for (var delta = max - start, n = start; delta >= 0.25;) {
    // check middle of the text, then check in the middle 
    delta /= 2;
    n += state ? delta : - delta;
    var now = Math.round(n);
    for (var diff = null; diff == null;) {
      var position = now - collapse - shift;
      range = R29.setRange(container, position, range);
      var rectangle = range.getBoundingClientRect(); 
      diff = rectangle.top - offsetTop;
      // if cursor is within collapsed whitespace, browser doesnt 
      // calculate its position. so we have to move cursor backwards
      if (diff < 0) {
        diff = null;
        collapse += text.substring(0, position).match(self.boundaries)[0].length;
        collapsed = range.startContainer;
      } else {
        // if there's not enough room for ellipsis element, move backwards
        if ((height - diff) <= lineHeight && (rectangle.right - offsetLeft) > width - placeholder) {
          diff = null;
          shift++;
        } else {
          if (collapse) {   // && collapsed != range.startContainer) {
            collapse = 0;
            collapsed = null;
          }
          if (shift) {
            break;
          }
        }
      }
    }
    state = diff < height
    console.log(n, now, collapse, [diff, height], [text.substring(now), range.startContainer.textContent.substring(range.startOffset)], [rectangle.top, offsetTop], [diff, height, lineHeight])

  }
  now = now - shift - collapse//(collapse ? collapse - 1 : 0);
  //console.groupEnd(text.replace(/[\s\n]+/mg, '').substring(0, 40));

  // move cursor to omit unfinished words and punctuation
  var offset = 0;
  if (now != max) {
    for (var chr; chr = text.charAt(now - offset);) {
      if (chr.match(self.boundaries)) {
        var bound = true;
      } else if (!chr.match(self.ignore)) {
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
    now = Math.max(0, now - offset);
  }
  // put a cursor at the new spot
  var range = R29.setRange(container, now, range);
  var node = range.endContainer;

  // if there's enough room, remove ellipsis
  if (now == max) {
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
    for (var up = next; up && up != container; up = up.parentNode) {
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
R29.setRange = function(element, position, range) {
  var from = range ? range.position : null;
  var forward = from == null || from < position || !range;
  var horizontal = forward ? 'nextSibling' : 'previousSibling';
  var vertical = forward ? 'firstChild' : 'lastChild';
  var current = range ? range.startContainer : element;
  var split = range && range.startOffset || 0;
  if (range && range.overflow == 0)
    split ++;
  var past = range && from != null ? from - split : 0;
  for (;;) {
    if (current.nodeType == 3) {
      if (!overflown) {
        var text = current;
        var replaced = current.replaced;
        if (replaced) {
          current.textContent = replaced;
          current.replaced = null;
        }
        var length = current.textContent.length;
        if (rewind) {
          rewind = false;
          past -= length;
        }
        var overflow = past + length - position;
        if (overflow < 0) {
          past += length;
        } else {
          if (position > past)
            var overflown = current;
          else
            var rewind = true;
        }
      }
    } else if (current.nodeType == 1) { 
      if (!overflown && current.style.display == 'none')
        current.style.display = '';
      var next = current[vertical];
    }
    for (; !next; ) {
      next = current[horizontal];
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
  if (!range) range = document.createRange();
  var last = Math.max(0, Math.min(position - past, length - 1));
  range.overflown = overflown == current;
  range.overflow = overflow;
  range.position = position;
  range.setStart(text,  last);
  range.setEnd(text, last + 1);
  return range;
}

// chars that may preceed ellipsis
R29.ellipsis.boundaries = /\s|\m|^$|\n/;
// chars that should not preceed ellipsis
R29.ellipsis.ignore = /\(|:|,/;

R29.ellipsis.stack = {};