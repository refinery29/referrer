new R29.Beacon('Viglink', {
  https: '//api.viglink.com/api/vglnk.js',
  http: '//cdn.viglink.com/api/vglnk.js',
  onInitialize: function() {
    vglnk = {
      api_url: '//api.viglink.com/api',
      key: this.getID()
    }
  }
})