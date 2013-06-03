describe('R29.ellipsis', function() {
  var getText = function(container, string) {
    var content = container.textContent;
    expect(content.substring(0, string.length)).toBe(string)
  }
  it ('should crop text nodes', function() {
    var container = document.createElement('div');
    container.innerHTML = 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just makes goon snejdl wjl whkoz'
    container.style.font = '10px/20px Arial';
    container.style.width = '200px';
    document.body.appendChild(container);
    R29.ellipsis(container, 1);
    getText(container, 'Maybe if I take all the Claritin at once…')
    R29.ellipsis(container, 2);
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured…')
    R29.ellipsis(container, 3);
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just makes goon snejdl wjl…')
    R29.ellipsis(container, 4);
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just makes goon snejdl wjl whkoz')
  })

  it ('should crop elements', function() {
    var container = document.createElement('div');
    container.innerHTML = '<p>Maybe if I take all the Claritin at once, these exciting new allergies will be cured </p><p>for good! That just makes goon snejdl wjl whkoz</p>'
    container.style.font = '10px/20px Arial';
    container.style.width = '200px';
    for (var all = container.getElementsByTagName('*'), el, i = 0; el = all[i++];) {
      el.style.font = 'inherit';
      el.style.margin = el.style.padding = 0;
    }
    document.body.appendChild(container);
    R29.ellipsis(container, 1);
    getText(container, 'Maybe if I take all the Claritin at once…')
    R29.ellipsis(container, 2);
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured…')
    R29.ellipsis(container, 3);
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just makes goon snejdl wjl…')
    R29.ellipsis(container, 4);
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just makes goon snejdl wjl whkoz')
  })

  it ('should crop block elements', function() {
    var container = document.createElement('div');
    container.innerHTML = '<p>Maybe if I take all the Claritin</p><p> at once, these exciting new allergies</p><p> will be cured for good! That just makes goon snejdl wjl whkoz</p>'
    container.style.font = '10px/20px Arial';
    container.style.width = '200px';
    for (var all = container.getElementsByTagName('*'), el, i = 0; el = all[i++];) {
      el.style.font = 'inherit';
      el.style.margin = el.style.padding = 0;
    }
    document.body.appendChild(container);
    R29.ellipsis(container, 1);
    getText(container, 'Maybe if I take all the Claritin…')
    R29.ellipsis(container, 2);
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies…')
    R29.ellipsis(container, 3);
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just makes…')
    R29.ellipsis(container, 4);
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just makes goon snejdl wjl whkoz')
    R29.ellipsis(container, 3);
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just makes…')
    R29.ellipsis(container, 2);
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies…')
    R29.ellipsis(container, 1);
    getText(container, 'Maybe if I take all the Claritin…')
  })

it ('should crop block elements with custom ellipsis', function() {
    var container = document.createElement('div');
    container.innerHTML = '<p>Maybe if I take all the Claritin</p><p> at once, these exciting new allergies</p><p> will be cured for good! That just makes goon snejdl wjl whkoz</p>'
    container.style.font = '10px/20px Arial';
    container.style.width = '200px';
    for (var all = container.getElementsByTagName('*'), el, i = 0; el = all[i++];) {
      el.style.font = 'inherit';
      el.style.margin = el.style.padding = 0;
    }
    document.body.appendChild(container);
    R29.ellipsis(container, 1, null, "<a href='#'>(cont'd)</a>");
    getText(container, "Maybe if I take all the Claritin(cont'd)")
    R29.ellipsis(container, 2, null, "<a href='#'>(cont'd)</a>");
    expect(container.offsetHeight).toBe(40)
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new(cont\'d)')
    R29.ellipsis(container, 3, null, "<a href='#'>(cont'd)</a>");
    expect(container.offsetHeight).toBe(60)
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just(cont\'d)')
    R29.ellipsis(container, 4, null, "<a href='#'>(cont'd)</a>");
    expect(container.offsetHeight).toBe(80)
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just makes goon snejdl wjl whkoz')
    R29.ellipsis(container, 5, null, "<a href='#'>(cont'd)</a>");
    expect(container.offsetHeight).toBe(80)
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just makes goon snejdl wjl whkoz')
    R29.ellipsis(container, 4, null, "<a href='#'>(cont'd)</a>");
    R29.ellipsis(container, 3, null, "<a href='#'>(cont'd)</a>");
    expect(container.offsetHeight).toBe(60)
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just(cont\'d)')
    R29.ellipsis(container, 2, null, "<a href='#'>(cont'd)</a>");
    expect(container.offsetHeight).toBe(40)
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new(cont\'d)')
    R29.ellipsis(container, 1, null, "<a href='#'>(cont'd)</a>");
    getText(container, "Maybe if I take all the Claritin(cont'd)")
    
})

it ('should crop block elements with padding', function() {
    var container = document.createElement('div');
    container.innerHTML = '<p>Maybe if I take all the Claritin</p><p> at once, these exciting new allergies</p><p> will be cured for good! That just makes goon snejdl wjl whkoz</p>'
    container.style.font = '10px/20px Arial';
    container.style.width = '200px';
    for (var all = container.getElementsByTagName('*'), el, i = 0; el = all[i++];) {
      el.style.font = 'inherit';
      el.style.margin = 0;
      el.style.padding = '0 0 20px 0'
    }
    document.body.appendChild(container);
    R29.ellipsis(container, 1);
    getText(container, 'Maybe if I take all the Claritin…')
    R29.ellipsis(container, 2);
    getText(container, 'Maybe if I take all the Claritin…')
    R29.ellipsis(container, 3);
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies…')
    R29.ellipsis(container, 4);
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies…')
    R29.ellipsis(container, 3);
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies…')
    R29.ellipsis(container, 2);
    getText(container, 'Maybe if I take all the Claritin…')
    R29.ellipsis(container, 5);
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just makes…')
    R29.ellipsis(container, 6);
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just makes goon snejdl wjl whkoz')
    R29.ellipsis(container, 7);
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just makes goon snejdl wjl whkoz')
  })



it ('should crop block elements with padding and custom ellipsis', function() {
    var container = document.createElement('div');
    container.innerHTML = '<p>Maybe if I take all the Claritin</p><p> at once, these exciting new allergies</p><p> will be cured for good! That just makes goon snejdl wjl whkoz</p>'
    container.style.font = '10px/20px Arial';
    container.style.width = '200px';
    for (var all = container.getElementsByTagName('*'), el, i = 0; el = all[i++];) {
      el.style.font = 'inherit';
      el.style.margin = 0;
      el.style.padding = '0 0 20px 0'
    }
    document.body.appendChild(container);
    R29.ellipsis(container, 1, null, '. <a href="#">Read it here plz</a>');
    getText(container, 'Maybe if I take all the. Read it here plz')
    expect(container.offsetHeight).toBe(20 + 20);
    R29.ellipsis(container, 2, null, '. <a href="#">Read it here plz</a>');
    getText(container, 'Maybe if I take all the Claritin. Read it here plz')
    expect(container.offsetHeight).toBe(40 + 20);
    R29.ellipsis(container, 3, null, '. <a href="#">Read it here plz</a>');
    getText(container, 'Maybe if I take all the Claritin at once, these exciting. Read it here plz')
    expect(container.offsetHeight).toBe(60 + 20);
    R29.ellipsis(container, 4, null, '<a href="#">Read it here plz</a>');
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies. Read it here plz')
    expect(container.offsetHeight).toBe(80 + 20);
    R29.ellipsis(container, 3, null, '. <a href="#">Read it here plz</a>');
    getText(container, 'Maybe if I take all the Claritin at once, these exciting. Read it here plz')
    expect(container.offsetHeight).toBe(60 + 20);
    R29.ellipsis(container, 2, null, '. <a href="#">Read it here plz</a>');
    getText(container, 'Maybe if I take all the Claritin. Read it here plz')
    expect(container.offsetHeight).toBe(40 + 20);
    R29.ellipsis(container, 1, null, '. <a href="#">Read it here plz</a>');
    getText(container, 'Maybe if I take all the. Read it here plz')
    expect(container.offsetHeight).toBe(20 + 20);
    //R29.ellipsis(container, 5, null, '<a>Read it here plz</a>');
    //getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just makes…')
    //R29.ellipsis(container, 6, null, '<a>Read it here plz</a>');
    //getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just makes goon snejdl wjl whkoz')
    //R29.ellipsis(container, 7, null, '<a>Read it here plz</a>');
    //getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just makes goon snejdl wjl whkoz')
  })


})