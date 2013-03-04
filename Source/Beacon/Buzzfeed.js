new R29.Beacon('Buzzfeed', {
  getURL: function() {
    return "http://ct.buzzfeed.com/wd/UserWidget?u=" + this.getDomain() + "&to=1&or=vb&wid=1&cb=" + (new Date()).getTime();
  }
})