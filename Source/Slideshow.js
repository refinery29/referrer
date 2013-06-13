Slideshow = function(element, options) {
  if (!(this instanceof Slideshow))
    return new Slideshow(element);
  if (!element) return;
  this.element = element;
  this.wrapper = R29.getElementsByClassName(element, 'wrapper')[0] || element;
  this.list = this.wrapper.getElementsByTagName('ul')[0];
  this.items = [];
  this.images = [];
  this.extras = [];
  this.pictures = [];
  this.metas = [];
  this.descriptions = [];
  this.offsetWidths = [];
  this.offsetHeights = [];
  this.choices = R29.getElementsByClassName(element, 'choices')[0];
  this.scrollBarWidth = element.offsetHeight - element.clientHeight;
  if (options)
    for (var option in options)
      if (option == 'orientation')
        this.setOrientation(options[option])
      else
        this[option] = options[option];
  // prevent scrolling underneath slideshow
  if (this.element && !this.inline) 
    this.element.addEventListener('touchmove', function(e) {
      e.preventDefault();
    }, false);
  if (this.className)
    this.className = this.wrapper.className = this.wrapper.className + ' ' + this.className
  else
    this.className = el.wrapperement.className;
  for (var children = this.list.childNodes, i = 0, child; child = children[i++];) {
    if (child.tagName != 'LI') continue;
    this.items.push(child);
    var picture = R29.getElementsByClassName(child, 'picture')[0];
    var image = picture && picture.getElementsByTagName('img')[0];
    this.pictures.push(picture);
    var index = this.images.push(image) - 1;
    if (image) {
      image.onload = (function(image, index, self) {
        return function() {
          self.onImageLoad(image, index)
        }
      })(image, index, this);
      if (image.width) image.onload();
    }
  }
  this.items[0].className += ' first';
  this.items[this.items.length - 1].className += ' last';
  this.selected = this.items[0];
  this.selected.className += ' selected';
  this.onResize()
  this.scrollTo(this.focusing ? this.selected : 0)
  this.attach();
};
Slideshow.prototype.attach = function() {
  var self = this;
  var element = this.wrapper;
  this.hammer = hammer = new Hammer(this.inline ? element : document.body, {
    swipe: false,
    hold: false,
    //prevent_default: true,
    //css_hacks: false,
    hold_timeout: 400,
    drag_min_distance: 0,
    tap_max_distance: 100,
    container: this.inline && element,
    allow_drag: true
    //,

    //tap_max_interval: 700 // seems to bee needed for IE8
  });


  element.onscroll = function(e) {
    return self.onScroll(e)
  }
  element.onmousedown = function(event) {
    //if (event.target.tagName == 'IMG')
      event.preventDefault();
  }

  hammer.ondragstart = function(event) {
    cancelAnimationFrame(self.scrolling);
    delete self.scrolling
    delete self.busy;
    event.preventDefault();
    self.onTouch(event);
    for (var el = event.target; el; el = el.parentNode)
      if (el == element) break;
    if (!el) return;
    if (self.onDragStart) self.onDragStart(event);
    self.scrollStart = self[self.scrollNow] - self.placeholding;
  }

  hammer.ontap = function(event) {
    self.onTouch(event);
    return self.onClick(event, 'tap')
  }

  hammer.ondrag = function(event) {
    if (self.onDrag) self.onDrag(event);
    event.preventDefault()
    var delta    = self.orientation == 'landscape' ? event.deltaX : event.deltaY;
    if (delta) {
      self.scrollTo(self.scrollStart - delta)
    }
  }
  
  hammer.ondragend = function(event) {
    if (self.onDragEnd)
      self.onDragEnd(event);
    var velocity = self.orientation == 'landscape' ? event.velocityX : event.velocityY;
    var delta    = self.orientation == 'landscape' ? event.deltaX : event.deltaY;
    var x = (self.scrollStart - delta) + self[self.offset] / 2  - 400 * (delta > 0 ? velocity : - velocity);
    var item = self.getItemByPosition(x);
    var snap = self.getItemPosition(item, delta < 0 ? 'next' : 'previous');//   + self.offsetWidth / 2;
    self.scrollTo(snap - (self[self.offset] - item[self.offset]) / 2, 800)
    delete self.scrollStart;
  }
}
Slideshow.prototype.detach = function() {
  if (this.hammer)
    this.hammer.enable(false)
}
Slideshow.prototype.previous = function() {
  this.select('previous');
}
Slideshow.prototype.next = function() {
  this.select('next');
}
Slideshow.prototype.close = function(e) {
  e.preventDefault()
  e.stopPropagation()
  //this.select(this.selected);
}
Slideshow.prototype.repeat = function() {
  this.select(this.items[0]);
}
Slideshow.prototype.getRelativeItem = function(diff, origin) {
  var items = this.items;
  var index = items.indexOf(origin || this.selected);
  var i = index + diff, j = items.length;
  var item = items[i] || this.endless && items[diff > 0 ? i % j : i + j];
  return item;
}
Slideshow.prototype.select = function(element, scroll, animate, gesture) {
  switch (element) {
    case 'previous':
      if (!(element = this.items[this.items.indexOf(this.selected) - 1]))
        if (!this.endless || !(element = this.items[this.items.length - 1]))
          return;
      break;
    case 'next':
      if (!(element = this.items[this.items.indexOf(this.selected) + 1]))
        if (!this.endless || !(element = this.items[0]))
          return;
      break;
    default:
      if (!element) return;
      if (typeof element == 'number') {
        element = this.getItemByPosition(element);
      }
  }
  if (scroll !== false) {
    var self = this;
    self.clicked = true;
    clearTimeout(self.clicking);
    self.clicking = setTimeout(function() {
      delete self.clicking;
      delete self.clicked;
    }, 400)
    this.scrollTo(element, animate == null ? true : animate);
  }
  if (this.selected != element) { 
    if (this.selected) 
      this.selected.classList.remove('selected');
    this.selectedIndex = this.items.indexOf(element)
    if (this.previousItem) 
      this.previousItem.classList.remove('past');
    if (this.nextItem) 
      this.nextItem.classList.remove('future');
    var previous = this.selected;
    this.selected = element;
    element.classList.add('selected');
    if (this.onSet) 
      this.onSet(element, this.items.indexOf(element), previous);
    // element.style.height = 'auto';
    //this.crop(element);
    var prev = this.getRelativeItem(-1, element);
    var next = this.getRelativeItem(+1, element);
    if (prev && this.previousItem != prev) 
      (this.previousItem = prev).classList.add('past');
    if (next && this.nextItem != next) 
      (this.nextItem = next).classList.add('future');
  }
};
Slideshow.prototype.interact = function() {
  if (document.body.className.indexOf('interacting') == -1)
    document.body.className += ' interacting';
  clearTimeout(this.interaction);
  var self = this;
  this.interaction = setTimeout(function() {
    document.body.className = document.body.className.replace(' interacting', '') ;
    delete self.interaction;
  }, 350)
}
Slideshow.prototype.placehold = function(x) {
  var value = 0;
  var placeheld = (this.placeheld || (this.placeheld = []));
  for (var i = this.items.length; i-- && (value < x);) {
    var child = this.items[i];
    if (placeheld.indexOf(child) == -1) {
      placeheld.push(child)
      child.style.position = 'absolute';
      child.classList.add('placeheld');
    }
    value += this[this.offsets][i] + this.gap;
  }
  if (this.placeholding != value) {
    this.list.style[this.padding] = value + 'px';
    this.list.style[this.dimension] = (this[this.scroll] - value) + 'px'
    var position = 0;
    var difference = this.placeholding - value;
    for (var i = placeheld.length, child; child = placeheld[--i];) {
      var offset = this[this.offsets][this.items.indexOf(child)];
      if (difference >= offset) {
        difference -= offset + this.gap;
        placeheld.pop();
        child.classList.remove('placeheld'); 
        child.style.position = '';
        child.style[this.property] = 'auto';
      } else {
        child.style[this.property] = position + 'px';
        position += this.gap;
        position += offset;
      }
    }
    this.placeholding = value;
  }
  return value;
};
Slideshow.prototype.setVisibility = function() {
  var scrollLeft = this.wrapper[this.scroll] - this.placeholding;
  var screenWidth = window[this.inner];
  var left = 0;
  var result = [];
  for (var i = 0, item, items = this.items; 
      item = items[i] || (this.endless && items[i - items.length]);
      i++) {
    if (item != this.items[i])
      left -= this[this.scroll];
    var offsetWidth = this[this.offsets][i]
    if ((scrollLeft > offsetWidth + left) || (scrollLeft + screenWidth < left)) {
      if (result.indexOf(item) > -1)
        result.splice(result.indexOf(item), 1);
    } else {
      if (result.indexOf(item) == -1)
        result.push(item)
    }
    left += offsetWidth + this.gap;
  }
  for (var i = 0; item = items[i]; i++) {
    var img = this.images[i] || (this.endless && this.images[i - this.images.length]);
    var visible = item.className.indexOf('visible') > -1;
    if (result.indexOf(item) > -1) {
      if (!img) {
        for (var imgs = item.getElementsByTagName('img'), j = 0, k = imgs.length; j < k; j++) {
          var img = imgs[j];
        var src = img.getAttribute('xrc');
        if (src)
          img.setAttribute('src', src);
          img.removeAttribute('xrc');
        }
      } else {
        var src = img && img.getAttribute('xrc');
        if (src) {
          img.setAttribute('src', src);
          img.removeAttribute('xrc');
        }
      }
      if (!visible)
        item.className += ' visible';
    } else {
      var src = img && img.getAttribute('src');
      if (src) {
        img.setAttribute('xrc', src);
        img.removeAttribute('src');
      }
      if (visible)
        item.className = item.className.replace(' visible', '')
    }
  }
  for (var i = 0; i < 2; i++) {
    var nextIndex = this.items.indexOf(this.selected) + i + 1;
    if (nextIndex) {
      var next = this.items[nextIndex];
      if (next) {
        var img = this.images[nextIndex];
        var src = img && img.getAttribute('xrc') 
        if (src) {
          img.setAttribute('src', src);
        }
      }
    } 
  }
}
Slideshow.prototype.getItemPosition = function(item, condition) {
  var position = 0;
  for (var i = 0, other; (other = this.items[i]) != item; i++)
    position += this[this.offsets][i] + this.gap;
  if(condition && this.endless) {
    var current = this.getItemPosition(this.selected)
    var offset = item[this.offset];
    var scroll = this[this.scroll];
    if (condition == 'previous') {
      if (position > current)
        position -= scroll;
    }
    if (condition == 'next') {
      if (position < current)
        position += scroll;
    }
    if (condition == 'nearest') {
      // if it's faster to go back through the beginning than go forward
      if (position - current > current + scroll - position) {
        position -= scroll;
      // if it's faster to go over the limits than rewind back
      } else if (current - position >= scroll - current + offset + position) {
        position += scroll;
      } else if (this.placeholding && current > position) {
        position -= scroll;
      }
    }
  }
  return position;
}
Slideshow.prototype.scrollTo = function(position, smooth, manual, element, reverse) {
  var max = this[this.scroll] - this[this.offset]
  if (position.nodeType) {
    var pos = this.getItemPosition(position, 'nearest');
    position = pos - Math.round((this[this.offset] - position[this.offset]) / 2);
    if (!this.endless)
      position = Math.round(Math.min(max, Math.max(position, 0)))
  }
  if (!smooth && this.endless) {
    if (position > max) {
      var rewind = this[this.offset] - (position - max);
      this.placehold(rewind);
      position = this.placeholding - rewind;
    } else if (position < - this[this.offset]) {
      this.placehold(0);
      position = this[this.scroll] + position;
    } else {
      position += this.placehold(Math.max(0, - position));
    }
  }
  cancelAnimationFrame(this.scrolling);
  delete this.scrolling
  delete this.busy;
  if (!element) element = this.wrapper;
  if (smooth) {
    var duration = typeof smooth == 'number' ? smooth : this.duration;
    var from = this[this.scrollNow];
    if (this.placeholding)
      from = - this.placeholding + from;
    if (position < - this[this.scroll]) {
      position += this[this.scroll];
    } else if (from < 0 && position > this[this.scroll] - this[this.offset]) {
      position -= this[this.scroll];
    }
    var start = (new Date).getTime();
    var self = this;
    var fn = function(){
      var time = new Date;
      var diff = time - start;
      var progress = Math.min(1, diff / duration);
      if (reverse) progress = 1 - progress;
      var easing = self.easing;
      if (typeof easing == 'string') {
        var timing = self.timings[easing];
        if (!timing) {
          var def = self.easings[easing];
          if (!def) def = easing.split(/\s*,\s*/).map(function(bit) {
            return parseFloat(bit)
          });
          self.timings[easing] = timing = self.bezier.apply(self, def)
        }
        easing = timing;
      }
      self.scrollTo(
        Math.round(from + (position - from) * easing(progress, duration)),
        null,
        manual,
        element,
        reverse
      );
      if (diff < duration) 
        self.scrolling = requestAnimationFrame(fn)
      else {
        delete self.scrolling;
        delete self.busy;
      }
    };
    self.scrolling = requestAnimationFrame(fn);
    self.busy = true;
  } else {
    element[this.scrollNow] = position;
    if (element == this.wrapper) 
      this[this.scrollNow] = position;
    this.setVisibility();
  }
}


Slideshow.prototype.scrollLeft = 0;
Slideshow.prototype.scrollTop = 0;
Slideshow.prototype.onImageLoad = function(image, index) {
  this.onResize(image)
};
Slideshow.prototype.scrollBarWidth = 16/*(function(wrapper) {
  wrapper.style.overflow = 'scroll'
  document.body.appendChild(wrapper);
  var width = wrapper.offsetHeight - wrapper.clientHeight
  document.body.removeChild(wrapper)
  return width;
})(document.createElement('div'));*/
Slideshow.prototype.speedup = parseFloat((location.search.match(/speedup=([\d.]+)/i) || [0,1])[1]);
Slideshow.prototype.snap = parseFloat((location.search.match(/snap=([\d.]+)/i) || [0,20])[1]);
Slideshow.prototype.gap = parseFloat((location.search.match(/gap=([\d.]+)/i) || [0,0])[1]);
Slideshow.prototype.placeholding = 0;
Slideshow.prototype.inline = true;
Slideshow.prototype.className = 
  unescape((location.search.match(/class=([^&]+)/i) || [0,''])[1]) + ' ' +
  (document.cookie.match(/sstip=(.*?)(?:$|;)/i) || [0, ''])[1]
Slideshow.prototype.onOrientationChange = function(event) {
  this.onResize(event);
}
Slideshow.prototype.onResize = function(image) {
  var innerWidth = window.innerWidth;
  var innerHeight = window.innerHeight;
  var resizing = image && (image.type == 'resize' || image.type == 'orientationchange');
  if (innerWidth == this.width && innerHeight == this.height && resizing)
    return;
  if (!this.inline && resizing) {
    this.wrapper.style.height = innerHeight + 'px';
  }
  this.width = innerWidth;
  this.height = innerHeight;
  var self = this;
  clearTimeout(this.resized);
  this.resized = setTimeout(function() {
    delete self.resized;
  }, 350)
  this.wrapper.scrollTop = 0;
  var minimized = innerWidth <= this.boundary;
  var maxWidth = this.wrapper.offsetWidth
  var total = 0;
  var maxHeight = this.inline ? Math.min(this.wrapper.offsetHeight, innerHeight) : innerHeight - this.gap * 2 - this.scrollBarWidth;
  var landscape = innerWidth > innerHeight;
  if (this.className.indexOf(' landscape') > -1) {
    if (!landscape) this.wrapper.className = this.className = this.className.replace(' landscape', '')
  } else {
    if (landscape) this.wrapper.className = this.className += ' landscape';
  }
  var items = resizing ? this.items.filter(function(item) {
    return item.className.indexOf('visible') > -1
  }) : this.items;
  if (resizing) {
    var self = this;
    clearTimeout(this.redrawing);
    var selected = this.selected;
    this.redrawing = setTimeout(function() {
      self.onResize();
      self.select(selected, true, false);
    }, 30);
  }
  for (var i = 0, item; item = items[i]; i++) {
    var index = resizing ? this.items.indexOf(item) : i;
    var img = this.images[index];
    var picture = this.pictures[index];
    var width = (img && parseInt(img.getAttribute('width'))) || item.offsetWidth;;
    var height = (img && parseInt(img.getAttribute('height'))) || item.offsetHeight;
    var meta = this.metas[index];
    var description = this.descriptions[index];
    var maxItemHeight = parseInt(R29.getComputedStyle(item, 'maxHeight', 'max-height'));
    var maxThisHeight = maxHeight;
    if (!maxItemHeight || maxItemHeight > maxThisHeight) 
      maxItemHeight = maxThisHeight;
    if (picture) {
      var scaledWidth = Math.floor(Math.min(maxWidth, width, width / height * maxItemHeight))
      var scaledHeight = this.round(scaledWidth / (width / height));
      img.style.height = scaledHeight + 'px';
    } else {
      var scaledWidth =  Math.min(maxWidth/* - this.gap * 2*/, width);
      var scaledHeight = Math.min(height, maxItemHeight, maxHeight);
      //if (!this.endless)
        item.style.height = scaledHeight + 'px';
    }
    var offsetWidth = Math.max(minimized && !this.inline ? this.width : 0, scaledWidth);
    if (!image || !image.nodeType || image == img) {
      var whitespace = Math.max(maxThisHeight - scaledHeight, 0);
      var actualWidth = offsetWidth//scaledWidth
      item.style.width = actualWidth + 'px'
    }
    this.offsetWidths[index] = offsetWidth;
    this.offsetHeights[index] = item.offsetHeight;
    total += this[this.offsets][index] + (item.className.indexOf('final') > -1 ? 0 : this.gap);
    this.scrollLeft = this.wrapper.scrollLeft;
    this.scrollTop = this.wrapper.scrollTop;
  }
  
  if (resizing) return this.select(selected, true, false);
  this.list.style[this.dimension] = (total - this.placeholding) + 'px'
  this[this.offset] = this.wrapper[this.offset];
  this[this.scroll] = this.wrapper[this.scroll];
  this.setVisibility();
};

Slideshow.prototype.getItemByPosition = function(position) {
  if (position < 0)
    position += this[this.scroll];
  for (var item, i = 0, items = this.items; 
       item = items[i] || (this.endless && items[i - items.length]);
       i++) {
    var el = item;
    var offsets = this[this.offsets];
    var width = offsets[i] ||  (this.endless && offsets[i - items.length]);
    if (position < width)
      break;
    else 
      position -= (width + this.gap);
  }
  return el;
}

Slideshow.prototype.onScroll = function(e) {
  if (this.resized  || this.clicked) return;
  if (this.blocking)
    return delete this.blocking;
  var position = this.wrapper[this.scrollNow];
  position += this.getViewportOffset(position)
  if (this.clicked) return;
  this.select(position - this.placeholding, false);
  this.setVisibility();
};

Slideshow.prototype.getViewportOffset = function(position) {
  var scroll = this[this.scroll];
  var offset = this[this.offset];
  var total = scroll - offset;
  if (this.endless)
    return offset / 2;
  if (position < offset / 4) 
    return position
  else if (total - position < offset / 3) {
    return offset * 0.8 - (total - position)
  } else
    return offset / 2
}

Slideshow.prototype.onClick = function(e, gesture) {
  for (var el = e.target; el && el.nodeType != 9; el = el.parentNode) {
    if (el.nodeType != 1) continue;
    var rel = el.getAttribute('rel');
    if (el.tagName == 'A' && (!rel || !this[rel]))
      var link = el;
    if (el.className.indexOf('picture') > -1)
      var picture = el;
    if (el.className.indexOf('panel') > -1)
      var panel = el;
    if (rel && this[rel]) 
      return this[rel](e);
    if (el.tagName == 'IMG')
      var img = el;
    if (el.tagName == 'LI') {
      if (el.className.indexOf('last') > -1 || this.endless)
        if (el !== this.selected) {
          e.preventDefault();
          var self = this;
          this.clickBlocked = true;
          this.select(el, true);
          clearTimeout(this.clickBlocking);
          return self.clickBlocking = setTimeout(function() {
            delete self.clickBlocked;
          }, 500)
        }
      var li = el;
      if (!picture && !link && !img && !panel) {
        var x = e.pageX || e.clientX;
        var width = window.innerWidth;
        if (x > width * 0.66 || x < width * 0.33)
          this.select(x > width / 2 ? 'next' : 'previous')
      }
      if (link && this.items.indexOf(el) > -1 && this.endless)
        this.stopped = true;
    } else if (el.className.indexOf('panel') > -1) {
      var target = el;
    }
  }
};

Slideshow.prototype.onTouch = function(e) {
  for (var target = e.target; target; target = target.parentNode)
    if (target.tagName == 'A' || (target.nodeType == 1 && target.getAttribute('rel')))
      break;
  if (!target && !window.scrollY)
    window.scrollTo(0, 250)
}

Slideshow.prototype.setOrientation = function(orientation) {
  this.orientation = orientation;
  this.offsets     = orientation == 'landscape' ? 'offsetWidths' : 'offsetHeights';
  this.offset      = orientation == 'landscape' ? 'offsetWidth'  : 'offsetHeight';
  this.scroll      = orientation == 'landscape' ? 'scrollWidth'  : 'scrollHeight';
  this.inner       = orientation == 'landscape' ? 'innerWidth'   : 'innerHeight';
  this.dimension   = orientation == 'landscape' ? 'width'        : 'height';
  this.padding     = orientation == 'landscape' ? 'paddingLeft'  : 'paddingTop';
  this.scrollNow   = orientation == 'landscape' ? 'scrollLeft'   : 'scrollTop';
  this.property    = orientation == 'landscape' ? 'left'         : 'top';
  this.round       = orientation == 'landscape' ? Math.ceil      : Math.floor
}
Slideshow.prototype.setOrientation('landscape');

Carousel = function() {
  Slideshow.apply(this, arguments);
};
Carousel.prototype = new Slideshow;
Carousel.prototype.endless = true;

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

Slideshow.prototype.bezier = function(p1x,p1y,p2x,p2y) {
  var ax=0,bx=0,cx=0,ay=0,by=0,cy=0;
  // `ax t^3 + bx t^2 + cx t' expanded using Horner's rule.
      function sampleCurveX(t) {return ((ax*t+bx)*t+cx)*t;};
      function sampleCurveY(t) {return ((ay*t+by)*t+cy)*t;};
      function sampleCurveDerivativeX(t) {return (3.0*ax*t+2.0*bx)*t+cx;};
  // The epsilon value to pass given that the animation is going to run over |dur| seconds. The longer the
  // animation, the more precision is needed in the timing function result to avoid ugly discontinuities.
  function solveEpsilon(duration) {return 1.0/(200.0*duration);};
      function solve(x,epsilon) {return sampleCurveY(solveCurveX(x,epsilon));};
  // Given an x value, find a parametric value it came from.
      function solveCurveX(x,epsilon) {var t0,t1,t2,x2,d2,i;
    function fabs(n) {if(n>=0) {return n;}else {return 0-n;}}; 
          // First try a few iterations of Newton's method -- normally very fast.
          for(t2=x, i=0; i<8; i++) {x2=sampleCurveX(t2)-x; if(fabs(x2)<epsilon) {return t2;} d2=sampleCurveDerivativeX(t2); if(fabs(d2)<1e-6) {break;} t2=t2-x2/d2;}
          // Fall back to the bisection method for reliability.
          t0=0.0; t1=1.0; t2=x; if(t2<t0) {return t0;} if(t2>t1) {return t1;}
          while(t0<t1) {x2=sampleCurveX(t2); if(fabs(x2-x)<epsilon) {return t2;} if(x>x2) {t0=t2;}else {t1=t2;} t2=(t1-t0)*.5+t0;}
          return t2; // Failure.
      };
  return function(t, duration) {
    // Calculate the polynomial coefficients, implicit first and last control points are (0,0) and (1,1).
    cx=3.0*p1x; bx=3.0*(p2x-p1x)-cx; ax=1.0-cx-bx; cy=3.0*p1y; by=3.0*(p2y-p1y)-cy; ay=1.0-cy-by;
  
    // Convert from input time to parametric value in curve, then from that to output time.
    return solve(t, solveEpsilon(duration || 1));
  }
};

Slideshow.prototype.easings = {
  'ease': [0.25, 0.1, 0.25, 0.1],
  'ease-in': [0.42, 0, 1, 1],
  'ease-out': [0, 0, 0.58, 1],
  'ease-in-out': [0.42, 0, 0.58, 1],
  'linear': [0, 0, 1, 1]
}
Slideshow.prototype.timings = {};
Slideshow.prototype.duration = 400;
Slideshow.prototype.easing = 'ease-out';

Hammer.Instance.prototype.trigger = function(gesture, eventData) {
  // trigger DOM event
  var event = document.createEvent('Event');
  event.initEvent(gesture, true, true);
  event.gesture = eventData;
  if (this['on' + gesture])
    this['on' + gesture](eventData);
  this.element.dispatchEvent(event);
  return this;
}