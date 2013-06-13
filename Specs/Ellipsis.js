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
    getText(container, 'Maybe if I take all the Claritin at once …')
    R29.ellipsis(container, 2);
    //getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured …')
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be …')
    R29.ellipsis(container, 3);
    //getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just makes goon snejdl wjl …')
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just makes goon snejdl …')
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
    getText(container, 'Maybe if I take all the Claritin at once …')
    R29.ellipsis(container, 2);
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be …')
    R29.ellipsis(container, 3);
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just makes goon snejdl …')
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
    getText(container, 'Maybe if I take all the Claritin …')
    R29.ellipsis(container, 2);
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies …')
    R29.ellipsis(container, 3);
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just makes …')
    R29.ellipsis(container, 4);
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just makes goon snejdl wjl whkoz')
    R29.ellipsis(container, 3);
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just makes …')
    R29.ellipsis(container, 2);
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies …')
    R29.ellipsis(container, 1);
    getText(container, 'Maybe if I take all the Claritin …')
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
    getText(container, "Maybe if I take all the Claritin (cont'd)")
    R29.ellipsis(container, 2, null, "<a href='#'>(cont'd)</a>");
    expect(container.offsetHeight).toBe(40)
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new (cont\'d)')
    R29.ellipsis(container, 3, null, "<a href='#'>(cont'd)</a>");
    expect(container.offsetHeight).toBe(60)
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just (cont\'d)')
    R29.ellipsis(container, 4, null, "<a href='#'>(cont'd)</a>");
    expect(container.offsetHeight).toBe(80)
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just makes goon snejdl wjl whkoz')
    R29.ellipsis(container, 5, null, "<a href='#'>(cont'd)</a>");
    expect(container.offsetHeight).toBe(80)
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just makes goon snejdl wjl whkoz')
    R29.ellipsis(container, 4, null, "<a href='#'>(cont'd)</a>");
    R29.ellipsis(container, 3, null, "<a href='#'>(cont'd)</a>");
    expect(container.offsetHeight).toBe(60)
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just (cont\'d)')
    R29.ellipsis(container, 2, null, "<a href='#'>(cont'd)</a>");
    expect(container.offsetHeight).toBe(40)
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new (cont\'d)')
    R29.ellipsis(container, 1, null, "<a href='#'>(cont'd)</a>");
    getText(container, "Maybe if I take all the Claritin (cont'd)")
    
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
    getText(container, 'Maybe if I take all the Claritin …')
    R29.ellipsis(container, 2);
    getText(container, 'Maybe if I take all the Claritin …')
    R29.ellipsis(container, 3);
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies …')
    R29.ellipsis(container, 4);
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies …')
    R29.ellipsis(container, 3);
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies …')
    R29.ellipsis(container, 2);
    getText(container, 'Maybe if I take all the Claritin …')
    R29.ellipsis(container, 5);
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just makes …')
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
    R29.ellipsis(container, 1, null, '<a href="#">Read it here plz</a>', '. ');
    getText(container, 'Maybe if I take all the. Read it here plz')
    expect(container.offsetHeight).toBe(20 + 20);
    R29.ellipsis(container, 2, null, '<a href="#">Read it here plz</a>', '. ');
    getText(container, 'Maybe if I take all the Claritin. Read it here plz')
    expect(container.offsetHeight).toBe(40 + 20);
    R29.ellipsis(container, 3, null, '<a href="#">Read it here plz</a>', '. ');
    getText(container, 'Maybe if I take all the Claritin at once, these exciting. Read it here plz')
    expect(container.offsetHeight).toBe(60 + 20);
    R29.ellipsis(container, 4, null, '<a href="#">Read it here plz</a>', '. ');
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies. Read it here plz')
    expect(container.offsetHeight).toBe(80 + 20);
    R29.ellipsis(container, 3, null, '<a href="#">Read it here plz</a>', '. ');
    getText(container, 'Maybe if I take all the Claritin at once, these exciting. Read it here plz')
    expect(container.offsetHeight).toBe(60 + 20);
    R29.ellipsis(container, 2, null, '<a href="#">Read it here plz</a>', '. ');
    getText(container, 'Maybe if I take all the Claritin. Read it here plz')
    expect(container.offsetHeight).toBe(40 + 20);
    R29.ellipsis(container, 1, null, '<a href="#">Read it here plz</a>', '. ');
    getText(container, 'Maybe if I take all the. Read it here plz')
    expect(container.offsetHeight).toBe(20 + 20);
    R29.ellipsis(container, 5, null, '<a>Read it here plz</a>', '. ');
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good!. Read it here plz')
    expect(container.offsetHeight).toBe(100 + 20);
    R29.ellipsis(container, 6, null, '<a>Read it here plz</a>', '. ');
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just makes goon snejdl wjl whkoz')
    expect(container.offsetHeight).toBe(120 + 20);
    R29.ellipsis(container, 7, null, '<a>Read it here plz</a>', '. ');
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just makes goon snejdl wjl whkoz')
    expect(container.offsetHeight).toBe(120 + 20);
    R29.ellipsis(container, 1, null, '<a href="#">Read it here plz</a>', '. ');
    getText(container, 'Maybe if I take all the. Read it here plz')
    expect(container.offsetHeight).toBe(20 + 20);
    R29.ellipsis(container, 3, null, '<a href="#">Read it here plz</a>', '. ');
    getText(container, 'Maybe if I take all the Claritin at once, these exciting. Read it here plz')
    expect(container.offsetHeight).toBe(60 + 20);
    R29.ellipsis(container, 6, null, '<a>Read it here plz</a>', '. ');
    getText(container, 'Maybe if I take all the Claritin at once, these exciting new allergies will be cured for good! That just makes goon snejdl wjl whkoz')
    expect(container.offsetHeight).toBe(120 + 20);
    R29.ellipsis(container, 2, null, '<a href="#">Read it here plz</a>', '. ');
    getText(container, 'Maybe if I take all the Claritin. Read it here plz')
    expect(container.offsetHeight).toBe(40 + 20);
  })

  it ('should reuse ellipsis element', function() {
    var container = document.createElement('div');
    document.body.appendChild(container);
    container.innerHTML = '  <p>  Maybe if I take all the Claritin  </p>  <p>  at once, these exciting new allergies  </p>  <p>  will be cured for good! That just makes goon snejdl wjl whkoz  <a href="#" class="ellipsis"> read </a> </p>  '
    container.style.font = '10px/20px Arial';
    container.style.width = '200px';
    for (var all = container.getElementsByTagName('*'), el, i = 0; el = all[i++];) {
      if (el.tagName == 'A')
        continue;
      el.style.font = 'inherit';
      el.style.margin = 0;
      el.style.padding = '0 0 20px 0'
    }
    R29.ellipsis(container, 1, null, 'zz', '... ');
    getText(container, '    Maybe if I take all the Claritin...  read')
    expect(container.offsetHeight).toBe(20 + 20);
    R29.ellipsis(container, 6, null, 'zz', '... ');
    getText(container, '    Maybe if I take all the Claritin      at once, these exciting new allergies      will be cured for good! That just makes goon snejdl wjl whkoz...  read ')
    expect(container.offsetHeight).toBe(120 + 20);
    R29.ellipsis(container, 2, null, 'zz', '... ');
    getText(container, '    Maybe if I take all the Claritin...  read')
    R29.ellipsis(container, 3, null, 'zz', '... ');
    getText(container, '    Maybe if I take all the Claritin      at once, these exciting new...  read')
  })

  it ('should not remove punctuation if there is enough room ', function() {
    var container = document.createElement('div')
    document.body.appendChild(container);
    container.innerHTML = '  <p>  Hey guys where is everybody. </p> <p>I guess thats a bit too long, eh? Lets just make an alias. </p> <p> Copy and paste the line below on your terminal.  <a href="#" class="ellipsis"> read </a> </p> <b>  </b> '
    container.style.font = '10px/20px Arial';
    container.style.width = '200px';
    for (var all = container.getElementsByTagName('*'), el, i = 0; el = all[i++];) {
      if (el.tagName == 'A')
        continue;
      el.style.font = 'inherit';
      el.style.margin = '0 0 20px 0';
      el.style.padding = 0;

    }
    R29.ellipsis(container, 1, null, 'a', '... ');
    getText(container, '    Hey guys where is everybody...  read')

    //R29.ellipsis(container, 10, null, 'a', '... ');
    //getText(container, '    Hey guys where is everybody...  read')

    expect(R29.getElementsByClassName(container, 'ellipsis')[0].parentNode.tagName).toBe('P');
  })

  it ('should support centered text', function() {
    var container = document.createElement('div')
    document.body.appendChild(container);
    container.innerHTML = '  <p>  Hey guys where is everybody. </p> <p>I guessorrizirofkfkfkfkfkfkfkfkkjfr thatsaliciouscomrades a bit too long, eh? Lets just make an alias. </p> <p> Copy and paste the line below on your terminal.  <a href="#" class="ellipsis"> read </a> </p> <b>  </b> '
    container.style.font = '10px/20px Arial';
    container.style.width = '200px';
    container.style.textAlign = 'center'
    for (var all = container.getElementsByTagName('*'), el, i = 0; el = all[i++];) {
      if (el.tagName == 'A')
        continue;
      el.style.font = 'inherit';
      el.style.margin = '0 0 20px 0';
      el.style.padding = 0;
    }
    R29.ellipsis(container, 1, null, 'a', '... ');
    getText(container, '    Hey guys where is everybody...  read')
    R29.ellipsis(container, 2, null, 'a', '... ');
    getText(container, '    Hey guys where is everybody...  read')
    R29.ellipsis(container, 3, null, 'a', '... ');
    getText(container, '    Hey guys where is everybody.  I guessorrizirofkfkfkfkfkfkfkfkkjfr...  read')
    R29.ellipsis(container, 4, null, 'a', '... ');
    getText(container, '    Hey guys where is everybody.  I guessorrizirofkfkfkfkfkfkfkfkkjfr thatsaliciouscomrades a bit too long...  read')
  })
})