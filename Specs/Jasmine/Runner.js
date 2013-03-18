var jasmineEnv = jasmine.getEnv();
jasmineEnv.updateInterval = 250;
var htmlReporter = new jasmine.HtmlReporter();
jasmineEnv.addReporter(htmlReporter);
jasmineEnv.specFilter = function(spec) {
  return htmlReporter.specFilter(spec);
};

if (typeof jasmine.TapReporter != 'undefined') {
  var tapReporter = new jasmine.TapReporter();
  jasmineEnv.addReporter(tapReporter);
}
console.log('pre onload')
window.onload = function() {
  console.log('onload', document.body)
  var preload = ['http://static2.refinery29.com/bin/entry/7bf/280x335/1015527/bingedrinking-opener.jpg']
  var preloaded = 0;
  if (location.search.indexOf('preload') == -1)
    return jasmineEnv.execute();

  preload.forEach(function(src) {
    var img = document.createElement('img');
    img.src = src
    img.onload = img.onerror = function() {
      document.body.removeChild(img)
      preloaded++;
      if (preloaded == preload.length)
        jasmineEnv.execute();
    }
    document.body.appendChild(img);
  });
}