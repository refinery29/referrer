R29.getLineHeight = function(element) {
  var lineHeight = R29.getComputedStyle(element, 'lineHeight', 'line-height');
  if (lineHeight == 'normal' || lineHeight.match(/^[\d.]+(em|%)$/)) {
    var fontSize = parseFloat(R29.getComputedStyle(element, 'fontSize', 'font-size'));
    return (parseFloat(lineHeight) || 1.5) * fontSize;
  } else {
    return parseFloat(lineHeight)
  }
}

R29.ellipsis = function(container, limit, pixels, label, whitespace) {

  // calculate element dimensions
  var paddingTop = parseFloat(R29.getComputedStyle(container, 'paddingTop', 'padding-top'));
  var paddingBottom = parseFloat(R29.getComputedStyle(container, 'paddingBottom', 'padding-bottom'));
  var paddingLeft = parseFloat(R29.getComputedStyle(container, 'paddingLeft', 'padding-left'));
  var paddingRight = parseFloat(R29.getComputedStyle(container, 'paddingRight', 'padding-right'));
  if (pixels) {
    var height = limit;
  } else {
    var lines = limit || parseInt(container.getAttribute('maxlines')) || 2;
    var height = R29.getLineHeight(container) * lines;
  }
  var width = container.offsetWidth - paddingLeft - paddingRight;
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
    more.className = 'ellipsis built';
  } else {
    more.parentNode.removeChild(more);
    if (!more.classList.contains('built'))
      more.classList.add('reused')
  }
  var text = container.getAttribute('text-content');
  if (!text) {
    text = container.textContent;
    container.setAttribute('text-content', text);
  }
  var max = text.length;
  var now = 0;
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

  // measure basline (first character)
  var box = container.getBoundingClientRect()
  var collapse = 0, shift = 0, offset = 0, collapsed;
  //console.group(text.replace(/[\s\n]+/mg, '').substring(0, 40));
  // find a spot for ellipsis
  if (text.indexOf('too long') > -1)
    debugger
  for (var delta = max, n = 0; delta >= 0.5;) {
    delta /= 2;
    n += state ? delta : - delta;
    var now = Math.round(n);
    for (var diff = null; diff == null;) {
      var position = now - collapse - shift;
      if (position < 0) {
        break;
      }
      range = R29.setRange(container, position, range);
      var rectangle = range.getBoundingClientRect();
      diff = rectangle.bottom - paddingTop - box.top;
      //console.error(delta, state, text.substring(0, position), rectangle.bottom, rectangle, offsetTop, [position, max], [diff, height])
      
      // if cursor is within collapsed whitespace, browser doesnt 
      // calculate its position. so we have to move cursor backwards
      if (text.indexOf('Beyonce') > -1)
        debugger
      if (!rectangle.bottom) {
        diff = null;
        collapse++
        var match = text.substring(0, position).match(self.boundaries);
        if (!match || match[0].length) {
          collapse++;
        } else {
          collapse += match[0].length
        }
        collapsed = range.startContainer;
      } else {
        // if there's not enough room for ellipsis element, move backwards
        var parent = range.startContainer.parentNode;
        if (now == max) {
          more.classList.add('final');
        } else {
          more.classList.remove('final');
        }
        if (shifted != parent) {
          var shifted = parent; 
          lineHeight = R29.getLineHeight(parent)
          more.style.position = 'absolute';
          parent.appendChild(more);
          var placeholder = more.offsetWidth;
          if (!white.offsetWidth && whitespace == ' ')
            placeholder += 5;
          parent.removeChild(more)
          more.style.position = '';
        }
        if (now != max && ((height - diff) <= lineHeight && (rectangle.right - box.left - paddingLeft) > width - placeholder)) {
          diff = null;
          shift++;
        } else {
          if (collapse) {   // && collapsed != range.startContainer) {
            collapse = 0;
            collapsed = null;
          }
          //if (shift) {
            break;
          //}
        }
      }
    }
    state = diff <= height
    //console.log(n, now, collapse, offsetTop, [diff, height], [text.substring(now), range.startContainer.textContent.substring(range.startOffset)], [rectangle.top, offsetTop], [diff, height, lineHeight])

  }
  now = now - shift - collapse//(collapse ? collapse - 1 : 0);
  //console.groupEnd(text.replace(/[\s\n]+/mg, '').substring(0, 40));
  //offset = 1;
  if (now < max - 1 || text.charAt(now).match(self.boundaries))
  for (var chr; now - offset > -1;) {
    chr = text.charAt(now - offset)
    if (chr.match(self.boundaries)) {
      var bound = true;
    } else if (!chr.match(self.ignore) || now == max) {
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
  if (text.indexOf('Polish') > -1)
    debugger
  if (now == max - 1) 
    if (!more.classList.contains('built'))
      offset++;
    else
      offset--;
  now = Math.max(0, now - offset);
  // put a cursor at the new spot
  var range = R29.setRange(container, now, range);
  console.log(range.startOffset, [collapse, shift, offset, placeholder], [text, range.startContainer.textContent])
  var node = range.endContainer;

  // if there's enough room, remove ellipsis
  var match = text.substring(now).match(self.boundaries);
  if (now + (match && match[0].length || 0) == max && more.classList.contains('built')) {
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
      var right = up.nextSibling
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
R29.ellipsis.boundaries = /(\s|^|\r?\n|\t)+$/;
// chars that should not preceed ellipsis
R29.ellipsis.ignore = /\(|:|,|\./;

R29.ellipsis.stack = {};