describe('R29.Document', function() {
  describe('.location', function() {
    describe('when given to R29.Events', function() {
      it ('should work transparently', function() {
        var doc = new R29.Document({
          location: '/something/index.html'
        });
        expect(doc.events[0].directory).toBe('something');
        expect(doc.events[0].file).toBe('index.html');
      })
    })    
  })
})