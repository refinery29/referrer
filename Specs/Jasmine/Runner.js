
document.write('<style>\
body { background-color: #eeeeee; padding: 0; margin: 5px; overflow-y: scroll; }\
#HTMLReporter { font-size: 11px; font-family: Monaco, "Lucida Console", monospace; line-height: 14px; color: #333333; }\
#HTMLReporter a { text-decoration: none; }\
#HTMLReporter a:hover { text-decoration: underline; }\
#HTMLReporter p, #HTMLReporter h1, #HTMLReporter h2, #HTMLReporter h3, #HTMLReporter h4, #HTMLReporter h5, #HTMLReporter h6 { margin: 0; line-height: 14px; }\
#HTMLReporter .banner, #HTMLReporter .symbolSummary, #HTMLReporter .summary, #HTMLReporter .resultMessage, #HTMLReporter .specDetail .description, #HTMLReporter .alert .bar, #HTMLReporter .stackTrace { padding-left: 9px; padding-right: 9px; }\
#HTMLReporter #jasmine_content { position: fixed; right: 100%; }\
#HTMLReporter .version { color: #aaaaaa; }\
#HTMLReporter .banner { margin-top: 14px; }\
#HTMLReporter .duration { color: #aaaaaa; float: right; }\
#HTMLReporter .symbolSummary { overflow: hidden; *zoom: 1; margin: 14px 0; }\
#HTMLReporter .symbolSummary li { display: block; float: left; height: 7px; width: 14px; margin-bottom: 7px; font-size: 16px; }\
#HTMLReporter .symbolSummary li.passed { font-size: 14px; }\
#HTMLReporter .symbolSummary li.passed:before { color: #5e7d00; content: "v"; }\
#HTMLReporter .symbolSummary li.failed { line-height: 9px; }\
#HTMLReporter .symbolSummary li.failed:before { color: #b03911; content: "x"; font-weight: bold; margin-left: -1px; }\
#HTMLReporter .symbolSummary li.skipped { font-size: 14px; }\
#HTMLReporter .symbolSummary li.skipped:before { color: #bababa; content: "\02022"; }\
#HTMLReporter .symbolSummary li.pending { line-height: 11px; }\
#HTMLReporter .symbolSummary li.pending:before { color: #aaaaaa; content: "-"; }\
#HTMLReporter .exceptions { color: #fff; float: right; margin-top: 5px; margin-right: 5px; }\
#HTMLReporter .bar { line-height: 28px; font-size: 14px; display: block; color: #eee; }\
#HTMLReporter .runningAlert { background-color: #666666; }\
#HTMLReporter .skippedAlert { background-color: #aaaaaa; }\
#HTMLReporter .skippedAlert:first-child { background-color: #333333; }\
#HTMLReporter .skippedAlert:hover { text-decoration: none; color: white; text-decoration: underline; }\
#HTMLReporter .passingAlert { background-color: #a6b779; }\
#HTMLReporter .passingAlert:first-child { background-color: #5e7d00; }\
#HTMLReporter .failingAlert { background-color: #cf867e; }\
#HTMLReporter .failingAlert:first-child { background-color: #b03911; }\
#HTMLReporter .results { margin-top: 14px; }\
#HTMLReporter #details { display: none; }\
#HTMLReporter .resultsMenu, #HTMLReporter .resultsMenu a { background-color: #fff; color: #333333; }\
#HTMLReporter.showDetails .summaryMenuItem { font-weight: normal; text-decoration: inherit; }\
#HTMLReporter.showDetails .summaryMenuItem:hover { text-decoration: underline; }\
#HTMLReporter.showDetails .detailsMenuItem { font-weight: bold; text-decoration: underline; }\
#HTMLReporter.showDetails .summary { display: none; }\
#HTMLReporter.showDetails #details { display: block; }\
#HTMLReporter .summaryMenuItem { font-weight: bold; text-decoration: underline; }\
#HTMLReporter .summary { margin-top: 14px; }\
#HTMLReporter .summary .suite .suite, #HTMLReporter .summary .specSummary { margin-left: 14px; }\
#HTMLReporter .summary .specSummary.passed a { color: #5e7d00; }\
#HTMLReporter .summary .specSummary.failed a { color: #b03911; }\
#HTMLReporter .description + .suite { margin-top: 0; }\
#HTMLReporter .suite { margin-top: 14px; }\
#HTMLReporter .suite a { color: #333333; }\
#HTMLReporter #details .specDetail { margin-bottom: 28px; }\
#HTMLReporter #details .specDetail .description { display: block; color: white; background-color: #b03911; }\
#HTMLReporter .resultMessage { padding-top: 14px; color: #333333; }\
#HTMLReporter .resultMessage span.result { display: block; }\
#HTMLReporter .stackTrace { margin: 5px 0 0 0; max-height: 224px; overflow: auto; line-height: 18px; color: #666666; border: 1px solid #ddd; background: white; white-space: pre; }\
\
#TrivialReporter { padding: 8px 13px; position: absolute; top: 0; bottom: 0; left: 0; right: 0; overflow-y: scroll; background-color: white; font-family: "Helvetica Neue Light", "Lucida Grande", "Calibri", "Arial", sans-serif; /*.resultMessage {*/ /*white-space: pre;*/ /*}*/ }\
#TrivialReporter a:visited, #TrivialReporter a { color: #303; }\
#TrivialReporter a:hover, #TrivialReporter a:active { color: blue; }\
#TrivialReporter .run_spec { float: right; padding-right: 5px; font-size: .8em; text-decoration: none; }\
#TrivialReporter .banner { color: #303; background-color: #fef; padding: 5px; }\
#TrivialReporter .logo { float: left; font-size: 1.1em; padding-left: 5px; }\
#TrivialReporter .logo .version { font-size: .6em; padding-left: 1em; }\
#TrivialReporter .runner.running { background-color: yellow; }\
#TrivialReporter .options { text-align: right; font-size: .8em; }\
#TrivialReporter .suite { border: 1px outset gray; margin: 5px 0; padding-left: 1em; }\
#TrivialReporter .suite .suite { margin: 5px; }\
#TrivialReporter .suite.passed { background-color: #dfd; }\
#TrivialReporter .suite.failed { background-color: #fdd; }\
#TrivialReporter .spec { margin: 5px; padding-left: 1em; clear: both; }\
#TrivialReporter .spec.failed, #TrivialReporter .spec.passed, #TrivialReporter .spec.skipped { padding-bottom: 5px; border: 1px solid gray; }\
#TrivialReporter .spec.failed { background-color: #fbb; border-color: red; }\
#TrivialReporter .spec.passed { background-color: #bfb; border-color: green; }\
#TrivialReporter .spec.skipped { background-color: #bbb; }\
#TrivialReporter .messages { border-left: 1px dashed gray; padding-left: 1em; padding-right: 1em; }\
#TrivialReporter .passed { background-color: #cfc; display: none; }\
#TrivialReporter .failed { background-color: #fbb; }\
#TrivialReporter .skipped { color: #777; background-color: #eee; display: none; }\
#TrivialReporter .resultMessage span.result { display: block; line-height: 2em; color: black; }\
#TrivialReporter .resultMessage .mismatch { color: black; }\
#TrivialReporter .stackTrace { white-space: pre; font-size: .8em; margin-left: 10px; max-height: 5em; overflow: auto; border: 1px inset red; padding: 1em; background: #eef; }\
#TrivialReporter .finished-at { padding-left: 1em; font-size: .6em; }\
#TrivialReporter.show-passed .passed, #TrivialReporter.show-skipped .skipped { display: block; }\
#TrivialReporter #jasmine_content { position: fixed; right: 100%; }\
#TrivialReporter .runner { border: 1px solid gray; display: block; margin: 5px 0; padding: 2px 0 2px 10px; }\
</style>');


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
window.onload = function() {
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
