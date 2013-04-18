var build = function(images, gap, limit) {
  var element = document.createElement('div');
  var list = document.createElement('ul');
  element.style.overflow = 'hidden';
  element.style.width = '200px'
  element.style.position = 'relative';
  list.style.overflow = 'hidden'
  list.style.width = '2000px'
  list.style.padding = list.style.margin = 0;
  for (var i = 0; i < (limit || 3); i++) {
    var item = document.createElement('li');
    item.style.background = {0: 'orange', 1: 'blue', 2: 'red'}[i % 3];
    if (gap)
      item.style.marginRight = gap + 'px'
    if (images) {
      var picture = document.createElement('div');
      picture.className = 'picture';
      item.appendChild(picture);
      var img = document.createElement('img');
      img.style.visibility = 'hidden';
      img.style.width = '100%'
      img.style.height = 'auto';
      if (images !== true)
        for (var prop in images)
          img.setAttribute(prop, images[prop]);
      picture.appendChild(img);
    } else {
      item.style.height = '200px';
      item.style.width = '200px';
    }
    item.style['float'] = item.style['cssFloat'] = item.style['styleFloat'] = 'left';
    list.appendChild(item); 
  }
  element.appendChild(list);
  return element;
}

describe('Sideshow', function() {
  describe('when viewport matches the width of slides', function() { 
    describe('and no gap is set', function() {
      it ('should initialize slides and scroll wrapper', function() {
        var element = build();
        document.body.appendChild(element)
        var slideshow = new Slideshow(element);
        expect(slideshow.list.style.width).toBe('600px')
        expect(slideshow.list.offsetWidth).toBe(600);
        expect(slideshow.list.offsetHeight).toBe(200);
        expect(element.scrollLeft).toBe(0);
        slideshow.select('next', true, false);
        expect(element.scrollLeft).toBe(200);
        slideshow.select('next', true, false);
        expect(element.scrollLeft).toBe(400)
        slideshow.select('next', true, false);
        expect(element.scrollLeft).toBe(400)
        slideshow.select('previous', true, false);
        expect(element.scrollLeft).toBe(200)
        slideshow.select('previous', true, false);
        expect(element.scrollLeft).toBe(0)
        slideshow.select('previous', true, false);
        expect(element.scrollLeft).toBe(0)
        document.body.removeChild(element);
      })
    })
    describe('and gap is set', function() {
      it ('should set gap but keep slides the same size', function() {
        var element = build(null, 8);
        document.body.appendChild(element)
        var slideshow = new Slideshow(element, {gap: 8});
        expect(slideshow.list.style.width).toBe('624px')
        expect(slideshow.list.offsetWidth).toBe(600 + 8 * 3);
        expect(slideshow.list.offsetHeight).toBe(208);
        expect(element.scrollLeft).toBe(0);
        slideshow.select('next', true, false);
        expect(element.scrollLeft).toBe(200 + 8);
        slideshow.select('next', true, false);
        expect(element.scrollLeft).toBe(400 + 16)
        slideshow.select('next', true, false);
        expect(element.scrollLeft).toBe(400 + 16)
        slideshow.select('previous', true, false);
        expect(element.scrollLeft).toBe(200 + 8)
        slideshow.select('previous', true, false);
        expect(element.scrollLeft).toBe(0)
        slideshow.select('previous', true, false);
        expect(element.scrollLeft).toBe(0)
        document.body.removeChild(element);
      })
    })
  })

  describe('when viewport is larger than slides', function() {
    it ('should make viewpoint center around the selected slide but not at the edges', function() {
      var element = build();
      element.style.width = '300px'
      document.body.appendChild(element)
      var slideshow = new Slideshow(element);
      expect(slideshow.list.style.width).toBe('600px')
      expect(slideshow.list.offsetWidth).toBe(600);
      expect(slideshow.list.offsetHeight).toBe(200);
      expect(element.scrollLeft).toBe(0);
      slideshow.select('next', true, false);
      expect(element.scrollLeft).toBe(150);
      slideshow.select('next', true, false);
      expect(element.scrollLeft).toBe(300)
      slideshow.select('next', true, false);
      expect(element.scrollLeft).toBe(300)
      slideshow.select('previous', true, false);
      expect(element.scrollLeft).toBe(150)
      slideshow.select('previous', true, false);
      expect(element.scrollLeft).toBe(0)
      slideshow.select('previous', true, false);
      expect(element.scrollLeft).toBe(0)
      document.body.removeChild(element);
    })
  })
  describe('with picture items', function() {
    describe('exceeding the viewport size', function() {
      describe('vertically', function() {
        describe('and gap is set', function() {
          it ('should downscale pictures', function() {
            var element = build({
              src: 'http://static2.refinery29.com/bin/entry/7bf/280x335/1015527/bingedrinking-opener.jpg',
              width: 280,
              height: 335
            })
            element.style.width = '200px'
            element.style.height = '200px'
            document.body.appendChild(element)
            var slideshow = new Slideshow(element);
            expect(slideshow.images[0].getAttribute('width')).toBe('280');
            expect(slideshow.images[0].offsetWidth).toBe(167);
            expect(slideshow.images[0].getAttribute('height')).toBe('335');
            expect(slideshow.images[0].offsetHeight).toBe(200);
            expect(slideshow.scrollWidth).toBe(167*3)
            expect(slideshow.element.scrollLeft).toBe(0)
            slideshow.select('next', true, false);
            expect(slideshow.element.scrollLeft).toBe(Math.floor(167 - (200 - 167) / 2))
            slideshow.select('next', true, false);
            expect(slideshow.element.scrollLeft).toBe(167 * 2 - (200 - 167))
            slideshow.select('next', true, false);
            expect(slideshow.element.scrollLeft).toBe(167 * 2 - (200 - 167))
            slideshow.select('previous', true, false);
            expect(slideshow.element.scrollLeft).toBe(Math.floor(167 - (200 - 167) / 2))
            slideshow.select('previous', true, false);
            expect(slideshow.element.scrollLeft).toBe(0)
            document.body.removeChild(element);
          })
        })
        describe('and gap is set', function() {
          it ('should downscale pictures and have an off-screen gap', function() {
            var element = build({
              src: 'http://static2.refinery29.com/bin/entry/7bf/280x335/1015527/bingedrinking-opener.jpg',
              width: 280,
              height: 335
            }, 8)
            element.style.width = '200px'
            element.style.height = '200px'
            document.body.appendChild(element)
            var slideshow = new Slideshow(element, {
              gap: 8
            });
            expect(slideshow.images[0].getAttribute('width')).toBe('280');
            expect(slideshow.images[0].offsetWidth).toBe(167);
            expect(slideshow.images[0].getAttribute('height')).toBe('335');
            expect(slideshow.images[0].offsetHeight).toBe(200);
            expect(slideshow.scrollWidth).toBe(167 * 3 + 8 * 3)
            expect(slideshow.element.scrollLeft).toBe(0)
            slideshow.select('next', true, false);
            expect(slideshow.element.scrollLeft).toBe(Math.floor(167 - (200 - 167) / 2) + 8)
            slideshow.select('next', true, false);
            expect(slideshow.element.scrollLeft).toBe(167 * 2 - (200 - 167) + 24)
            slideshow.select('next', true, false);
            expect(slideshow.element.scrollLeft).toBe(167 * 2 - (200 - 167) + 24)
            slideshow.select('previous', true, false);
            expect(slideshow.element.scrollLeft).toBe(Math.floor(167 - (200 - 167) / 2) + 8)
            slideshow.select('previous', true, false);
            expect(slideshow.element.scrollLeft).toBe(0)
            document.body.removeChild(element);
          })
        })
      })
      describe('horizontally', function() {
        it ('should downscale pictures', function() {
          var element = build({
            src: 'http://static2.refinery29.com/bin/entry/7bf/280x335/1015527/bingedrinking-opener.jpg',
            width: 280,
            height: 335
          })
          element.style.width = '200px'
          element.style.height = '335px'
          document.body.appendChild(element)
          var slideshow = new Slideshow(element);
          expect(slideshow.images[0].getAttribute('width')).toBe('280');
          expect(slideshow.images[0].offsetWidth).toBe(200);
          expect(slideshow.images[0].getAttribute('height')).toBe('335');
          expect(slideshow.images[0].offsetHeight).toBe(240);
          expect(slideshow.scrollWidth).toBe(200*3)
          expect(slideshow.element.scrollLeft).toBe(0)
          slideshow.select('next', true, false);
          expect(slideshow.element.scrollLeft).toBe(200)
          slideshow.select('next', true, false);
          expect(slideshow.element.scrollLeft).toBe(400)
          slideshow.select('next', true, false);
          expect(slideshow.element.scrollLeft).toBe(400)
          slideshow.select('previous', true, false);
          expect(slideshow.element.scrollLeft).toBe(200)
          slideshow.select('previous', true, false);
          expect(slideshow.element.scrollLeft).toBe(0)
          document.body.removeChild(element);
        })
      })
    })
  })
})

describe('Carousel', function() {
  describe('when viewport matches the width of slides', function() { 
    describe('and no gap is set', function() {
      it ('should wrap items around', function() {
        var element = build();
        document.body.appendChild(element)
        slideshow = new Carousel(element);
        expect(slideshow.list.style.width).toBe('600px')
        expect(slideshow.list.offsetWidth).toBe(600);
        expect(slideshow.list.offsetHeight).toBe(200);
        expect(element.scrollLeft).toBe(0);
        slideshow.select('next', true, false);
        expect(element.scrollLeft).toBe(200);
        slideshow.select('next', true, false);
        expect(element.scrollLeft).toBe(400)
        slideshow.select('next', true, false);
        expect(element.scrollLeft).toBe(0)
        slideshow.select('next', true, false);
        expect(element.scrollLeft).toBe(200)
        slideshow.select('next', true, false);
        expect(element.scrollLeft).toBe(400)
        slideshow.select('next', true, false);
        expect(element.scrollLeft).toBe(0)
        expect(slideshow.placeholding).toBe(0);
        slideshow.select('previous', true, false);
        expect(slideshow.placeholding).toBe(200);
        expect(element.scrollLeft).toBe(0)
        slideshow.select('previous', true, false);
        expect(slideshow.placeholding).toBe(0);
        expect(element.scrollLeft).toBe(200)
        slideshow.select('previous', true, false);
        expect(element.scrollLeft).toBe(0)
        expect(slideshow.placeholding).toBe(0);
        slideshow.select('previous', true, false);
        expect(element.scrollLeft).toBe(0)
        expect(slideshow.placeholding).toBe(200);
        slideshow.select('previous', true, false);
        expect(element.scrollLeft).toBe(200)
        document.body.removeChild(element);
      })
    })
    describe('and gap is set', function() {
      it ('should use gap in width calculations', function() {
        var element = build(null, 8);
        document.body.appendChild(element)
        var slideshow = new Carousel(element, {gap: 8});
        expect(slideshow.list.style.width).toBe('624px')
        expect(slideshow.list.offsetWidth).toBe(208 * 3);
        expect(slideshow.list.offsetHeight).toBe(208);
        expect(element.scrollLeft).toBe(0);
        slideshow.select('next', true, false);
        expect(element.scrollLeft).toBe(200 + 8);
        slideshow.select('next', true, false);
        expect(element.scrollLeft).toBe(400 + 16)
        slideshow.select('next', true, false);
        expect(element.scrollLeft).toBe(0)
        slideshow.select('next', true, false);
        expect(element.scrollLeft).toBe(200 + 8)
        slideshow.select('previous', true, false);
        expect(element.scrollLeft).toBe(0)
        expect(slideshow.placeholding).toBe(0);
        slideshow.select('previous', true, false);
        expect(slideshow.placeholding).toBe(208);
        expect(element.scrollLeft).toBe(0)
        slideshow.select('previous', true, false);
        expect(element.scrollLeft).toBe(200 + 8)
        slideshow.select('previous', true, false);
        expect(element.scrollLeft).toBe(0)
        document.body.removeChild(element);
      })
    })
  })
  describe('when viewport is larger than slides', function() {
    it ('should make viewpoint center around the selected slide', function() {
      var element = build();
      element.style.width = '300px'
      document.body.appendChild(element)
      slideshow = new Carousel(element);
      expect(element.scrollLeft).toBe(0);
      expect(slideshow.selected).toBe(slideshow.items[0]);
      slideshow.select('next', true, false);
      expect(slideshow.selected).toBe(slideshow.items[1]);
      expect(element.scrollLeft).toBe(150);
      slideshow.select('next', true, false);
      expect(slideshow.selected).toBe(slideshow.items[2]);
      expect(element.scrollLeft).toBe(150)
      expect(slideshow.placeholding).toBe(400)
      slideshow.select('next', true, false);
      expect(element.scrollLeft).toBe(150)
      expect(slideshow.placeholding).toBe(200)
      slideshow.select('next', true, false);
      expect(element.scrollLeft).toBe(150)
      expect(slideshow.placeholding).toBe(0)
      slideshow.select('next', true, false);
      expect(element.scrollLeft).toBe(150)
      expect(slideshow.placeholding).toBe(400)
      slideshow.select('next', true, false);
      expect(element.scrollLeft).toBe(150)
      expect(slideshow.placeholding).toBe(200)
      slideshow.select('previous', true, false);
      expect(element.scrollLeft).toBe(150)
      expect(slideshow.placeholding).toBe(400)
      slideshow.select('previous', true, false);
      expect(element.scrollLeft).toBe(150)
      expect(slideshow.placeholding).toBe(0)
      slideshow.select('previous', true, false);
      expect(element.scrollLeft).toBe(150)
      expect(slideshow.placeholding).toBe(200)
      slideshow.select('previous', true, false);
      expect(element.scrollLeft).toBe(150)
      expect(slideshow.placeholding).toBe(400)
      slideshow.select('previous', true, false);
      expect(element.scrollLeft).toBe(150)
      expect(slideshow.placeholding).toBe(0)
      document.body.removeChild(element);
    })
  })
  
  describe('when slides sizes exceed viewport', function() {
    describe('vertically', function() {
      it ('should downscale pictures', function() {
        var element = build({
          src: 'http://static2.refinery29.com/bin/entry/7bf/280x335/1015527/bingedrinking-opener.jpg',
          width: 280,
          height: 335
        })
        element.style.width = '200px'
        element.style.height = '200px'
        document.body.appendChild(element)
        var slideshow = new Carousel(element);
        expect(slideshow.images[0].getAttribute('width')).toBe('280');
        expect(slideshow.images[0].offsetWidth).toBe(167);
        expect(slideshow.images[0].getAttribute('height')).toBe('335');
        expect(slideshow.images[0].offsetHeight).toBe(200);
        expect(slideshow.scrollWidth).toBe(167*3)
        expect(slideshow.element.scrollLeft).toBe(0)
        slideshow.select('next', true, false);
        expect(slideshow.element.scrollLeft).toBe(Math.floor(167 - (200 - 167) / 2))
        expect(slideshow.placeholding).toBe(0);
        slideshow.select('next', true, false);
        expect(slideshow.placeholding).toBe(334);
        expect(slideshow.element.scrollLeft).toBe(Math.floor(167 - (200 - 167) / 2))
        slideshow.select('next', true, false);
        expect(slideshow.placeholding).toBe(167);
        expect(slideshow.element.scrollLeft).toBe(Math.floor(167 - (200 - 167) / 2))
        slideshow.select('next', true, false);
        expect(slideshow.element.scrollLeft).toBe(Math.floor(167 - (200 - 167) / 2))
        expect(slideshow.placeholding).toBe(0);
        slideshow.select('previous', true, false);
        expect(slideshow.element.scrollLeft).toBe(Math.floor(167 - (200 - 167) / 2))
        expect(slideshow.placeholding).toBe(167);
        slideshow.select('previous', true, false);
        expect(slideshow.element.scrollLeft).toBe(Math.floor(167 - (200 - 167) / 2))
        expect(slideshow.placeholding).toBe(334);
        slideshow.select('previous', true, false);
        expect(slideshow.element.scrollLeft).toBe(Math.floor(167 - (200 - 167) / 2))
        expect(slideshow.placeholding).toBe(0);
        document.body.removeChild(element);
      })
      describe('and gap is set', function() {
        it ('should downscale pictures and have an off-screen gap', function() {
          var element = build({
            src: 'http://static2.refinery29.com/bin/entry/7bf/280x335/1015527/bingedrinking-opener.jpg',
            width: 280,
            height: 335
          }, 8, 7)
          element.style.width = '200px'
          element.style.height = '200px'
          document.body.appendChild(element)
          slideshow = new Carousel(element, {
            gap: 8
          });
          expect(slideshow.images[0].getAttribute('width')).toBe('280');
          expect(slideshow.images[0].offsetWidth).toBe(167);
          expect(slideshow.images[0].getAttribute('height')).toBe('335');
          expect(slideshow.images[0].offsetHeight).toBe(200);
          expect(slideshow.scrollWidth).toBe((167 + 8) * 7)
          expect(slideshow.element.scrollLeft).toBe(0)
          expect(slideshow.placeholding).toBe(0);
          slideshow.select('previous', true, false)
          expect(slideshow.placeholding).toBe((167 + 8) * 2);
          expect(slideshow.element.scrollLeft).toBe(Math.floor((167 + 8) - (200 - 167) / 2))
          slideshow.select('previous', true, false)
          expect(slideshow.placeholding).toBe(0);
          expect(slideshow.element.scrollLeft).toBe(167 * 6 + 8 * 7 - 200)
          slideshow.select('previous', true, false)
          expect(slideshow.element.scrollLeft).toBe(167 * 5 + 8 * 6 - 200)
          slideshow.select('previous', true, false)
          expect(slideshow.element.scrollLeft).toBe(167 * 4 + 8 * 5 - 200)
          slideshow.select('previous', true, false)
          expect(slideshow.element.scrollLeft).toBe(167 * 3 + 8 * 4 - 200)
          slideshow.select('previous', true, false)
          expect(slideshow.element.scrollLeft).toBe(167 * 2 + 8 * 3 - 200)
          slideshow.select('previous', true, false)
          expect(slideshow.placeholding).toBe((167 + 8));
          expect(slideshow.element.scrollLeft).toBe(Math.floor((167 + 8) - (200 - 167) / 2))
          slideshow.select('previous', true, false)
          expect(slideshow.placeholding).toBe((167 + 8) * 2);
          expect(slideshow.element.scrollLeft).toBe(Math.floor((167 + 8) - (200 - 167) / 2))
          slideshow.select('previous', true, false)
          expect(slideshow.placeholding).toBe(0);
          expect(slideshow.element.scrollLeft).toBe(167 * 6 + 8 * 7 - 200)
          slideshow.select('next', true, false)
          expect(slideshow.placeholding).toBe((167 + 8) * 2);
          expect(slideshow.element.scrollLeft).toBe(Math.floor((167 + 8) - (200 - 167) / 2))
          slideshow.select('next', true, false)
          expect(slideshow.placeholding).toBe((167 + 8));
          expect(slideshow.element.scrollLeft).toBe(Math.floor((167 + 8) - (200 - 167) / 2))
          slideshow.select('next', true, false);
          expect(slideshow.element.scrollLeft).toBe(167 * 2 + 8 * 3 - 200)
          slideshow.select('next', true, false);
          expect(slideshow.element.scrollLeft).toBe(167 * 3 + 8 * 4 - 200)
          slideshow.select('next', true, false);
          expect(slideshow.element.scrollLeft).toBe(167 * 4 + 8 * 5 - 200)
          slideshow.select('next', true, false);
          expect(slideshow.element.scrollLeft).toBe(167 * 5 + 8 * 6 - 200)
          slideshow.select('next', true, false);
          expect(slideshow.element.scrollLeft).toBe(167 * 6 + 8 * 7 - 200)
          slideshow.select('next', true, false);
          expect(slideshow.placeholding).toBe((167 + 8) * 2);
          expect(slideshow.element.scrollLeft).toBe(Math.floor((167 + 8) - (200 - 167) / 2))
          slideshow.select('next', true, false);
          expect(slideshow.placeholding).toBe((167 + 8));
          expect(slideshow.element.scrollLeft).toBe(Math.floor((167 + 8) - (200 - 167) / 2))
          slideshow.select('next', true, false);
          expect(slideshow.element.scrollLeft).toBe(167 * 2 + 8 * 3 - 200)
          slideshow.select('previous', true, false);
          expect(slideshow.placeholding).toBe((167 + 8));
          expect(slideshow.element.scrollLeft).toBe(Math.floor((167 + 8) - (200 - 167) / 2))
          slideshow.select('previous', true, false);
          expect(slideshow.placeholding).toBe((167 + 8) * 2);
          expect(slideshow.element.scrollLeft).toBe(Math.floor((167 + 8) - (200 - 167) / 2))
          slideshow.select('previous', true, false);
          expect(slideshow.element.scrollLeft).toBe(167 * 6 + 8 * 7 - 200)
          slideshow.select('previous', true, false);
          expect(slideshow.element.scrollLeft).toBe(167 * 5 + 8 * 6 - 200)
          slideshow.select('previous', true, false);
          expect(slideshow.element.scrollLeft).toBe(167 * 4 + 8 * 5 - 200)
          slideshow.select('previous', true, false);
          expect(slideshow.element.scrollLeft).toBe(167 * 3 + 8 * 4 - 200)
          slideshow.select('previous', true, false);
          expect(slideshow.element.scrollLeft).toBe(167 * 2 + 8 * 3 - 200)
          slideshow.select('previous', true, false);
          expect(slideshow.placeholding).toBe((167 + 8));
          expect(slideshow.element.scrollLeft).toBe(Math.floor((167 + 8) - (200 - 167) / 2))
          slideshow.select('previous', true, false)
          expect(slideshow.placeholding).toBe((167 + 8) * 2);
          expect(slideshow.element.scrollLeft).toBe(Math.floor((167 + 8) - (200 - 167) / 2))
          slideshow.select('previous', true, false);
          expect(slideshow.placeholding).toBe(0);
          expect(slideshow.element.scrollLeft).toBe(167 * 6 + 8 * 7 - 200)
          document.body.removeChild(element);
        })
      })
      describe('and transition is animated', function() {
        it ('should animate to the same values as if there were no transition', function() {

          var element = build({
            src: 'http://static2.refinery29.com/bin/entry/7bf/280x335/1015527/bingedrinking-opener.jpg',
            width: 280,
            height: 335
          }, 8, 7)
          element.style.width = '200px'
          element.style.height = '200px'
          document.body.appendChild(element)
          slideshow = new Carousel(element, {
            gap: 8
          });
          expect(slideshow.images[0].getAttribute('width')).toBe('280');
          expect(slideshow.images[0].offsetWidth).toBe(167);
          expect(slideshow.images[0].getAttribute('height')).toBe('335');
          expect(slideshow.images[0].offsetHeight).toBe(200);
          expect(slideshow.scrollWidth).toBe((167 + 8) * 7)
          expect(slideshow.element.scrollLeft).toBe(0)
          expect(slideshow.placeholding).toBe(0);
          slideshow.select('previous', true, 100)
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
          expect(slideshow.placeholding).toBe((167 + 8) * 2);
          expect(slideshow.element.scrollLeft).toBe(Math.floor((167 + 8) - (200 - 167) / 2))
          slideshow.select('previous', true, 100)
          })
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
          expect(slideshow.placeholding).toBe(0);
          expect(slideshow.element.scrollLeft).toBe(167 * 6 + 8 * 7 - 200)
          slideshow.select('previous', true, 100)
          })
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
          expect(slideshow.element.scrollLeft).toBe(167 * 5 + 8 * 6 - 200)
          slideshow.select('previous', true, 100)
          })
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
          expect(slideshow.element.scrollLeft).toBe(167 * 4 + 8 * 5 - 200)
          slideshow.select('previous', true, 100)
          })
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
          expect(slideshow.element.scrollLeft).toBe(167 * 3 + 8 * 4 - 200)
          slideshow.select('previous', true, 100)
          })
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
          expect(slideshow.element.scrollLeft).toBe(167 * 2 + 8 * 3 - 200)
          slideshow.select('previous', true, 100)
          })
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
          expect(slideshow.placeholding).toBe((167 + 8));
          expect(slideshow.element.scrollLeft).toBe(Math.floor((167 + 8) - (200 - 167) / 2))
          slideshow.select('previous', true, 100)
          })
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
          expect(slideshow.placeholding).toBe((167 + 8) * 2);
          expect(slideshow.element.scrollLeft).toBe(Math.floor((167 + 8) - (200 - 167) / 2))
          slideshow.select('previous', true, 100)
          })
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
          expect(slideshow.placeholding).toBe(0);
          expect(slideshow.element.scrollLeft).toBe(167 * 6 + 8 * 7 - 200)
          slideshow.select('next', true, 100)
          })
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
          expect(slideshow.placeholding).toBe((167 + 8) * 2);
          expect(slideshow.element.scrollLeft).toBe(Math.floor((167 + 8) - (200 - 167) / 2))
          slideshow.select('next', true, 100)
          })
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
          expect(slideshow.placeholding).toBe((167 + 8));
          expect(slideshow.element.scrollLeft).toBe(Math.floor((167 + 8) - (200 - 167) / 2))
          slideshow.select('next', true, 100)
          })
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
          expect(slideshow.element.scrollLeft).toBe(167 * 2 + 8 * 3 - 200)
          slideshow.select('next', true, 100)
          })
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
          expect(slideshow.element.scrollLeft).toBe(167 * 3 + 8 * 4 - 200)
          slideshow.select('next', true, 100)
          })
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
          expect(slideshow.element.scrollLeft).toBe(167 * 4 + 8 * 5 - 200)
          slideshow.select('next', true, 100)
          })
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
          expect(slideshow.element.scrollLeft).toBe(167 * 5 + 8 * 6 - 200)
          slideshow.select('next', true, 100)
          })
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
          expect(slideshow.element.scrollLeft).toBe(167 * 6 + 8 * 7 - 200)
          slideshow.select('next', true, 100)
          })
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
          expect(slideshow.placeholding).toBe((167 + 8) * 2);
          expect(slideshow.element.scrollLeft).toBe(Math.floor((167 + 8) - (200 - 167) / 2))
          slideshow.select('next', true, 100)
          })
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
          expect(slideshow.placeholding).toBe((167 + 8));
          expect(slideshow.element.scrollLeft).toBe(Math.floor((167 + 8) - (200 - 167) / 2))
          slideshow.select('next', true, 100)
          })
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
          expect(slideshow.element.scrollLeft).toBe(167 * 2 + 8 * 3 - 200)
          slideshow.select('previous', true, 100)
          })
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
          expect(slideshow.placeholding).toBe((167 + 8));
          expect(slideshow.element.scrollLeft).toBe(Math.floor((167 + 8) - (200 - 167) / 2))
          slideshow.select('previous', true, 100)
          })
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
          expect(slideshow.placeholding).toBe((167 + 8) * 2);
          expect(slideshow.element.scrollLeft).toBe(Math.floor((167 + 8) - (200 - 167) / 2))
          slideshow.select('previous', true, 100)
          })
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
          expect(slideshow.element.scrollLeft).toBe(167 * 6 + 8 * 7 - 200)
          slideshow.select('previous', true, 100)
          })
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
          expect(slideshow.element.scrollLeft).toBe(167 * 5 + 8 * 6 - 200)
          slideshow.select('previous', true, 100)
          })
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
          expect(slideshow.element.scrollLeft).toBe(167 * 4 + 8 * 5 - 200)
          slideshow.select('previous', true, 100)
          })
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
          expect(slideshow.element.scrollLeft).toBe(167 * 3 + 8 * 4 - 200)
          slideshow.select('previous', true, 100)
          })
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
          expect(slideshow.element.scrollLeft).toBe(167 * 2 + 8 * 3 - 200)
          slideshow.select('previous', true, 100)
          })
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
          expect(slideshow.placeholding).toBe((167 + 8));
          expect(slideshow.element.scrollLeft).toBe(Math.floor((167 + 8) - (200 - 167) / 2))
          slideshow.select('previous', true, 100)
          })
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
          expect(slideshow.placeholding).toBe((167 + 8) * 2);
          expect(slideshow.element.scrollLeft).toBe(Math.floor((167 + 8) - (200 - 167) / 2))
          slideshow.select('previous', true, 100)
          })
          waitsFor(function() {
            return !slideshow.scrolling
          });
          runs(function() {
           
            expect(slideshow.placeholding).toBe(0);
            expect(slideshow.element.scrollLeft).toBe(167 * 6 + 8 * 7 - 200)
            //document.body.removeChild(element);
          })
        })
      })
    })
    describe('horizontally', function() {
      it ('should downscale pictures', function() {
        var element = build({
          src: 'http://static2.refinery29.com/bin/entry/7bf/280x335/1015527/bingedrinking-opener.jpg',
          width: 280,
          height: 335
        })
        element.style.width = '200px'
        element.style.height = '335px'
        document.body.appendChild(element)
        var slideshow = new Carousel(element);
        expect(slideshow.images[0].getAttribute('width')).toBe('280');
        expect(slideshow.images[0].offsetWidth).toBe(200);
        expect(slideshow.images[0].getAttribute('height')).toBe('335');
        expect(slideshow.images[0].offsetHeight).toBe(240);
        expect(slideshow.scrollWidth).toBe(200*3)
        expect(slideshow.element.scrollLeft).toBe(0)
        slideshow.select('next', true, false);
        expect(slideshow.element.scrollLeft).toBe(200)
        slideshow.select('next', true, false);
        expect(slideshow.element.scrollLeft).toBe(400)
        slideshow.select('next', true, false);
        expect(slideshow.element.scrollLeft).toBe(0)
        slideshow.select('next', true, false);
        expect(slideshow.element.scrollLeft).toBe(200)
        slideshow.select('previous', true, false);
        expect(slideshow.element.scrollLeft).toBe(0)
        expect(slideshow.placeholding).toBe(0)
        slideshow.select('previous', true, false);
        expect(slideshow.element.scrollLeft).toBe(0)
        expect(slideshow.placeholding).toBe(200)
        slideshow.select('previous', true, false);
        expect(slideshow.element.scrollLeft).toBe(200)
        expect(slideshow.placeholding).toBe(0)
        slideshow.select('previous', true, false);
        expect(slideshow.element.scrollLeft).toBe(0)
        document.body.removeChild(element);
      })
    })
  })

  describe('wide carousel', function() {
    it ('should warp around progressively', function() {
      var element = build({
        src: 'http://static2.refinery29.com/bin/entry/7bf/280x335/1015527/bingedrinking-opener.jpg',
        width: 280,
        height: 335
      }, 0, 7)

      element.style.width = 280 * 5 + 'px'
      element.style.height = '335px'
      document.body.appendChild(element)
      slideshow = new Carousel(element);
      expect(slideshow.images[0].getAttribute('width')).toBe('280');
      expect(slideshow.images[0].offsetWidth).toBe(280);
      expect(slideshow.images[0].getAttribute('height')).toBe('335');
      expect(slideshow.images[0].offsetHeight).toBe(335);
      expect(slideshow.scrollLeft).toBe(0)
      //slideshow.scrollTo(-100)
      //expect(slideshow.scrollLeft).toBe(280 - 100)
      //expect(slideshow.placeholding).toBe(280)
      //expect(slideshow.items[6].style.left).toBe('0px');
      //slideshow.scrollTo(-280)
      //expect(slideshow.scrollLeft).toBe(280 - 280)
      //expect(slideshow.placeholding).toBe(280)
      //expect(slideshow.items[6].style.left).toBe('0px');
      //slideshow.scrollTo(-280 - 100)
      //expect(slideshow.scrollLeft).toBe(280 - 100)
      //expect(slideshow.placeholding).toBe(280 * 2)
      //expect(slideshow.items[6].style.left).toBe('280px');
      //expect(slideshow.items[5].style.left).toBe('0px');
      //slideshow.scrollTo(-280)
      //expect(slideshow.scrollLeft).toBe(280 - 280)
      //expect(slideshow.placeholding).toBe(280)
      //expect(slideshow.items[6].style.left).toBe('0px');
      //expect(slideshow.items[5].style.left).toBe('auto');
      //slideshow.scrollTo(0)
      //expect(slideshow.scrollLeft).toBe(0)
      //expect(slideshow.placeholding).toBe(0)
      //expect(slideshow.items[6].style.left).toBe('auto');
      //expect(slideshow.items[5].style.left).toBe('auto');
      //slideshow.scrollTo(560);
      //expect(slideshow.scrollLeft).toBe(560)
      //expect(slideshow.placeholding).toBe(0)
      //expect(slideshow.items[6].style.left).toBe('auto');
      //expect(slideshow.items[5].style.left).toBe('auto');
      //slideshow.scrollTo(660);
      //expect(slideshow.scrollLeft).toBe(100)
      //expect(slideshow.placeholding).toBe(1400)
      //expect(slideshow.items[6].style.left).toBe(280 * 4 + 'px');
      //expect(slideshow.items[5].style.left).toBe(280 * 3 + 'px');
      //expect(slideshow.items[4].style.left).toBe(280 * 2 + 'px');
      //expect(slideshow.items[3].style.left).toBe(280 * 1 + 'px');
      //expect(slideshow.items[2].style.left).toBe(280 * 0 + 'px');
      //expect(slideshow.items[1].style.left).toBe('');
      //slideshow.scrollTo(860);
      //expect(slideshow.items[6].style.left).toBe(280 * 3 + 'px');
      //expect(slideshow.items[5].style.left).toBe(280 * 2 + 'px');
      //expect(slideshow.items[4].style.left).toBe(280 * 1 + 'px');
      //expect(slideshow.items[3].style.left).toBe(280 * 0 + 'px');
      //expect(slideshow.items[2].style.left).toBe('auto');
      //expect(slideshow.scrollLeft).toBe(20)
      //expect(slideshow.placeholding).toBe(1120)
      expect(1).toBe(2)
    })
  })
})