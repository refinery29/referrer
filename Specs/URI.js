describe('R29.URI', function() {
  it('it should be location compatible', function() {
    var uri = R29.URI('http://user:password@something.domain.com/dir/file.ext?k=v#hash');
    var link = document.createElement('a');
    link.href = 'http://user:password@something.domain.com/dir/file.ext?k=v#hash';
    expect(uri.protocol).toBe('http:');
    expect(uri.protocol).toBe(link.protocol);
    expect(uri.host).toBe('something.domain.com');
    expect(uri.host).toBe(link.host);
    expect(uri.path).toBe('/dir/file.ext');
    expect(uri.pathname).toBe(link.pathname);
    expect(uri.search).toBe('?k=v');
    expect(uri.search).toBe(link.search);
    expect(uri.hash).toBe('#hash');
    expect(uri.hash).toBe(link.hash);
  });

  describe('@protocol', function() {
    it ('should be changable', function() {
      var uri = R29.URI('http://user:password@something.domain.com/dir/file.ext?k=v#hash');
      expect(uri.protocol).toBe('http:')
      expect(uri.scheme).toBe('http')
      expect(uri.origin).toBe('http://')
      var a = uri.clone({protocol: 'file:'})
      expect(a.protocol).toBe('file:')
      expect(a.scheme).toBe('file')
      expect(a.origin).toBe('file://')
      expect(a.toString()).toBe('file://user:password@something.domain.com/dir/file.ext?k=v#hash')
      var b = uri.clone({protocol: 'https'})
      expect(b.protocol).toBe('https:')
      expect(b.scheme).toBe('https')
      expect(b.origin).toBe('https://')
      expect(b.toString()).toBe('https://user:password@something.domain.com/dir/file.ext?k=v#hash')
      uri.set('protocol', 'irc://')
      expect(uri.protocol).toBe('irc:')
      expect(uri.scheme).toBe('irc')
      expect(uri.origin).toBe('irc://')
      expect(uri.toString()).toBe('irc://user:password@something.domain.com/dir/file.ext?k=v#hash')
      expect(a.toString()).toBe('file://user:password@something.domain.com/dir/file.ext?k=v#hash')
      //uri.set('protocol', '')
      //expect(a.toString()).toBe('//user:password@something.domain.com/dir/file.ext?k=v#hash')
    })
  })

  describe('@scheme', function() {
    it ('should be changable', function() {
      var uri = R29.URI('http://user:password@something.domain.com/dir/file.ext?k=v#hash');
      expect(uri.protocol).toBe('http:')
      expect(uri.scheme).toBe('http')
      expect(uri.origin).toBe('http://')
      var a = uri.clone({scheme: 'file:'})
      expect(a.protocol).toBe('file:')
      expect(a.scheme).toBe('file')
      expect(a.origin).toBe('file://')
      expect(a.toString()).toBe('file://user:password@something.domain.com/dir/file.ext?k=v#hash')
      var b = uri.clone({scheme: 'https'})
      expect(b.protocol).toBe('https:')
      expect(b.scheme).toBe('https')
      expect(b.origin).toBe('https://')
      expect(b.toString()).toBe('https://user:password@something.domain.com/dir/file.ext?k=v#hash')
      uri.set('scheme', 'irc://')
      expect(uri.protocol).toBe('irc:')
      expect(uri.scheme).toBe('irc')
      expect(uri.origin).toBe('irc://')
      expect(uri.toString()).toBe('irc://user:password@something.domain.com/dir/file.ext?k=v#hash')
      expect(a.toString()).toBe('file://user:password@something.domain.com/dir/file.ext?k=v#hash')
      //uri.set('scheme', '')
      //expect(a.toString()).toBe('//user:password@something.domain.com/dir/file.ext?k=v#hash')
    })
  })

  describe('@origin', function() {
    it ('should be changable', function() {
      var uri = R29.URI('http://user:password@something.domain.com/dir/file.ext?k=v#hash');
      expect(uri.protocol).toBe('http:')
      expect(uri.scheme).toBe('http')
      expect(uri.origin).toBe('http://')
      var a = uri.clone({scheme: 'file:'})
      expect(a.protocol).toBe('file:')
      expect(a.scheme).toBe('file')
      expect(a.origin).toBe('file://')
      expect(a.toString()).toBe('file://user:password@something.domain.com/dir/file.ext?k=v#hash')
      var b = uri.clone({scheme: 'https'})
      expect(b.protocol).toBe('https:')
      expect(b.scheme).toBe('https')
      expect(b.origin).toBe('https://')
      expect(b.toString()).toBe('https://user:password@something.domain.com/dir/file.ext?k=v#hash')
      uri.set('scheme', 'irc://')
      expect(uri.protocol).toBe('irc:')
      expect(uri.scheme).toBe('irc')
      expect(uri.origin).toBe('irc://')
      expect(uri.toString()).toBe('irc://user:password@something.domain.com/dir/file.ext?k=v#hash')
      expect(a.toString()).toBe('file://user:password@something.domain.com/dir/file.ext?k=v#hash')
      //uri.set('scheme', '')
      //expect(a.toString()).toBe('//user:password@something.domain.com/dir/file.ext?k=v#hash')
    })
  })

  describe('@user', function() {
    it ('should be changable', function() {
      var uri = R29.URI('http://user:password@something.domain.com/dir/file.ext?k=v#hash');
      expect(uri.user).toBe('user')
      var a = uri.clone({user: 'admin'})
      expect(a.toString()).toBe('http://admin:password@something.domain.com/dir/file.ext?k=v#hash')
      expect(a.user).toBe('admin')
      uri.set('user', 'hax0r')
      expect(uri.toString()).toBe('http://hax0r:password@something.domain.com/dir/file.ext?k=v#hash')
      expect(uri.user).toBe('hax0r')
    })
  })

  describe('@password', function() {
    it ('should be changable', function() {
      var uri = R29.URI('http://user:password@something.domain.com/dir/file.ext?k=v#hash');
      expect(uri.password).toBe('password')
      var a = uri.clone({password: 'passw0rd'})
      expect(a.toString()).toBe('http://user:passw0rd@something.domain.com/dir/file.ext?k=v#hash')
      expect(a.password).toBe('passw0rd')
      uri.set('password', 'p4ssword')
      expect(uri.toString()).toBe('http://user:p4ssword@something.domain.com/dir/file.ext?k=v#hash')
      expect(uri.password).toBe('p4ssword')
    })
  })

  describe('@host', function() {
    it ('should be changable', function() {
      var uri = R29.URI('http://user:password@something.domain.com/dir/file.ext?k=v#hash');
      expect(uri.host).toBe('something.domain.com')
      expect(uri.hostname).toBe('something.domain.com')
      expect(uri.domain).toBe('domain.com')
      expect(uri.zone).toBe('com')
      expect(uri.zones).toEqual(['com'])
      expect(uri.label).toBe('domain')
      expect(uri.labels).toEqual(['something', 'domain'])
      expect(uri.domains).toEqual(['something', 'domain', 'com'])
      expect(uri.subdomain).toBe('something')
      expect(uri.prefix).toBe('something');
      expect(uri.subdomains).toEqual(['something'])
      var a = uri.clone({host: 'some.other.d0main.ru'})
      expect(a.toString()).toBe('http://user:password@some.other.d0main.ru/dir/file.ext?k=v#hash');
      expect(a.host).toBe('some.other.d0main.ru')
      expect(a.hostname).toBe('some.other.d0main.ru')
      expect(a.domain).toBe('d0main.ru')
      expect(a.zone).toBe('ru')
      expect(a.zones).toEqual(['ru'])
      expect(a.label).toBe('d0main')
      expect(a.labels).toEqual(['some', 'other', 'd0main'])
      expect(a.domains).toEqual(['some', 'other', 'd0main', 'ru'])
      expect(a.subdomain).toBe('some.other')
      expect(a.prefix).toBe('some')
      expect(a.subdomains).toEqual(['some', 'other'])
      uri.set('host', 'doma1n.com.uk')
      expect(uri.toString()).toBe('http://user:password@doma1n.com.uk/dir/file.ext?k=v#hash');
      expect(uri.host).toBe('doma1n.com.uk')
      expect(uri.hostname).toBe('doma1n.com.uk')
      expect(uri.domain).toBe('doma1n.com.uk')
      expect(uri.zone).toBe('com.uk')
      expect(uri.zones).toEqual(['com', 'uk'])
      expect(uri.label).toBe('doma1n')
      expect(uri.labels).toEqual(['doma1n'])
      expect(uri.domains).toEqual(['doma1n', 'com', 'uk'])
      expect(uri.subdomain).toBeUndefined()
      expect(uri.subdomains).toBeUndefined()
      uri.set('host', 'test')
      expect(uri.toString()).toBe('http://user:password@test/dir/file.ext?k=v#hash');
      expect(uri.host).toBe('test')
      expect(uri.hostname).toBe('test')
      expect(uri.domain).toBe('test')
      expect(uri.zone).toBeUndefined()
      expect(uri.zones).toBeUndefined()
      expect(uri.label).toBe('test')
      expect(uri.labels).toEqual(['test'])
      expect(uri.domains).toEqual(['test'])
      expect(uri.subdomain).toBeUndefined()
      expect(uri.subdomains).toBeUndefined()
    })
  })

  describe('@host', function() {
    it ('should be changable', function() {
      var uri = R29.URI('http://user:password@something.domain.com/dir/file.ext?k=v#hash');
      expect(uri.host).toBe('something.domain.com')
      expect(uri.hostname).toBe('something.domain.com')
      expect(uri.domain).toBe('domain.com')
      expect(uri.zone).toBe('com')
      expect(uri.zones).toEqual(['com'])
      expect(uri.label).toBe('domain')
      expect(uri.labels).toEqual(['something', 'domain'])
      expect(uri.domains).toEqual(['something', 'domain', 'com'])
      expect(uri.subdomain).toBe('something')
      expect(uri.prefix).toBe('something')
      expect(uri.subdomains).toEqual(['something'])
      var a = uri.clone({hostname: 'some.other.d0main.ru'})
      expect(a.toString()).toBe('http://user:password@some.other.d0main.ru/dir/file.ext?k=v#hash');
      expect(a.host).toBe('some.other.d0main.ru')
      expect(a.hostname).toBe('some.other.d0main.ru')
      expect(a.domain).toBe('d0main.ru')
      expect(a.zone).toBe('ru')
      expect(a.zones).toEqual(['ru'])
      expect(a.label).toBe('d0main')
      expect(a.labels).toEqual(['some', 'other', 'd0main'])
      expect(a.domains).toEqual(['some', 'other', 'd0main', 'ru'])
      expect(a.subdomain).toBe('some.other')
      expect(a.prefix).toBe('some')
      expect(a.subdomains).toEqual(['some', 'other'])
      uri.set('hostname', 'doma1n.com.uk')
      expect(uri.toString()).toBe('http://user:password@doma1n.com.uk/dir/file.ext?k=v#hash');
      expect(uri.host).toBe('doma1n.com.uk')
      expect(uri.hostname).toBe('doma1n.com.uk')
      expect(uri.domain).toBe('doma1n.com.uk')
      expect(uri.zone).toBe('com.uk')
      expect(uri.zones).toEqual(['com', 'uk'])
      expect(uri.label).toBe('doma1n')
      expect(uri.labels).toEqual(['doma1n'])
      expect(uri.domains).toEqual(['doma1n', 'com', 'uk'])
      expect(uri.prefix).toBeUndefined();
      expect(uri.subdomain).toBeUndefined()
      expect(uri.subdomains).toBeUndefined()
      uri.set('hostname', 'test')
      expect(uri.toString()).toBe('http://user:password@test/dir/file.ext?k=v#hash');
      expect(uri.host).toBe('test')
      expect(uri.hostname).toBe('test')
      expect(uri.domain).toBe('test')
      expect(uri.zone).toBeUndefined()
      expect(uri.zones).toBeUndefined()
      expect(uri.label).toBe('test')
      expect(uri.labels).toEqual(['test'])
      expect(uri.domains).toEqual(['test'])
      expect(uri.prefix).toBeUndefined();
      expect(uri.subdomain).toBeUndefined()
      expect(uri.subdomains).toBeUndefined()
    })
  })

  describe('@subdomain', function() {
    it ('should be changable', function() {
      var uri = R29.URI('http://user:password@something.domain.com/dir/file.ext?k=v#hash');
      var a = uri.clone({subdomain: 'some.other'})
      expect(a.toString()).toBe('http://user:password@some.other.domain.com/dir/file.ext?k=v#hash');
      expect(a.host).toBe('some.other.domain.com')
      expect(a.hostname).toBe('some.other.domain.com')
      expect(a.domain).toBe('domain.com')
      expect(a.zone).toBe('com')
      expect(a.zones).toEqual(['com'])
      expect(a.label).toBe('domain')
      expect(a.labels).toEqual(['some', 'other', 'domain'])
      expect(a.domains).toEqual(['some', 'other', 'domain', 'com'])
      expect(a.subdomain).toBe('some.other')
      expect(a.prefix).toBe('some');
      expect(a.subdomains).toEqual(['some', 'other'])
      uri.set('subdomain', 'www')
      expect(uri.toString()).toBe('http://user:password@www.domain.com/dir/file.ext?k=v#hash');
      expect(uri.host).toBe('www.domain.com')
      expect(uri.hostname).toBe('www.domain.com')
      expect(uri.domain).toBe('domain.com')
      expect(uri.zone).toBe('com')
      expect(uri.zones).toEqual(['com'])
      expect(uri.label).toBe('domain')
      expect(uri.labels).toEqual(['www', 'domain'])
      expect(uri.domains).toEqual(['www', 'domain', 'com'])
      expect(uri.subdomain).toBe('www')
      expect(uri.prefix).toBe('www');
      expect(uri.subdomains).toEqual(['www'])
      uri.set('subdomain', null)
      expect(uri.toString()).toBe('http://user:password@domain.com/dir/file.ext?k=v#hash');
      expect(uri.host).toBe('domain.com')
      expect(uri.hostname).toBe('domain.com')
      expect(uri.domain).toBe('domain.com')
      expect(uri.zone).toBe('com')
      expect(uri.zones).toEqual(['com'])
      expect(uri.label).toBe('domain')
      expect(uri.labels).toEqual(['domain'])
      expect(uri.domains).toEqual(['domain', 'com'])
      expect(uri.prefix).toBeUndefined()
      expect(uri.subdomain).toBeUndefined()
      expect(uri.subdomains).toBeUndefined()
    })
  })

  describe('@subdomains', function() {
    it ('should be changable', function() {
      var uri = R29.URI('http://user:password@something.domain.com/dir/file.ext?k=v#hash');
      var a = uri.clone({subdomains: ['some', 'other']})
      expect(a.toString()).toBe('http://user:password@some.other.domain.com/dir/file.ext?k=v#hash');
      expect(a.host).toBe('some.other.domain.com')
      expect(a.hostname).toBe('some.other.domain.com')
      expect(a.domain).toBe('domain.com')
      expect(a.zone).toBe('com')
      expect(a.zones).toEqual(['com'])
      expect(a.label).toBe('domain')
      expect(a.labels).toEqual(['some', 'other', 'domain'])
      expect(a.domains).toEqual(['some', 'other', 'domain', 'com'])
      expect(a.prefix).toBe('some')
      expect(a.subdomain).toBe('some.other')
      expect(a.subdomains).toEqual(['some', 'other'])
      uri.set('subdomains', ['www'])
      expect(uri.toString()).toBe('http://user:password@www.domain.com/dir/file.ext?k=v#hash');
      expect(uri.host).toBe('www.domain.com')
      expect(uri.hostname).toBe('www.domain.com')
      expect(uri.domain).toBe('domain.com')
      expect(uri.zone).toBe('com')
      expect(uri.zones).toEqual(['com'])
      expect(uri.label).toBe('domain')
      expect(uri.labels).toEqual(['www', 'domain'])
      expect(uri.domains).toEqual(['www', 'domain', 'com'])
      expect(uri.subdomain).toBe('www')
      expect(uri.prefix).toBe('www')
      expect(uri.subdomains).toEqual(['www'])
      uri.set('subdomains', [])
      expect(uri.toString()).toBe('http://user:password@domain.com/dir/file.ext?k=v#hash');
      expect(uri.host).toBe('domain.com')
      expect(uri.hostname).toBe('domain.com')
      expect(uri.domain).toBe('domain.com')
      expect(uri.zone).toBe('com')
      expect(uri.zones).toEqual(['com'])
      expect(uri.label).toBe('domain')
      expect(uri.labels).toEqual(['domain'])
      expect(uri.domains).toEqual(['domain', 'com'])
      expect(uri.prefix).toBeUndefined()
      expect(uri.subdomain).toBeUndefined()
      expect(uri.subdomains).toBeUndefined()
    })
  })

  describe('@prefix', function() {
    it ('should be changable', function() {
      var uri = R29.URI('http://user:password@some.thing.domain.com/dir/file.ext?k=v#hash');
      var a = uri.clone({prefix: 'www'})
      expect(a.toString()).toBe('http://user:password@www.thing.domain.com/dir/file.ext?k=v#hash');
      expect(a.host).toBe('www.thing.domain.com')
      expect(a.hostname).toBe('www.thing.domain.com')
      expect(a.domain).toBe('domain.com')
      expect(a.zone).toBe('com')
      expect(a.zones).toEqual(['com'])
      expect(a.label).toBe('domain')
      expect(a.labels).toEqual(['www', 'thing', 'domain'])
      expect(a.domains).toEqual(['www', 'thing', 'domain', 'com'])
      expect(a.prefix).toBe('www')
      expect(a.subdomain).toBe('www.thing')
      expect(a.subdomains).toEqual(['www', 'thing'])
      uri.set('prefix', null)
      expect(uri.toString()).toBe('http://user:password@thing.domain.com/dir/file.ext?k=v#hash');
      expect(uri.host).toBe('thing.domain.com')
      expect(uri.hostname).toBe('thing.domain.com')
      expect(uri.domain).toBe('domain.com')
      expect(uri.zone).toBe('com')
      expect(uri.zones).toEqual(['com'])
      expect(uri.label).toBe('domain')
      expect(uri.labels).toEqual(['thing', 'domain'])
      expect(uri.domains).toEqual(['thing', 'domain', 'com'])
      expect(uri.prefix).toBe('thing')
      expect(uri.subdomain).toBe('thing')
      expect(uri.subdomains).toEqual(['thing'])
      uri.set('prefix', null)
      expect(uri.toString()).toBe('http://user:password@domain.com/dir/file.ext?k=v#hash');
      expect(uri.host).toBe('domain.com')
      expect(uri.hostname).toBe('domain.com')
      expect(uri.domain).toBe('domain.com')
      expect(uri.zone).toBe('com')
      expect(uri.zones).toEqual(['com'])
      expect(uri.label).toBe('domain')
      expect(uri.labels).toEqual(['domain'])
      expect(uri.domains).toEqual(['domain', 'com'])
      expect(uri.subdomain).toBeUndefined()
      expect(uri.prefix).toBeUndefined()
      expect(uri.subdomains).toBeUndefined()
    })
  })

  describe('@domain', function() {
    it ('should be changable', function() {
      var uri = R29.URI('http://user:password@some.other.domain.com/dir/file.ext?k=v#hash');
      var a = uri.clone({domain: ['d0main.co.uk']})
      expect(a.toString()).toBe('http://user:password@some.other.d0main.co.uk/dir/file.ext?k=v#hash');
      expect(a.host).toBe('some.other.d0main.co.uk')
      expect(a.hostname).toBe('some.other.d0main.co.uk')
      expect(a.domain).toBe('d0main.co.uk')
      expect(a.zone).toBe('co.uk')
      expect(a.zones).toEqual(['co', 'uk'])
      expect(a.label).toBe('d0main')
      expect(a.labels).toEqual(['some', 'other', 'd0main'])
      expect(a.domains).toEqual(['some', 'other', 'd0main', 'co', 'uk'])
      expect(a.prefix).toBe('some')
      expect(a.subdomain).toBe('some.other')
      expect(a.subdomains).toEqual(['some', 'other'])
      uri.set('domain', 'doma1n');
      expect(uri.toString()).toBe('http://user:password@some.other.doma1n/dir/file.ext?k=v#hash');
      expect(uri.host).toBe('some.other.doma1n')
      expect(uri.hostname).toBe('some.other.doma1n')
      expect(uri.domain).toBe('doma1n')
      expect(uri.zone).toBeUndefined()
      expect(uri.zones).toBeUndefined()
      expect(uri.label).toBe('doma1n')
      expect(uri.labels).toEqual(['some', 'other', 'doma1n'])
      expect(uri.domains).toEqual(['some', 'other', 'doma1n'])
      expect(uri.prefix).toBe('some')
      expect(uri.subdomain).toBe('some.other')
      expect(uri.subdomains).toEqual(['some', 'other'])
    })
  })

  describe('@label', function() {
    it ('should be changable', function() {
      var uri = R29.URI('http://user:password@some.other.domain.co.uk/dir/file.ext?k=v#hash');
      var a = uri.clone({label: ['d0main']})
      expect(a.toString()).toBe('http://user:password@some.other.d0main.co.uk/dir/file.ext?k=v#hash');
      expect(a.host).toBe('some.other.d0main.co.uk')
      expect(a.hostname).toBe('some.other.d0main.co.uk')
      expect(a.domain).toBe('d0main.co.uk')
      expect(a.zone).toBe('co.uk')
      expect(a.zones).toEqual(['co', 'uk'])
      expect(a.label).toBe('d0main')
      expect(a.labels).toEqual(['some', 'other', 'd0main'])
      expect(a.domains).toEqual(['some', 'other', 'd0main', 'co', 'uk'])
      expect(a.prefix).toBe('some')
      expect(a.subdomain).toBe('some.other')
      expect(a.subdomains).toEqual(['some', 'other'])
    })
  })


  describe('@zone', function() {
    it ('should be changable', function() {
      var uri = R29.URI('http://user:password@some.other.domain.co.uk/dir/file.ext?k=v#hash');
      var a = uri.clone({zone: 'com.us'})
      expect(a.toString()).toBe('http://user:password@some.other.domain.com.us/dir/file.ext?k=v#hash');
      expect(a.host).toBe('some.other.domain.com.us')
      expect(a.hostname).toBe('some.other.domain.com.us')
      expect(a.domain).toBe('domain.com.us')
      expect(a.zone).toBe('com.us')
      expect(a.zones).toEqual(['com', 'us'])
      expect(a.label).toBe('domain')
      expect(a.labels).toEqual(['some', 'other', 'domain'])
      expect(a.domains).toEqual(['some', 'other', 'domain', 'com', 'us'])
      expect(a.prefix).toBe('some')
      expect(a.subdomain).toBe('some.other')
      expect(a.subdomains).toEqual(['some', 'other'])
      uri.set('zone', 'tv')
      expect(uri.toString()).toBe('http://user:password@some.other.domain.tv/dir/file.ext?k=v#hash');
      expect(uri.host).toBe('some.other.domain.tv')
      expect(uri.hostname).toBe('some.other.domain.tv')
      expect(uri.domain).toBe('domain.tv')
      expect(uri.zone).toBe('tv')
      expect(uri.zones).toEqual(['tv'])
      expect(uri.label).toBe('domain')
      expect(uri.labels).toEqual(['some', 'other', 'domain'])
      expect(uri.domains).toEqual(['some', 'other', 'domain', 'tv'])
      expect(uri.prefix).toBe('some')
      expect(uri.subdomain).toBe('some.other')
      expect(uri.subdomains).toEqual(['some', 'other'])
      uri.set('zone', null)
      expect(uri.toString()).toBe('http://user:password@some.other.domain/dir/file.ext?k=v#hash');
      expect(uri.host).toBe('some.other.domain')
      expect(uri.hostname).toBe('some.other.domain')
      expect(uri.domain).toBe('domain')
      expect(uri.zone).toBeUndefined()
      expect(uri.zones).toBeUndefined()
      expect(uri.label).toBe('domain')
      expect(uri.labels).toEqual(['some', 'other', 'domain'])
      expect(uri.domains).toEqual(['some', 'other', 'domain'])
      expect(uri.prefix).toBe('some')
      expect(uri.subdomain).toBe('some.other')
      expect(uri.subdomains).toEqual(['some', 'other'])
    })
  })

  describe('@zones', function() {
    it ('should be changable', function() {
      var uri = R29.URI('http://user:password@some.other.domain.co.uk/dir/file.ext?k=v#hash');
      var a = uri.clone({zones: ['com', 'us']})
      expect(a.toString()).toBe('http://user:password@some.other.domain.com.us/dir/file.ext?k=v#hash');
      expect(a.host).toBe('some.other.domain.com.us')
      expect(a.hostname).toBe('some.other.domain.com.us')
      expect(a.domain).toBe('domain.com.us')
      expect(a.zone).toBe('com.us')
      expect(a.zones).toEqual(['com', 'us'])
      expect(a.label).toBe('domain')
      expect(a.labels).toEqual(['some', 'other', 'domain'])
      expect(a.domains).toEqual(['some', 'other', 'domain', 'com', 'us'])
      expect(a.prefix).toBe('some')
      expect(a.subdomain).toBe('some.other')
      expect(a.subdomains).toEqual(['some', 'other'])
      uri.set('zones', ['tv'])
      expect(uri.toString()).toBe('http://user:password@some.other.domain.tv/dir/file.ext?k=v#hash');
      expect(uri.host).toBe('some.other.domain.tv')
      expect(uri.hostname).toBe('some.other.domain.tv')
      expect(uri.domain).toBe('domain.tv')
      expect(uri.zone).toBe('tv')
      expect(uri.zones).toEqual(['tv'])
      expect(uri.label).toBe('domain')
      expect(uri.labels).toEqual(['some', 'other', 'domain'])
      expect(uri.domains).toEqual(['some', 'other', 'domain', 'tv'])
      expect(uri.prefix).toBe('some')
      expect(uri.subdomain).toBe('some.other')
      expect(uri.subdomains).toEqual(['some', 'other'])
      uri.set('zones', [])
      expect(uri.toString()).toBe('http://user:password@some.other.domain/dir/file.ext?k=v#hash');
      expect(uri.host).toBe('some.other.domain')
      expect(uri.hostname).toBe('some.other.domain')
      expect(uri.domain).toBe('domain')
      expect(uri.zone).toBeUndefined()
      expect(uri.zones).toBeUndefined()
      expect(uri.label).toBe('domain')
      expect(uri.labels).toEqual(['some', 'other', 'domain'])
      expect(uri.domains).toEqual(['some', 'other', 'domain'])
      expect(uri.prefix).toBe('some')
      expect(uri.subdomain).toBe('some.other')
      expect(uri.subdomains).toEqual(['some', 'other'])
    })
  })

  describe('@path', function() {
    it ('should be changable', function() {
      var uri = R29.URI('http://user:password@some.other.domain.us/dir/file.ext?k=v#hash');
      var a = uri.clone({path: 'deep/in/woods.xml'})
      expect(a.toString()).toBe('http://user:password@some.other.domain.us/deep/in/woods.xml?k=v#hash');
      expect(a.pathname).toBe('/deep/in/woods.xml')
      expect(a.path).toBe('/deep/in/woods.xml')
      expect(a.directory).toBe('deep/in')
      expect(a.file).toBe('woods.xml')
      expect(a.basename).toBe('woods')
      expect(a.extension).toBe('xml')
      uri.set('path', '/deep/in/forest')
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/deep/in/forest?k=v#hash');
      expect(uri.pathname).toBe('/deep/in/forest')
      expect(uri.path).toBe('/deep/in/forest')
      expect(uri.directory).toBe('deep/in')
      expect(uri.file).toBe('forest')
      expect(uri.basename).toBe('forest')
      expect(uri.extension).toBeUndefined()
      uri.set('path', '/deep/in/')
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/deep/in/?k=v#hash');
      expect(uri.pathname).toBe('/deep/in/')
      expect(uri.path).toBe('/deep/in/')
      expect(uri.directory).toBe('deep/in')
      expect(uri.file).toBeUndefined()
      expect(uri.basename).toBeUndefined()
      expect(uri.extension).toBeUndefined()
      uri.set('path', 'deep/in/')
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/deep/in/?k=v#hash');
      expect(uri.pathname).toBe('/deep/in/')
      expect(uri.path).toBe('/deep/in/')
      expect(uri.directory).toBe('deep/in')
      expect(uri.file).toBeUndefined()
      expect(uri.basename).toBeUndefined()
      expect(uri.extension).toBeUndefined()
      uri.set('path', 'deep/')
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/deep/?k=v#hash');
      expect(uri.pathname).toBe('/deep/')
      expect(uri.path).toBe('/deep/')
      expect(uri.directory).toBe('deep')
      expect(uri.file).toBeUndefined()
      expect(uri.basename).toBeUndefined()
      expect(uri.extension).toBeUndefined()
      uri.set('path', 'deep')
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/deep?k=v#hash');
      expect(uri.pathname).toBe('/deep')
      expect(uri.path).toBe('/deep')
      expect(uri.directory).toBe(undefined)
      expect(uri.file).toBe('deep')
      expect(uri.basename).toBe('deep')
      expect(uri.extension).toBeUndefined()
      uri.set('path', '/')
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/?k=v#hash');
      expect(uri.pathname).toBe('/')
      expect(uri.path).toBe('/')
      expect(uri.directory).toBe('')
      expect(uri.file).toBeUndefined()
      expect(uri.basename).toBeUndefined()
      expect(uri.extension).toBeUndefined()
      uri.set('path', '')
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us?k=v#hash');
      expect(uri.pathname).toBe('/')
      expect(uri.path).toBe('/')
      expect(uri.directory).toBeUndefined()
      expect(uri.file).toBeUndefined()
      expect(uri.basename).toBeUndefined()
      expect(uri.extension).toBeUndefined()
    })
  })

describe('@pathname', function() {
    it ('should be changable', function() {
      var uri = R29.URI('http://user:password@some.other.domain.us/dir/file.ext?k=v#hash');
      var a = uri.clone({path: 'deep/in/woods.xml'})
      expect(a.toString()).toBe('http://user:password@some.other.domain.us/deep/in/woods.xml?k=v#hash');
      expect(a.pathname).toBe('/deep/in/woods.xml')
      expect(a.path).toBe('/deep/in/woods.xml')
      expect(a.directory).toBe('deep/in')
      expect(a.file).toBe('woods.xml')
      expect(a.basename).toBe('woods')
      expect(a.extension).toBe('xml')
      uri.set('path', '/deep/in/forest')
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/deep/in/forest?k=v#hash');
      expect(uri.pathname).toBe('/deep/in/forest')
      expect(uri.path).toBe('/deep/in/forest')
      expect(uri.directory).toBe('deep/in')
      expect(uri.file).toBe('forest')
      expect(uri.basename).toBe('forest')
      expect(uri.extension).toBeUndefined()
      uri.set('path', '/deep/in/')
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/deep/in/?k=v#hash');
      expect(uri.pathname).toBe('/deep/in/')
      expect(uri.path).toBe('/deep/in/')
      expect(uri.directory).toBe('deep/in')
      expect(uri.file).toBeUndefined()
      expect(uri.basename).toBeUndefined()
      expect(uri.extension).toBeUndefined()
      uri.set('path', 'deep/in/')
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/deep/in/?k=v#hash');
      expect(uri.pathname).toBe('/deep/in/')
      expect(uri.path).toBe('/deep/in/')
      expect(uri.directory).toBe('deep/in')
      expect(uri.file).toBeUndefined()
      expect(uri.basename).toBeUndefined()
      expect(uri.extension).toBeUndefined()
      uri.set('path', 'deep/')
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/deep/?k=v#hash');
      expect(uri.pathname).toBe('/deep/')
      expect(uri.path).toBe('/deep/')
      expect(uri.directory).toBe('deep')
      expect(uri.file).toBeUndefined()
      expect(uri.basename).toBeUndefined()
      expect(uri.extension).toBeUndefined()
      uri.set('path', 'deep')
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/deep?k=v#hash');
      expect(uri.pathname).toBe('/deep')
      expect(uri.path).toBe('/deep')
      expect(uri.directory).toBe(undefined)
      expect(uri.file).toBe('deep')
      expect(uri.basename).toBe('deep')
      expect(uri.extension).toBeUndefined()
      uri.set('path', '/')
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/?k=v#hash');
      expect(uri.pathname).toBe('/')
      expect(uri.path).toBe('/')
      expect(uri.directory).toBe('')
      expect(uri.file).toBeUndefined()
      expect(uri.basename).toBeUndefined()
      expect(uri.extension).toBeUndefined()
      uri.set('path', '')
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us?k=v#hash');
      expect(uri.pathname).toBe('/')
      expect(uri.path).toBe('/')
      expect(uri.directory).toBeUndefined()
      expect(uri.file).toBeUndefined()
      expect(uri.basename).toBeUndefined()
      expect(uri.extension).toBeUndefined()
    })
  })

  describe('@directory', function() {
    it ('should be changable', function() {
      var uri = R29.URI('http://user:password@some.other.domain.us/dir/file.ext?k=v#hash');
      var a = uri.clone({directory: 'deep/in/woods/'})
      expect(a.toString()).toBe('http://user:password@some.other.domain.us/deep/in/woods/file.ext?k=v#hash');
      expect(a.pathname).toBe('/deep/in/woods/file.ext')
      expect(a.path).toBe('/deep/in/woods/file.ext')
      expect(a.directory).toBe('deep/in/woods')
      expect(a.file).toBe('file.ext')
      expect(a.basename).toBe('file')
      expect(a.extension).toBe('ext')
      uri.set('directory', 'deep/in/woods')
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/deep/in/woods/file.ext?k=v#hash');
      expect(uri.pathname).toBe('/deep/in/woods/file.ext')
      expect(uri.path).toBe('/deep/in/woods/file.ext')
      expect(uri.directory).toBe('deep/in/woods')
      expect(uri.file).toBe('file.ext')
      expect(uri.basename).toBe('file')
      expect(uri.extension).toBe('ext')
      uri.set('directory', 'deep/')
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/deep/file.ext?k=v#hash');
      expect(uri.pathname).toBe('/deep/file.ext')
      expect(uri.path).toBe('/deep/file.ext')
      expect(uri.directory).toBe('deep')
      expect(uri.file).toBe('file.ext')
      expect(uri.basename).toBe('file')
      expect(uri.extension).toBe('ext')
      uri.set('directory', 'deep')
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/deep/file.ext?k=v#hash');
      expect(uri.pathname).toBe('/deep/file.ext')
      expect(uri.path).toBe('/deep/file.ext')
      expect(uri.directory).toBe('deep')
      expect(uri.file).toBe('file.ext')
      expect(uri.basename).toBe('file')
      expect(uri.extension).toBe('ext')
      uri.set('directory', '/')
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/file.ext?k=v#hash');
      expect(uri.pathname).toBe('/file.ext')
      expect(uri.path).toBe('/file.ext')
      expect(uri.directory).toBeUndefined()
      expect(uri.file).toBe('file.ext')
      expect(uri.basename).toBe('file')
      expect(uri.extension).toBe('ext')
      uri.set('directory', '')
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/file.ext?k=v#hash');
      expect(uri.pathname).toBe('/file.ext')
      expect(uri.path).toBe('/file.ext')
      expect(uri.directory).toBeUndefined()
      expect(uri.file).toBe('file.ext')
      expect(uri.basename).toBe('file')
      expect(uri.extension).toBe('ext')
      uri.set('directory', null)
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/file.ext?k=v#hash');
      expect(uri.pathname).toBe('/file.ext')
      expect(uri.path).toBe('/file.ext')
      expect(uri.directory).toBeUndefined()
      expect(uri.file).toBe('file.ext')
      expect(uri.basename).toBe('file')
      expect(uri.extension).toBe('ext')
    })
  })

  describe('@file', function() {
    it ('should be changable', function() {
      var uri = R29.URI('http://user:password@some.other.domain.us/dir/file.ext?k=v#hash');
      var a = uri.clone({file: 'thing.xml'})
      expect(a.toString()).toBe('http://user:password@some.other.domain.us/dir/thing.xml?k=v#hash')
      expect(a.basename).toBe('thing');
      expect(a.extension).toBe('xml');
      uri.set('file', 'stuff');
      expect(uri.basename).toBe('stuff');
      expect(uri.extension).toBeUndefined()
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/dir/stuff?k=v#hash')
      uri.set('file', '');
      expect(uri.basename).toBeUndefined()
      expect(uri.extension).toBeUndefined()
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/dir/?k=v#hash')
      uri.set('file', null);
      expect(uri.basename).toBeUndefined()
      expect(uri.extension).toBeUndefined()
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/dir/?k=v#hash')
    })
  })


  describe('@basename', function() {
    it ('should be changable', function() {
      var uri = R29.URI('http://user:password@some.other.domain.us/dir/file.xml?k=v#hash');
      var a = uri.clone({basename: 'thang'})
      expect(a.toString()).toBe('http://user:password@some.other.domain.us/dir/thang.xml?k=v#hash')
      expect(a.basename).toBe('thang');
      expect(a.extension).toBe('xml');
      expect(a.file).toBe('thang.xml');
      uri.set('basename', 'phile');
      expect(uri.basename).toBe('phile');
      expect(uri.extension).toBe('xml')
      expect(uri.file).toBe('phile.xml');
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/dir/phile.xml?k=v#hash')
      uri.set('basename', '');
      expect(uri.basename).toBeUndefined()
      expect(uri.file).toBeUndefined();
      expect(uri.extension).toBeUndefined('xml')
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/dir/?k=v#hash')
      uri.set('basename', null);
      expect(uri.basename).toBeUndefined()
      expect(uri.file).toBeUndefined();
      expect(uri.extension).toBeUndefined('xml')
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/dir/?k=v#hash')
    })
  })

  describe('@extension', function() {
    it ('should be changable', function() {
      var uri = R29.URI('http://user:password@some.other.domain.us/dir/file.xml?k=v#hash');
      var a = uri.clone({extension: 'gz'})
      expect(a.toString()).toBe('http://user:password@some.other.domain.us/dir/file.gz?k=v#hash')
      expect(a.basename).toBe('file');
      expect(a.extension).toBe('gz');
      expect(a.file).toBe('file.gz');
      uri.set('extension', 'txt');
      expect(uri.basename).toBe('file');
      expect(uri.extension).toBe('txt')
      expect(uri.file).toBe('file.txt');
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/dir/file.txt?k=v#hash')
      uri.set('extension', '');
      expect(uri.basename).toBe('file')
      expect(uri.file).toBe('file');
      expect(uri.extension).toBeUndefined()
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/dir/file?k=v#hash')
      uri.set('extension', null);
      expect(uri.basename).toBe('file')
      expect(uri.file).toBe('file');
      expect(uri.extension).toBeUndefined()
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/dir/file?k=v#hash')
    })
  })

  describe('@query', function() {
    it ('should be changable', function() {
      var uri = R29.URI('http://user:password@some.other.domain.us/dir/file.gz?k=v&z=2&c[]=1&c[1]=2&c[2]=g#hash');
      expect(uri.data).toEqual({k: 'v', z: '2', c: ['1', '2', 'g']})
      var a = uri.clone({query: '?hey'})
      expect(a.toString()).toBe('http://user:password@some.other.domain.us/dir/file.gz?hey#hash')
      expect(a.query).toBe('hey')
      expect(a.search).toBe('?hey')
      expect(a.data).toEqual({hey: undefined})
      uri.set('query', 'a=z');
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/dir/file.gz?a=z#hash')
      expect(uri.query).toBe('a=z')
      expect(uri.search).toBe('?a=z')
      expect(uri.data).toEqual({a: 'z'})
      uri.set('query', '');
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/dir/file.gz?#hash')
      expect(uri.query).toBe('')
      expect(uri.search).toBe('?')
      expect(uri.data).toEqual({})
      uri.set('query', null);
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/dir/file.gz#hash')
      expect(uri.query).toBeUndefined()
      expect(uri.search).toBeUndefined()
    })
  })


  describe('@search', function() {
    it ('should be changable', function() {
      var uri = R29.URI('http://user:password@some.other.domain.us/dir/file.gz?k=v&z=2&c[]=1&c[1]=2&c[2]=g#hash');
      expect(uri.data).toEqual({k: 'v', z: '2', c: ['1', '2', 'g']})
      var a = uri.clone({search: '?hey'})
      expect(a.toString()).toBe('http://user:password@some.other.domain.us/dir/file.gz?hey#hash')
      expect(a.query).toBe('hey')
      expect(a.search).toBe('?hey')
      expect(a.data).toEqual({hey: undefined})
      uri.set('search', 'a=z');
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/dir/file.gz?a=z#hash')
      expect(uri.query).toBe('a=z')
      expect(uri.search).toBe('?a=z')
      expect(uri.data).toEqual({a: 'z'})
      uri.set('search', '');
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/dir/file.gz?#hash')
      expect(uri.query).toBe('')
      expect(uri.search).toBe('?')
      expect(uri.data).toEqual({})
      uri.set('search', null);
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/dir/file.gz#hash')
      expect(uri.query).toBeUndefined()
      expect(uri.search).toBeUndefined()
    })
  })

  describe('@data', function() {
    it ('should be changable', function() {
      var uri = R29.URI('http://user:password@some.other.domain.us/dir/file.gz?hey#hash')
      uri.set('data', {a: 'lol', b: 2, c: [1,2,3]})
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/dir/file.gz?a=lol&b=2&c[]=1&c[]=2&c[]=3#hash')
      uri.set('data', {a: undefined})
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/dir/file.gz?a=undefined#hash')
      uri.set('data', null)
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/dir/file.gz#hash')
    })
  })

  describe('@hash', function() {
    it ('should be changable', function() {
      var uri = R29.URI('http://user:password@some.other.domain.us/dir/file.gz?k=v#hash');
      var a = uri.clone({hash: '#/page/something'})
      expect(a.toString()).toBe('http://user:password@some.other.domain.us/dir/file.gz?k=v#/page/something')
      expect(a.fragment).toBe('/page/something')
      expect(a.hash).toBe('#/page/something')
      uri.set('hash', 'test');
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/dir/file.gz?k=v#test')
      expect(uri.fragment).toBe('test')
      expect(uri.hash).toBe('#test')
      uri.set('hash', '');
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/dir/file.gz?k=v#')
      expect(uri.fragment).toBe('')
      expect(uri.hash).toBe('#')
      uri.set('hash', null);
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/dir/file.gz?k=v')
      expect(uri.fragment).toBeUndefined()
      expect(uri.hash).toBeUndefined()
    })
  })

  describe('@fragment', function() {
    it ('should be changable', function() {
      var uri = R29.URI('http://user:password@some.other.domain.us/dir/file.gz?k=v#hash');
      var a = uri.clone({fragment: '#/page/something'})
      expect(a.toString()).toBe('http://user:password@some.other.domain.us/dir/file.gz?k=v#/page/something')
      expect(a.fragment).toBe('/page/something')
      expect(a.hash).toBe('#/page/something')
      uri.set('fragment', 'test');
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/dir/file.gz?k=v#test')
      expect(uri.fragment).toBe('test')
      expect(uri.hash).toBe('#test')
      uri.set('fragment', '');
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/dir/file.gz?k=v#')
      expect(uri.fragment).toBe('')
      expect(uri.hash).toBe('#')
      uri.set('fragment', null);
      expect(uri.toString()).toBe('http://user:password@some.other.domain.us/dir/file.gz?k=v')
      expect(uri.fragment).toBeUndefined()
      expect(uri.hash).toBeUndefined()
    })
  })


  describe('@port', function() {
    it ('should be changable', function() {
      var uri = R29.URI('http://user:password@some.other.domain.us/dir/file.gz?k=v#hash');
      var a = uri.clone({port: '333'})
      expect(a.toString()).toBe('http://user:password@some.other.domain.us:333/dir/file.gz?k=v#hash')
      a.set('port', ':80')
      expect(a.toString()).toBe('http://user:password@some.other.domain.us:80/dir/file.gz?k=v#hash')
      a.set('port', null)
      expect(a.toString()).toBe('http://user:password@some.other.domain.us/dir/file.gz?k=v#hash')
    })
  })
})