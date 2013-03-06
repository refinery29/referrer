describe('R29.Fragment', function() {
  it ('should capture document.write()', function() {
    var ad = new R29.Fragment;
    var write = document.write;
    ad.capture();
    expect(document.write).toNotBe(write);
    document.write('<b>123</b> 123 <hr>');
    var fragment = ad.release()
    console.log(ad.childNodes)
    expect(ad.childNodes[0].tagName).toBe('B');
    expect(ad.childNodes[1].nodeType).toBe(3);
    expect(ad.childNodes[2].tagName).toBe('HR');
    expect(document.write).toBe(write);
  })

  it ('should capture document.write() and be able to use getElementById to retrieve nodes from buffer', function() {
    var ad = new R29.Fragment;
    ad.capture();
    document.write('<div id="ad_a">123<i id="ad_b"></i>33<i id="ad_c">4</i>8<em></em></div>');
    expect(ad.buffer).toBeDefined();
    var dummy = document.createElement('div');
    dummy.id = 'ad_d'
    document.body.appendChild(dummy);
    var a = ad.getElementById('ad_a')
    expect(ad.getElementById('ad_a').tagName).toBe('DIV');
    expect(ad.getElementById('ad_b').tagName).toBe('I');
    expect(ad.getElementById('ad_c').tagName).toBe('I');
    expect(ad.getElementById('ad_d')).toBe(null)
    expect(document.getElementById('ad_a').tagName).toBe('DIV');
    expect(document.getElementById('ad_b').tagName).toBe('I');
    expect(document.getElementById('ad_c').tagName).toBe('I');
    expect(document.getElementById('ad_d')).toBe(dummy)
    ad.release();
    expect(ad.getElementById('ad_a').tagName).toBe('DIV');
    expect(ad.getElementById('ad_b').tagName).toBe('I');
    expect(ad.getElementById('ad_c').tagName).toBe('I');
    expect(ad.getElementById('ad_d')).toBe(null)
    expect(document.getElementById('ad_a')).toBe(null);
    expect(document.getElementById('ad_b')).toBe(null);
    expect(document.getElementById('ad_c')).toBe(null);
    expect(document.getElementById('ad_d')).toBe(dummy)
    document.body.appendChild(ad);
    expect(ad.getElementById('ad_a')).toBe(null)
    expect(ad.getElementById('ad_b')).toBe(null)
    expect(ad.getElementById('ad_c')).toBe(null)
    expect(ad.getElementById('ad_d')).toBe(null)
    expect(document.getElementById('ad_a').tagName).toBe('DIV');
    expect(document.getElementById('ad_b').tagName).toBe('I');
    expect(document.getElementById('ad_c').tagName).toBe('I');
    expect(document.getElementById('ad_d')).toBe(dummy)
    document.body.removeChild(dummy)
    expect(document.getElementById('ad_a').tagName).toBe('DIV');
    expect(document.getElementById('ad_b').tagName).toBe('I');
    expect(document.getElementById('ad_c').tagName).toBe('I');
    expect(document.getElementById('ad_d')).toBe(null)
    document.body.removeChild(a)
    expect(document.getElementById('ad_a')).toBe(null)
    expect(document.getElementById('ad_b')).toBe(null)
    expect(document.getElementById('ad_c')).toBe(null)
    expect(document.getElementById('ad_d')).toBe(null)
  });



  it ('should capture document.write() and be able to use getElementByTagName to retrieve nodes from buffer', function() {
    var ad = new R29.Fragment;
    ad.capture();
    document.write('<div id="ad_a">123<i id="ad_b"></i>33<i id="ad_c">4</i>8<em></em></div>');
    expect(ad.buffer).toBeDefined();
    var a = ad.getElementsByTagName('*');
    expect(a[0].tagName).toBe('DIV');
    expect(a[1].tagName).toBe('I');
    expect(a[2].tagName).toBe('I');
    expect(a[3].tagName).toBe('EM');
    expect(ad.buffer).toBeUndefined();
    var a = ad.getElementsByTagName('I');
    expect(a[0].tagName).toBe('I');
    expect(a[1].tagName).toBe('I');
    expect(a[2]).toBeUndefined();
    ad.release();
    var b = ad.getElementsByTagName('*');
    expect(b[0].tagName).toBe('DIV');
    expect(b[1].tagName).toBe('I');
    expect(b[2].tagName).toBe('I');
    expect(b[3].tagName).toBe('EM');
    var a = ad.getElementsByTagName('I');
    expect(a[0].tagName).toBe('I');
    expect(a[1].tagName).toBe('I');
    expect(a[2]).toBeUndefined();
  });

  it ('should unwrap scripts', function() {
    var ad = new R29.Fragment;
    ad.capture();
    expect(window.z).toBe(undefined);
    document.write('<script>window.z = 123;</script>')
    var fragment = ad.release();
    expect(ad.childNodes[0].tagName).toBe('SCRIPT');
    expect(ad.childNodes[0].parentNode).toBe(ad)
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
    var ad = new R29.Fragment;
    ad.capture();
    expect(window._gaq).toBe(undefined);
    document.write('<script src="http://google-analytics.com/ga.js"></script>')
    var fragment = ad.release();
    expect(ad.childNodes[0].tagName).toBe('SCRIPT');
    expect(window._gaq).toBe(undefined);
    var finished = false;
    ad.evaluate(function() {
      finished = true;
      if (!window._gat) throw "GA is not initialized. Why?"
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
    var ad = new R29.Fragment;
    ad.capture();
    document.write('123<script>document.write("<script src=\\"http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js\\"></sc" + "ript>")</script>')
    document.write('321')
    expect(window.jQuery).toBeUndefined()
    var finished;
    ad.evaluate(function() {
      finished = true;
    });
    expect(ad.childNodes[0].textContent).toBe('123')
    expect(ad.childNodes[1].tagName).toBe('SCRIPT')
    expect(ad.childNodes[1].getAttribute('src')).toBe(null);
    expect(ad.childNodes[2].tagName).toBe('SCRIPT')
    expect(ad.childNodes[2].getAttribute('src')).toBe('http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js');
    expect(ad.childNodes[3].textContent).toBe('321')
    waitsFor(function() {
      return finished;
    })
    runs(function() {
      expect(window.jQuery).toBeDefined()
      delete window.jQuery
      delete window.$
    })
  })

  it ('should execute scripts that document.write() async scripts that document.write() content', function() {
    var ad = new R29.Fragment;
    ad.capture();
    document.write('123<script>document.write("<script src=\\"http://ad.doubleclick.net/adj/r29.oao/beauty/makeup;s1=beauty;s2=makeup;sponsorship=;pagetype=entry;test=;pageid=shiseido-stops-animal-testing-cosmetics;tags=;pos=middle;tile=3;dcopt=;sz=300x251;ord=1362420299507?\\"></sc" + "ript>")</script>321')
    var finished = false;
    ad.evaluate(function() {
       finished = true;
    });
    expect(ad.childNodes[0].textContent).toBe('123')
    expect(ad.childNodes[1].tagName).toBe('SCRIPT')
    expect(ad.childNodes[1].getAttribute('src')).toBe(null);
    expect(ad.childNodes[2].tagName).toBe('SCRIPT')
    expect(ad.childNodes[2].getAttribute('src')).toBe('http://ad.doubleclick.net/adj/r29.oao/beauty/makeup;s1=beauty;s2=makeup;sponsorship=;pagetype=entry;test=;pageid=shiseido-stops-animal-testing-cosmetics;tags=;pos=middle;tile=3;dcopt=;sz=300x251;ord=1362420299507?');
    expect(ad.childNodes[3].textContent).toBe('321')
    expect(finished).toBe(false)
    waitsFor(finished, function() {
      return finished;
    })
    runs(function() {
      expect(ad.childNodes[0].textContent).toBe('123')
      expect(ad.childNodes[1].tagName).toBe('SCRIPT')
      expect(ad.childNodes[1].getAttribute('src')).toBe(null);
      expect(ad.childNodes[2].tagName).toBe('SCRIPT')
      expect(ad.childNodes[2].getAttribute('src')).toBe('http://ad.doubleclick.net/adj/r29.oao/beauty/makeup;s1=beauty;s2=makeup;sponsorship=;pagetype=entry;test=;pageid=shiseido-stops-animal-testing-cosmetics;tags=;pos=middle;tile=3;dcopt=;sz=300x251;ord=1362420299507?');
      //banner that was document.written() is inserted after the script
      expect(ad.childNodes[3].tagName).toBe('A')
      expect(ad.childNodes[4].textContent).toBe('321')
    })
  })

it ('should wait for remote scripts before executing inline scripts after that', function() {
    var ad = new R29.Fragment;
    ad.capture();
    document.write('123<script>document.write("<script src=\\"http://ad.doubleclick.net/adj/r29.oao/beauty/makeup;s1=beauty;s2=makeup;sponsorship=;pagetype=entry;test=;pageid=shiseido-stops-animal-testing-cosmetics;tags=;pos=middle;tile=3;dcopt=;sz=300x251;ord=1362420299507?\\"></sc" + "ript>")</script>321<script>var z = 123</script>')
    var finished = false;
    ad.evaluate(function(stack) {
       finished = true;
    });
    expect(ad.childNodes[0].textContent).toBe('123')
    expect(ad.childNodes[1].tagName).toBe('SCRIPT')
    expect(ad.childNodes[1].getAttribute('src')).toBe(null);
    expect(ad.childNodes[2].tagName).toBe('SCRIPT')
    expect(ad.childNodes[2].getAttribute('src')).toBe('http://ad.doubleclick.net/adj/r29.oao/beauty/makeup;s1=beauty;s2=makeup;sponsorship=;pagetype=entry;test=;pageid=shiseido-stops-animal-testing-cosmetics;tags=;pos=middle;tile=3;dcopt=;sz=300x251;ord=1362420299507?');
    expect(ad.childNodes[3].textContent).toBe('321')
    expect(ad.childNodes[4].tagName).toBe('SCRIPT')
    expect(finished).toBe(false)
    expect(window.z).toBeUndefined();
    waitsFor(finished, function() {
      return finished;
    })
    runs(function() {
      expect(ad.childNodes[0].textContent).toBe('123')
      expect(ad.childNodes[1].tagName).toBe('SCRIPT')
      expect(ad.childNodes[1].getAttribute('src')).toBe(null);
      expect(ad.childNodes[2].tagName).toBe('SCRIPT')
      expect(ad.childNodes[2].getAttribute('src')).toBe('http://ad.doubleclick.net/adj/r29.oao/beauty/makeup;s1=beauty;s2=makeup;sponsorship=;pagetype=entry;test=;pageid=shiseido-stops-animal-testing-cosmetics;tags=;pos=middle;tile=3;dcopt=;sz=300x251;ord=1362420299507?');
      //banner that was document.written() is inserted after the script
      expect(ad.childNodes[3].tagName).toBe('A')
      expect(ad.childNodes[4].textContent).toBe('321')
      expect(ad.childNodes[5].tagName).toBe('SCRIPT')
      expect(window.z).toBe(123)
      delete window.z;
    })
  })

  xit ('should load multiple scripts in order', function() {
    var ad = new R29.Fragment;
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