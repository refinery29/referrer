R29.Video = function(id, element) {
  if (id && id.nodeType) {
    var a = id;
    id = element;
    element = a;
  }
  for (var name in this) {
    if (name.substring(0, 2) == 'on')
      this[name] = this[name].bind(this);
  }
  if (!id && element) {
    var params = element.getElementsByTagName('param');
    for (var i = 0, param; param = params[i++];) {
      if (param.getAttribute('name') == '@videoPlayer') {
        this.id = param.getAttribute('value');
        break;
      }
    }
  } else {
    this.id = id;
  }
  if (this.id)
    this.instances[this.id] = this;
  this.element = element;
  R29.Script.call(this);
  if (this.element && !this.isEager()) {
    this.element.onmouseover = this.onMouseOver
    this.element.onmouseout = this.onMouseOut
  }
};
R29.Video.onLoad = function(id) {
  var instance = R29.Video.prototype.instances[id];
  if (instance) 
    instance.onLoad(id)
  else
    new R29.Video(id);
}
R29.Video.prototype = new R29.Script;
R29.Video.prototype.instances = {};
R29.Video.prototype.isLoaded = function() {
  return typeof brightcove != 'undefined';
}
R29.Video.prototype.src = 'http://admin.brightcove.com/js/BrightcoveExperiences_all.js'
// the script should be only loaded once
R29.Video.prototype.global = true;
// when ad becomes skippable
R29.Video.prototype.threshold = 10000;
R29.Video.prototype.isEager = function() {
  return !this.element || this.element.className.indexOf('lazy') == -1;
}
R29.Video.prototype.set = function(id) {
  this.player.loadVideoByID(id)
};
R29.Video.prototype.start = function() {
  if (this.player)
    this.player.start();
};
R29.Video.prototype.stop = function() {
  if (this.player)
    this.player.stop();
};
R29.Video.prototype.toggle = function() {
  if (this.playing)
    this.stop()
  else
    this.start();
};
R29.Video.prototype.initialize = function(id) {
  var experience = brightcove.instances[this.id]
  if (experience) return experience;
  var object = this.element.getElementsByTagName('object')[0];
  if (object) {
    if (!object.id) object.id = id || Math.random()
    object.className = 'BrightcoveExperience';
    brightcove.createExperiences(null, object.id);
  }
  this.element.classList.add('initialized')
  return brightcove.instances[this.id]
};
R29.Video.prototype.onSuccess = function() {
  var experience = this.initialize(this.id);
  if (experience) {
    this.experience = experience;
    this.onLoad(experience.id)
  }
};
R29.Video.prototype.onReady = function() {
  this.element.classList.add('ready');
  this.play();
}
R29.Video.prototype.onLoad = function(id) {
  var experience = this.experience = brightcove.instances[id];
  this.player = this.experience.getModule("videoPlayer");
  this.player.addEventListener('mediaPlay', this.onStart);
  this.player.addEventListener('mediaProgress', this.onProgress);
  this.player.addEventListener('mediaStop', this.onStop);


  // initialize skip-ad stuff
  try {
    var ad = this.ad = this.experience.getModule("advertising");
    if (!ad) return;
  } catch(e) {};
  var experienceModule = this.experience.getModule("experience");
  var self = this;
  experienceModule.addEventListener("templateReady", function onTemplateReady(event) {
    self.onReady();
    experienceModule.removeEventListener("templateReady", onTemplateReady);
    var element = document.getElementById(id);
    var wrapper = element.parentNode;
    adSkipper.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      self.onAdSkip()
      ad.stopAd();
    }
    ad.addEventListener('adStart', self.onAdStart)
    ad.addEventListener('adComplete', self.onAdComplete)
  });
}
R29.Video.prototype.onMouseOver = function() {
  this.element.classList.add('engaged');
  return this.load() || this.play();
};
R29.Video.prototype.onMouseOut = function() {
  this.element.classList.remove('engaged');
  return this.stop();
};
R29.Video.prototype.onStart = function() {
  this.playing = true;
  this.element.classList.add('playing');
};
R29.Video.prototype.onStop = function() {
  this.playing = false;
  this.element.classList.remove('playing');
};
R29.Video.prototype.onAdStart = function() {
  this.timeout = setTimeout(this.onAdSkippable, this.threshold);
};
R29.Video.prototype.onAdComplete = function() {
  clearTimeout(this.timeout)
  if (this.skipper)
    this.skipper.setAttribute('hidden', 'hidden')
};
R29.Video.prototype.onAdSkip = function() {
  if (this.skipper)
    this.skipper.setAttribute('hidden', 'hidden')
};
R29.Video.prototype.onAdSkippable = function() {
  if (!this.skipper) {
    this.skipper = document.createElement('span')
    this.skipper.className = 'skip-ad';
    this.element.appenndChild(this.skipper);
  } else {
    this.skipper.removeAttribute('hidden');
  }
};
R29.Video.prototype.play = R29.Video.prototype.start;