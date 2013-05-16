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
  this.menu = element.getElementsByTagName('menu')[0];
  this.last = R29.getElementsByClassName(element, 'final')[0];
  if (this.last)
    this.lastWrapper = R29.getElementsByClassName(this.last, 'wrapper')[0]
  if (options)
    for (var option in options)
      this[option] = options[option];
  // prevent scrolling underneath slideshow
  if (this.element && !this.inline) 
    this.element.addEventListener('touchmove', function(e) {
      e.preventDefault();
    }, false);
  if (this.menu) this.menu.style.marginBottom = this.scrollBarWidth + 'px'
  if (this.className)
    this.className = this.wrapper.className = this.wrapper.className + ' ' + this.className
  else
    this.className = el.wrapperement.className;
  if (this.choices) this.choice = R29.getElementsByClassName(this.choices, 'selected')[0];
  for (var children = this.list.childNodes, i = 0, child; child = children[i++];) {
    if (child.tagName != 'LI') continue;
    var picture = R29.getElementsByClassName(child, 'picture')[0];
    var meta = R29.getElementsByClassName(child, 'meta')[0];
    this.metas.push(meta);
    var description = R29.getElementsByClassName(child, 'description')[0];
    this.descriptions.push(description)
    var image = picture && picture.getElementsByTagName('img')[0];
    this.items.push(child);
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
  //this.select(this.items[0]);
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
  element.onclick = function(event) {
    event.stopPropagation();
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
    self.scrollLeftStart = self.scrollLeft - self.placeholding;
  }
  hammer.onhold = function(event) {
    self.onTouch(event);      
    for (var target = event.target; target; target = target.parentNode) {
      if (target.className && target.className.indexOf('meta') > -1) {
        self.less(self.selected, 'hold')
        return;
        break;
      }
    }
    return self.onClick(event, 'hold')
  }

  hammer.ontap = function(event) {
    self.onTouch(event);
    return self.onClick(event, 'tap')
  }

  hammer.ondrag = function(event) {
    if (self.onDrag) self.onDrag(event);
    event.preventDefault()
    console.log(event, event.velocity)
    if (event.deltaX) {
      self.scrollTo(self.scrollLeftStart - event.deltaX)
    }
  }
  
  hammer.ondragend = function(event) {
    if (self.onDragEnd)
      self.onDragEnd(event);
    var vX = event.velocityX, dX = event.deltaX;
    var x = (self.scrollLeftStart - dX) + self.offsetWidth / 2  - 400 * (dX > 0 ? vX : - vX);
    console.log(- dX - 400 * (dX > 0 ? vX : - vX))
    var item = self.getItemByX(x);
    var snap = self.getXByItem(item, dX < 0 ? 'next' : 'previous');//   + self.offsetWidth / 2;
    self.scrollTo(snap - (self.offsetWidth - item.offsetWidth) / 2, null, 800)
    delete self.scrollLeftStart;
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
Slideshow.prototype.close = function(e, gesture) {
  e.preventDefault()
  e.stopPropagation()
  if (this.expanded) 
    return this.less(this.expanded, null, gesture);
  this.fireEvent('close', gesture || e);
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
        element = this.getItemByX(element);
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
    this.scrollTo(element, 0, animate == null ? true : animate);
  }
  if (!gesture && this.selected != element && !scroll && this.openDate)
    gesture = this.items.indexOf(element) < this.selectedIndex ? 'scrollright' : 'scrollleft'
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
    if (this.expanded && this.expanded != this.selected) {
      this.less(this.expanded);
      if (this.keep) this.more(this.selected);
    }
  }
};
Slideshow.prototype.crop = function(element) {
  var max = window.innerHeight - 48;
  var height = element.offsetHeight - this.gap;
  var prev = this.items[this.items.indexOf(element) - 1];
  var next = this.items[this.items.indexOf(element) + 1];
  for (var i = 0, item; item = this.items[i++];)
    if (item != element)
      item.style.height = Math.max(max, height) / 16 + 'em';
  for (var i = 0, item; item = this.extras[i++];)
    if (item != element)
      item.style.height = Math.max(max, height) / 16 + 'em';
}
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
Slideshow.prototype.toggle = function(event) {
  if (this.expanded == this.selected)
    this.less(this.expanded, null, event);
  else
    this.more(this.selected, null, event);
}
Slideshow.prototype.more = function(element, sizing, gesture) {
  if (this.collapsing == element || element.className.indexOf('empty') > -1) return;
  if (!sizing) this.interact();
  var index = this.items.indexOf(element);
  var picture = this.pictures[index];
  var meta = this.metas[index];
  var mobile = this.className.indexOf('mobile') > -1// || window.innerHeight <= 512;
  if (meta && element.className.indexOf('minimal') == -1) {
    if (element.className.indexOf('expanded') == -1)
      element.className += ' expanded';
    var wrapper = meta.parentNode;
    var mask = R29.getElementsByClassName(meta, 'mask')[0];
    var computed = this.getComputedStyle(meta, 'minHeight', 'min-height');
    var offset = this.scrollBarWidth;
    var innerHeight = window.innerHeight
    wrapper.style.maxHeight = innerHeight - offset + 'px'
    mask.style.maxHeight = innerHeight - offset - 5 - (mobile ? -this.gap : this.gap)  + 'px';
    var offsetHeight = mask.offsetHeight;
    var larger = (offsetHeight < mask.scrollHeight);
    if (mask.className.indexOf('scrollable') == -1) {
      if (larger) mask.className += ' scrollable';
    } else {
      if (!larger) mask.className = mask.className.replace(' scrollable', '');
    }
    if (computed && computed.indexOf('%') > -1) {
      var height = (parseFloat(computed) / 100 * innerHeight);
      mask.style.height = (height - 29) + 'px';
    } else {  
      mask.style.height = 'auto';
      var height = Math.min(innerHeight - this.scrollBarWidth, mask.offsetHeight)
      if (element.className.indexOf('minimal') > -1)
        height -= 4
      computed = null;
    }
    this.paddingTop = parseInt(picture.style.paddingTop);
    if (!sizing && this.shifting && (!mobile || this.className.indexOf('fullscreen') == -1) && height > this.paddingTop) {
      var top = height - this.paddingTop + 16;
      picture.style.paddingTop = Math.max(0, this.paddingTop - top) + 'px'
      picture.style.paddingBottom = this.paddingTop * 2 - Math.max(0, this.paddingTop - top) + 'px'
    }
    if (sizing) return;
    this.expanding = element;
    if (this.collapsing == element) {
      clearTimeout(this.collapsingTimeout);
      delete this.collapsing
    }
    this.expanded = element;
    var self = this;
    clearTimeout(this.expandingTimeout);
    this.expandingTimeout = setTimeout(function() {
      delete self.expanding;
      delete self.expandingTimeout;
    }, 250)
    if (sizing !== 'fast')
      this.setOffset(wrapper, - height + (mobile ? 0 : this.gap));
    mask.scrollTop = 0;
  }
  if (gesture)
    this.fireEvent('more', gesture);
  //this.scrollTo(element, element.offsetHeight - window.innerHeight + 16, true);
}
Slideshow.prototype.less = function(element, sizing, gesture) {
  if (this.expanding == element)
    return false;
  if (sizing !== false)
    this.interact();
  var index = this.items.indexOf(element);
  var picture = this.pictures[index];
  var meta = this.metas[index];
  if (meta) {
    var mobile = this.className.indexOf('mobile') > -1;
    var wrapper = meta.parentNode;
    var mask = R29.getElementsByClassName(meta, 'mask')[0];
    if (mask.className.indexOf('scrollable') > -1)
      mask.className = mask.className.replace(' scrollable', '');
    if (mask.scrollTop)
      mask.scrollTop = 0;
    if (this.shifting && !sizing) 
      picture.style.paddingTop = picture.style.paddingBottom = this.paddingTop + 'px'
    if (this.expanded == element)
      delete this.expanded;
    this.collapsing = element;
    var self = this;
    if (sizing !== false)
      this.collapsingTimeout = setTimeout(function() {
        if (self.collapsing == element)
          delete self.collapsing;
        if (element.className.indexOf(' expanded') > -1)
          element.className = element.className.replace(' expanded', '');        
      }, 200);
    var innerHeight = window.innerHeight
    var gutter = mobile ? 0 : this.gap;
    var height = Math.min(innerHeight - this.scrollBarWidth, mask.offsetHeight) - gutter / 2
    var offset = element.className.indexOf('minimal') > -1 ?  - height  + 4: - this.offset - 1;
    this.setOffset(wrapper, offset + gutter)
    if (gesture)
      this.fireEvent('less', gesture);
  }
}
Slideshow.prototype.fireEvent = function(event, action, label, data) {

};
Slideshow.prototype.placehold = function(x) {
  var width = 0;
  var placeheld = (this.placeheld || (this.placeheld = []));
  for (var i = this.items.length; i-- && (width < x);) {
    var child = this.items[i];
    if (placeheld.indexOf(child) == -1) {
      placeheld.push(child)
      child.style.position = 'absolute';
      child.classList.add('placeheld');
    }
    width += this.offsetWidths[i] + this.gap;
  }
  if (this.placeholding != width) {
    this.list.style.paddingLeft = width + 'px';
    this.list.style.width = (this.scrollWidth - width) + 'px'
    var left = 0;
    var difference = this.placeholding - width;
    for (var i = placeheld.length, child; child = placeheld[--i];) {
      var offsetWidth = this.offsetWidths[this.items.indexOf(child)];
      if (difference >= offsetWidth) {
        difference -= offsetWidth + this.gap;
        placeheld.pop();
        child.classList.remove('placeheld'); 
        child.style.position = '';
        child.style.left = 'auto';
      } else {
        child.style.left = left + 'px';
        left += this.gap;
        left += offsetWidth;
      }
    }
    this.placeholding = width;
  }
  return width;
};
Slideshow.prototype.setOffset = function(element, value, property) {
  var property = this.property;
  if (property == null)
    property = this.property = // element.style.transform !== undefined 
                               //   ? 'transform' :
                               // element.style.webkitTransform !== undefined 
                               //   ? 'webkitTransform' :
                               'marginTop';
  var value = property == 'marginTop'
    ? value + 'px'
    : 'translateY(' + value + 'px)';
  if (element.style[property] === value)
    return false;
  element.style[property] = value;
  return true;
}
Slideshow.prototype.setVisibility = function() {
  var scrollLeft = this.wrapper.scrollLeft - this.placeholding;
  var screenWidth = window.innerWidth;
  var left = 0;
  var result = [];
  for (var i = 0, item, items = this.items; 
      item = items[i] || (this.endless && items[i - items.length]);
      i++) {
    if (item != this.items[i])
      left -= this.scrollWidth;
    var offsetWidth = this.offsetWidths[i]
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
Slideshow.prototype.getXByItem = function(item, condition) {
  var x = 0;
  for (var i = 0, other; (other = this.items[i]) != item; i++)
    x += this.offsetWidths[i] + this.gap;
  if(condition && this.endless) {
    var current = this.getXByItem(this.selected)
    var offsetWidth = item.offsetWidth;
    var scroll = this.scrollWidth;
    if (condition == 'previous') {
      if (x > current)
        x -= scroll;
    }
    if (condition == 'next') {
      if (x < current)
        x += scroll;
    }
    if (condition == 'nearest') {
      // if it's faster to go back through the beginning than go forward
      if (x - current > current + scroll - x) {
        x -= scroll;
      // if it's faster to go over the limits than rewind back
      } else if (current - x >= scroll - current + offsetWidth + x) {
        x += scroll;
      } else if (this.placeholding && current > x) {
        x -= scroll;
      }
    }
  }
  return x;
}
Slideshow.prototype.scrollTo = function(x, y, smooth, manual, element, reverse) {
  var win = Math.min(window.innerWidth, this.offsetWidth);
  var scroll = this.scrollWidth;
  var max = scroll - this.offsetWidth //- win /2 //+ this.offsetWidths[this.offsetWidths.length - 1];
  if (x && x.nodeType) {
    var left = this.getXByItem(x, 'nearest');
    x = left - Math.round((this.offsetWidth - x.offsetWidth) / 2);
    if (!this.endless)
      x = Math.round(Math.min(max, Math.max(x, 0)))
  }
  if (!smooth && this.endless) {
    if (x > max) {
      var rewind = this.offsetWidth - (x - max);
      this.placehold(rewind);
      x = this.placeholding - rewind// (x - max)
    } else if (x < - this.offsetWidth) {
      this.placehold(0);
      x = this.scrollWidth + x;
    } else {
      x += this.placehold(Math.max(0, - x));
    }
  }
  cancelAnimationFrame(this.scrolling);
  delete this.scrolling
  delete this.busy;
  if (!element) element = this.wrapper;
  if (smooth) {
    var duration = typeof smooth == 'number' ? smooth : this.duration;
    var fromX = this.scrollLeft;
    if (this.placeholding)
      fromX = - this.placeholding + fromX;
    if (x < - this.scrollWidth) {
      x += this.scrollWidth;
    } else if (fromX < 0 && x > this.scrollWidth - this.offsetWidth) {
      x -= this.scrollWidth;
    }
    var fromY = element.scrollTop;
    var start = (new Date).getTime();
    var self = this;
    var fn = function(){
      var time = new Date;
      var diff = time - start;
      var progress = Math.min(1, diff / duration);
      if (reverse) progress = 1 - progress;
      var easing = self.easing;
      if (typeof easing == 'string') {
        easing = (self.timings[easing] || (self.timings[easing] 
               = self.bezier.apply(self, self.easings[easing])))
      }
      self.scrollTo(
        x == null ? x : Math.round(fromX + (x - fromX) * easing(progress, duration)),
        y == null ? y : Math.round(fromY + (y - fromY) * easing(progress, duration)),
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
    if (x != null)
      self.busy = true;
  } else {
    if (x != null) {
      element.scrollLeft = x;
      if (element == this.wrapper) 
        this.scrollLeft = x;
    }
    if (y != null) {
      element.scrollTop = y;
      if (element == this.wrapper) 
        this.scrollTop = y;
    }
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
Slideshow.prototype.boundary = parseFloat((location.search.match(/boundary=([\d.]+)/i) || [0,641])[1])
Slideshow.prototype.speedup = parseFloat((location.search.match(/speedup=([\d.]+)/i) || [0,1])[1]);
Slideshow.prototype.offset = parseFloat((location.search.match(/offset=([\d.]+)/i) || [0,0])[1]);
Slideshow.prototype.snap = parseFloat((location.search.match(/snap=([\d.]+)/i) || [0,20])[1]);
Slideshow.prototype.gap = parseFloat((location.search.match(/gap=([\d.]+)/i) || [0,0])[1]);
Slideshow.prototype.shifting = (location.search.match(/shifting=([^&]+)/i) || [0,0])[1] != '0';
Slideshow.prototype.clicking = (location.search.match(/clicking=([^&]+)/i) || [0,'false'])[1] != 'false';
Slideshow.prototype.centering = (location.search.match(/centering=([^&]+)/i) || [0,false])[1] != 'false';
Slideshow.prototype.excluding = (location.search.match(/excluding=([^&]+)/i) || [0,true])[1] != 'false';
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
  var mobile = innerWidth <= this.boundary// || window.innerHeight <= 512;
  this.wrapper.scrollTop = 0;
  var minimized = innerWidth <= this.boundary;
  var maxWidth = this.wrapper.offsetWidth// - (mobile ? 0 : this.gap * 2) /*- this.scrollBarWidth*/
  var total = 0;
  var maxHeight = this.inline ? Math.min(this.wrapper.offsetHeight, innerHeight) : innerHeight - (mobile ? 0 : this.gap * 2) - this.scrollBarWidth;
  if (this.className.indexOf(' mobile') > -1) {
    if (!mobile) this.wrapper.className = this.className = this.className.replace(' mobile', '')
  } else {
    if (mobile) this.wrapper.className = this.className += ' mobile';
  }
  var landscape = innerWidth > innerHeight;
  if (this.className.indexOf(' landscape') > -1) {
    if (!landscape) this.wrapper.className = this.className = this.className.replace(' landscape', '')
  } else {
    if (landscape) this.wrapper.className = this.className += ' landscape';
  }
  var fontSize = parseInt(this.getComputedStyle(this.wrapper, 'fontSize', 'font-size')) || 16;
  //if (this.element.className.indexOf('resizing') == -1)
  //  this.element.className += ' resizing';
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
      //self[self.expanded == selected ? 'more' : 'less'](selected, false);
      selected.style.overflow = 'hidden';
      setTimeout(function() {
        selected.style.overflow = 'visible'
      }, 10)
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
    var maxItemHeight = parseInt(this.getComputedStyle(item, 'maxHeight', 'max-height'));
    var maxThisHeight = maxHeight;
    if (this.excluding && this.offset && picture && item.className.indexOf('empty') == -1)
      maxThisHeight -= this.offset;
    if (!maxItemHeight || maxItemHeight > maxThisHeight) 
      maxItemHeight = maxThisHeight;
    if (picture) {
      var scaledWidth = Math.floor(Math.min(maxWidth, width, width / height * maxItemHeight))
      var scaledHeight = Math.ceil(scaledWidth / (width / height));
      img.style.height = scaledHeight + 'px';
    } else {
      var scaledWidth =  Math.min(maxWidth/* - this.gap * 2*/, width);
      var scaledHeight = maxThisHeight//Math.min(height, maxItemHeight, maxHeight);
      //if (!this.endless)
        item.style.height = scaledHeight + (mobile ? 0 : this.gap) + 'px';
    }
    var offsetWidth = Math.max(minimized && !this.inline ? this.width : 0, scaledWidth);
    if (!image || !image.nodeType || image == img) {
      var whitespace = Math.max(maxThisHeight - scaledHeight, 0);
      var actualWidth = offsetWidth//scaledWidth + (mobile ? 0 : this.gap * 2);
      item.style.width = actualWidth + 'px' // fontSize + 'em';
      if (picture) {
        picture.style.maxWidth = scaledWidth + 'px'
        picture.style.paddingTop = Math.floor(whitespace / 2) + 'px';
        picture.style.paddingBottom = (this.excluding && this.offset || 0) + Math.ceil(whitespace / 2) + 'px';
      }
      if (picture) picture.style.minHeight = maxThisHeight - whitespace + 'px';
      var currentHeight = 22;
      var minimal = item.className.indexOf('minimal') > -1;
      if (description) {
        item.className += ' minimal'
        if (description.scrollHeight - currentHeight < 30) {
          if (!minimal) 
            item.className += ' minimal'
        } else {
          item.className = item.className.replace(' minimal', '');
          if (minimal) 
            item.className = item.className.replace(' minimal', '');
        }
        if (this.expanded == item) 
          this.more(item, false)
        else
          this.less(item, false);
      }
    }
    this.offsetWidths[index] = offsetWidth;
    this.offsetHeights[index] = item.offsetHeight;
    total += offsetWidth + (item.className.indexOf('final') > -1 ? 0 : this.gap);
    this.scrollLeft = this.wrapper.scrollLeft;
    this.scrollTop = this.wrapper.scrollTop;
  }
  
  if (resizing) return this.select(selected, true, false);
  //this.element.className = this.element.className.replace(' resizing', '');
  if (this.lastWrapper && (!image || !image.nodeType))
    this.lastWrapper.style.height = innerHeight - 36 + 'px';


    
  
  //if (this.selected && (!image || !image.nodeType || image == this.selected)) this.crop(this.selected)
  this.list.style.width = (total - this.placeholding) + 'px' // / 16 + 'em';
  this.offsetWidth = this.wrapper.offsetWidth //innerWidth;
  this.scrollWidth = this.wrapper.scrollWidth;
  this.setVisibility();
};

Slideshow.prototype.getItemByX = function(x) {
  var rest = x;
  if (rest < 0) {
    rest += this.scrollWidth;
  }
  for (var item, i = 0, items = this.items; 
       item = items[i] || (this.endless && items[i - items.length]);
       i++) {
    var el = item;
    var width = this.offsetWidths[i] ||  (this.endless && this.offsetWidths[i - items.length]);
    if (rest < width)
      break;
    else 
      rest -= (width + this.gap);
  }
  return el;
}

Slideshow.prototype.onScroll = function(e) {
  var self = this;
  var left = this.wrapper.scrollLeft;
  var width = window.innerWidth;
  var max = this.maxWidth || this.scrollWidth - this.offsetWidth;
  if (left < 0) left += max;
  if (this.resized  || this.clicked) return;
  if (this.blocking)
    return delete this.blocking;
  left += this.getViewportOffsetX(left)
  if (this.clicked) return;
  this.select(left - this.placeholding, false);
  this.setVisibility();
};

Slideshow.prototype.getViewportOffsetX = function(x) {
  var scroll = this.scrollWidth;
  var offsetWidth = this.offsetWidth;
  var total = scroll - offsetWidth;
  if (this.endless)
    return offsetWidth / 2;
  if (x < offsetWidth / 4) 
    return x + 3
  else if (total - x < offsetWidth / 3) {
    return offsetWidth * 0.8 - (total - x)
  } else
    return offsetWidth / 2
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
          e.stopPropagation();
          var self = this;
          this.clickBlocked = true;
          this.select(el, true);
          clearTimeout(this.clickBlocking);
          return self.clickBlocking = setTimeout(function() {
            delete self.clickBlocked;
          }, 500)
        }
      var li = el;
      if (!link && this.items.indexOf(el) > -1) {
        if (this.expanded == el) {
          if (this.clicking)
            this.less(el, undefined, gesture);
        } else { 
          if (this.selected == el) {
            if (this.clicking)
              this.more(el, undefined, gesture)
          } else {
            this.select(el, true, null, gesture);
            var selected = el;
          }
        }
        if (!this.clicking)
          this.fireEvent('tap', target || el);
      }   
      if (!picture && !link && !selected && !img && !panel) {
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
Slideshow.prototype.onMouseWheel = function(e) {
  return;
  var delta = 0;
  if (!event) event = window.event;
  if (event.wheelDelta) {
    delta = event.wheelDelta/120; 
    if (window.opera) delta = -delta;
  } else if (event.detail) {
    delta = -event.detail/3;
  }
  e.preventDefault();
  if (delta) {
    var x = Math.max(0, this.wrapper.scrollLeft - delta * 30);  
    if (x != this.scrollLeft)
      this.scrollTo(x)
  }
}

Slideshow.prototype.getComputedStyle = function(el, camelCase, hyphenated) {
  if (el.currentStyle) return el.currentStyle[camelCase];
  var defaultView = document.defaultView,
    computed = defaultView ? defaultView.getComputedStyle(el, null) : null;
  return (computed) ? computed.getPropertyValue(hyphenated) : null;
};

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