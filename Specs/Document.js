describe('R29.Document', function() {
  describe('.location', function() {
    describe('when given to R29.Events', function() {
      it ('should work transparently', function() {
        var doc = new R29.Document({
          location: '/something/index.html?utm_source=email',
          referrer: 'http://google.com?q=abc'
        });
        expect(doc.events[doc.events.length - 1].directory).toBe('something');
        expect(doc.events[doc.events.length - 1].file).toBe('index.html');
        expect(doc.referrers[doc.referrers.length - 1].host).toBe('google');
        expect(doc.referrers[doc.referrers.length - 2].host).toBe('email');
      })
    })    
  })
})