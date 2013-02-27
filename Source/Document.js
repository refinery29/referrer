R29.Document = function() {

};

R29.document = new R29.Document({
  referrer: {
    onChange: function() {
      R29.storage
    }
  },
  document: document
})