describe('R29.Ad', function() {
  it ('should capture document.write()', function() {
    var ad = new R29.Ad;
    var write = document.write;
    ad.capture();
    expect(document.write).toNotBe(write);
    document.write('<b>123</b> 123 <hr>');
    var fragment = ad.release()
    expect(ad[0].tagName).toBe('B');
    expect(ad[1].nodeType).toBe(3);
    expect(ad[2].tagName).toBe('HR');
    expect(document.write).toBe(write);
  })

  it ('should unwrap scripts', function() {
    var ad = new R29.Ad;
    ad.capture();
    expect(window.z).toBe(undefined);
    document.write('<script>window.z = 123;</script>')
    var fragment = ad.release();
    expect(ad[0].tagName).toBe('SCRIPT');
    expect(window.z).toBe(undefined);
    var finished = false;
    ad.evaluate(function() {
      finished = true;
    }, fragment);
    expect(finished).toBe(true);
    expect(window.z).toBe(123);
    delete window.z;
  })

  it ('should asynchronously load scripts', function() {
    var ad = new R29.Ad;
    ad.capture();
    expect(window._gaq).toBe(undefined);
    document.write('<script src="http://google-analytics.com/ga.js"></script>')
    var fragment = ad.release();
    expect(ad[0].tagName).toBe('SCRIPT');
    expect(window._gaq).toBe(undefined);
    var finished = false;
    ad.evaluate(function() {
      expect(window._gat).toBeDefined()
    }, fragment);
    waitsFor(function() {
      return window._gat != null;
    })
    runs(function() {
      expect(window._gat).toBeDefined()
      delete window._gat
    })
    expect(window._gat).toBe(undefined);
  })

  it ('should execute scripts that document.write() async scripts', function() {
    var ad = new R29.Ad;
    ad.capture();
    document.write('123<script>document.write("<script src=\\"http://google-analytics.com/ga.js\\"></sc" + "ript>")</script>')
    document.write('321')
    expect(window._gat).toBeUndefined()
    ad.evaluate(function() {
      expect(window._gat).toBeDefined()
      delete window._gat
    });
    expect(ad[0].textContent).toBe('123')
    expect(ad[1].tagName).toBe('SCRIPT')
    expect(ad[1].getAttribute('src')).toBe(null);
    expect(ad[2].tagName).toBe('SCRIPT')
    expect(ad[2].getAttribute('src')).toBe('http://google-analytics.com/ga.js');
    expect(ad[3].textContent).toBe('321')
  })

  it ('should execute scripts that document.write() async scripts that document.write() content', function() {
    var ad = new R29.Ad;
    ad.capture();
    document.write('123<script>document.write("<script src=\\"http://ad.doubleclick.net/adj/r29.oao/beauty/makeup;s1=beauty;s2=makeup;sponsorship=;pagetype=entry;test=;pageid=shiseido-stops-animal-testing-cosmetics;tags=;pos=middle;tile=3;dcopt=;sz=300x251;ord=1362420299507?\\"></sc" + "ript>")</script>321')
    var finished = false;
    ad.evaluate(function() {
       finished = true;
    });
    expect(ad[0].textContent).toBe('123')
    expect(ad[1].tagName).toBe('SCRIPT')
    expect(ad[1].getAttribute('src')).toBe(null);
    expect(ad[2].tagName).toBe('SCRIPT')
    expect(ad[2].getAttribute('src')).toBe('http://ad.doubleclick.net/adj/r29.oao/beauty/makeup;s1=beauty;s2=makeup;sponsorship=;pagetype=entry;test=;pageid=shiseido-stops-animal-testing-cosmetics;tags=;pos=middle;tile=3;dcopt=;sz=300x251;ord=1362420299507?');
    expect(ad[3].textContent).toBe('321')
    expect(finished).toBe(false)
    waitsFor(finished, function() {
      return finished;
    })
    runs(function() {
      expect(ad[0].textContent).toBe('123')
      expect(ad[1].tagName).toBe('SCRIPT')
      expect(ad[1].getAttribute('src')).toBe(null);
      expect(ad[2].tagName).toBe('SCRIPT')
      expect(ad[2].getAttribute('src')).toBe('http://ad.doubleclick.net/adj/r29.oao/beauty/makeup;s1=beauty;s2=makeup;sponsorship=;pagetype=entry;test=;pageid=shiseido-stops-animal-testing-cosmetics;tags=;pos=middle;tile=3;dcopt=;sz=300x251;ord=1362420299507?');
      //banner that was document.written() is inserted after the script
      expect(ad[3].tagName).toBe('A')
      expect(ad[4].textContent).toBe('321')
    })
  })

it ('should wait for remote scripts before executing inline scripts after that', function() {
    var ad = new R29.Ad;
    ad.capture();
    document.write('123<script>document.write("<script src=\\"http://ad.doubleclick.net/adj/r29.oao/beauty/makeup;s1=beauty;s2=makeup;sponsorship=;pagetype=entry;test=;pageid=shiseido-stops-animal-testing-cosmetics;tags=;pos=middle;tile=3;dcopt=;sz=300x251;ord=1362420299507?\\"></sc" + "ript>")</script>321<script>var z = 123</script>')
    var finished = false;
    ad.evaluate(function(stack) {
       finished = true;
    });
    expect(ad[0].textContent).toBe('123')
    expect(ad[1].tagName).toBe('SCRIPT')
    expect(ad[1].getAttribute('src')).toBe(null);
    expect(ad[2].tagName).toBe('SCRIPT')
    expect(ad[2].getAttribute('src')).toBe('http://ad.doubleclick.net/adj/r29.oao/beauty/makeup;s1=beauty;s2=makeup;sponsorship=;pagetype=entry;test=;pageid=shiseido-stops-animal-testing-cosmetics;tags=;pos=middle;tile=3;dcopt=;sz=300x251;ord=1362420299507?');
    expect(ad[3].textContent).toBe('321')
    expect(ad[4].tagName).toBe('SCRIPT')
    expect(finished).toBe(false)
    expect(window.z).toBeUndefined();
    waitsFor(finished, function() {
      return finished;
    })
    runs(function() {
      expect(ad[0].textContent).toBe('123')
      expect(ad[1].tagName).toBe('SCRIPT')
      expect(ad[1].getAttribute('src')).toBe(null);
      expect(ad[2].tagName).toBe('SCRIPT')
      expect(ad[2].getAttribute('src')).toBe('http://ad.doubleclick.net/adj/r29.oao/beauty/makeup;s1=beauty;s2=makeup;sponsorship=;pagetype=entry;test=;pageid=shiseido-stops-animal-testing-cosmetics;tags=;pos=middle;tile=3;dcopt=;sz=300x251;ord=1362420299507?');
      //banner that was document.written() is inserted after the script
      expect(ad[3].tagName).toBe('A')
      expect(ad[4].textContent).toBe('321')
      expect(ad[5].tagName).toBe('SCRIPT')
      expect(window.z).toBe(123)
      delete window.z;
    })
  })

  it ('should load multiple scripts in order', function() {
    var ad = new R29.Ad;
    ad.capture();
    document.write('123'
    + '<script>var before = 1</script>'
    + '<script src="http://google-analytics.com/ga.js"></script>'
    + '666'
    + '<script>var middle = 2; document.write(before)</script>'
    + '<script>document.write("<script src=\\"http://ad.doubleclick.net/adj/r29.oao/beauty/makeup;s1=beauty;s2=makeup;sponsorship=;pagetype=entry;test=;pageid=shiseido-stops-animal-testing-cosmetics;tags=;pos=middle;tile=3;dcopt=;sz=300x251;ord=1362420299507?\\"></sc" + "ript>")</script>'
    + '321'
    + '<script>var after = 3</script>')
    ad.evaluate(function() {
      finished = true;
    })
    expect(before).toBe(1);
    expect(typeof _gat == 'undefined').toBe(true)
    expect(typeof middle == 'undefined').toBe(true)
    expect(typeof after == 'undefined').toBe(true)
    expect(ad.map(function(e) {
      return e.tagName || e.textContent
    })).toEqual(['123', 'SCRIPT', 'SCRIPT', '666', 'SCRIPT', 'SCRIPT', '321', 'SCRIPT'])
    waitsFor(function() {
      return window._gat
    })
    runs(function() {
      expect(typeof _gat != 'undefined').toBe(true)
      expect(middle).toBe(2)
      expect(typeof after == 'undefined').toBe(true)
      expect(ad.map(function(e) {
        return e.tagName || e.textContent
      })).toEqual(['123', 'SCRIPT', 'SCRIPT', '666', 'SCRIPT', '1', 'SCRIPT', 'SCRIPT', '321', 'SCRIPT'])
    })

    waitsFor(function() {
      return window.after
    })
    runs(function() {
      expect(typeof _gat != 'undefined').toBe(true)
      expect(middle).toBe(2)
      expect(after).toBe(3)
      expect(ad.map(function(e) {
        return e.tagName || e.textContent
      })).toEqual(['123', 'SCRIPT', 'SCRIPT', '666', 'SCRIPT', '1', 'SCRIPT', 'SCRIPT', 'A', '321', 'SCRIPT'])
    })
  })

})