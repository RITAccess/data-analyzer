"use strict"; // strict mode syntax
//Creates a set of audio data from the provided arrayinfo
function AudioPlayer() {
  this.duration = 0.5; //default duration of a single note
  this.timeStep = 0.5;
  this.maxFreq = 64;
  this.minFreq = 28;
  this.audio = [];
  this.infoCollection = new ArrayCollection([]);
  this.isDirty = false;
  this.timeoutQueue = [];
  this.playing = false;
}

//Add a single line to the audio player
AudioPlayer.prototype.addLine = function(arrayInfo) {
  this.infoCollection.addLine(arrayInfo);
}

//Add a single line to the audio player
AudioPlayer.prototype.addAudioLine = function(arrayInfo) {
  this.audio.push(jsfxlib.createWaves(this.genWaves(arrayInfo)));
}


//Using an arrayCollection object you can add a group of lines to the audio object
AudioPlayer.prototype.replaceCollection = function(collection) {
  var dropdownString ="";
  this.infoCollection.replaceCollection(collection);
  for(var i = 1; i < collection.length; i++) {
    dropdownString += "<option value="+(i)+">"+(i)+"</option>"
  }
  this.isDirty = true;
  document.getElementById("audioSpan").style.visibility = "visible";
  document.getElementById("lineDropdown").innerHTML = dropdownString;
}

//A change was made to a line in the table
AudioPlayer.prototype.changeLine = function(line, index, newValue) {
  if(line != 0) {
    this.infoCollection.changeLine(line,index,newValue);
    this.isDirty = true;
  }
}

//This function causes the audio information to actually be calculated.
//Should be called whenever the audio data changes
AudioPlayer.prototype.recalculateLines = function() {
  this.audio = [];
  for(var i = 0; i < this.infoCollection.collection.length; i++) {
    this.addAudioLine(this.infoCollection.collection[i]);
  }
  this.isDirty = false;
}

//Toggle playing either on or off
AudioPlayer.prototype.playToggle = function(line, startIndex, endIndex) {
  if(!this.playing) {
    this.playLine(line, startIndex, endIndex);
  }
  else {
    this.stopPlaying();
  }
  this.updateIcon();
}

//Play a line. can also have optional parameters for start and ending index
AudioPlayer.prototype.playLine = function(line, startIndex, endIndex) {
  //If the lines have been changed since the last time they
  //were played then recalculate them

  //Reset the timeout queue
  this.timeoutQueue = [];
  this.playing = true;

  if(this.isDirty) {
    this.recalculateLines();
  }

  var speed = this.timeStep/(document.getElementById("bpm").value || 1);

  var end = (endIndex || this.infoCollection.collection[line].array.length-1);
  var self = this;
  var startIndex = (startIndex || 0);
  //If startIndex or endIndex are undefined they will be set to the start and end of the line respectively
  for(var i = startIndex; i <= end; i++) {
    this.playPointWithDelay(line, i, (i-startIndex)*(speed-speed/8)*1000);

    if(i == end-1) {
      this.timeoutQueue.push(setTimeout(
        function(){self.playing = false; self.updateIcon();},
        ((i+1)-startIndex)*(speed-speed/8)*1000));
    }

  }
}

//PLay multiple lines at the same time. Takes in an array of lines and the start and end index.
AudioPlayer.prototype.playLines = function(lines, startIndex, endIndex) {
  if(this.isDirty) {
    this.recalculateLines();
  }

  for (var i = 0; i < lines.length; i++) {
    this.playLine(lines[i], startIndex, endIndex);
  }
}

//Play a single point
AudioPlayer.prototype.playPoint = function(line, point) {
  this.audio[line][point].play();
}

//This function is nessesary so that there is a seperate copy of the
//index for when the function is actualy called
AudioPlayer.prototype.playPointWithDelay = function(line, index, delay) {
  var self = this;
  this.timeoutQueue.push(setTimeout(function() {self.playPoint(line, index);}, delay));
}

//If there is anything left in the timeout queue then stop them from playing
AudioPlayer.prototype.stopPlaying = function() {
  for(var i = 0; i < this.timeoutQueue.length; i++) {
    clearTimeout(this.timeoutQueue[i]);
  }
  this.playing = false;
}

// Updates the play / stop icon.
AudioPlayer.prototype.updateIcon = function() {
  var iList = document.getElementById("icon").classList;
  if(this.playing) {
    iList.remove("fa-play");
    iList.add("fa-stop");
  }
  else {
    iList.remove("fa-stop");
    iList.add("fa-play");
  }
}
//Using the arrayinfo a wave array is created
AudioPlayer.prototype.genWaves = function(arrayInfo) {
  var audioLibParams = {};

  for(var i = 0; i < arrayInfo.array.length; i++) {
    audioLibParams[i] = this.genSoundArray(
      this.calcFrequency(
        arrayInfo.array[i],
        this.infoCollection.min,
        this.infoCollection.max
        ));
  }

  return audioLibParams;
}

//Converts the value to a frquency between the min and max frequnecy.
AudioPlayer.prototype.calcFrequency = function(value, min, max) {
  var freq = (((this.maxFreq-this.minFreq)*(value-min))/(max-min))+this.minFreq;
  freq = Math.pow(2,((freq-40)/12))*440;
  return freq;
}

//Creates a sound object
AudioPlayer.prototype.genSoundArray = function(frequency) {
  return ["sine",
  0.0000, //super sampling quality
  0.1750, //master volume
  this.duration*0.013, //attack time
  this.duration*0.13, //sustain time
  0.0000, //sustain punch
  this.duration*0.86, //decay time
  20.0000, //min frequency
  frequency, //This is the frequency
  2400.0000, //max frequency
  0.0000, //slide
  0.0000, //delta slide
  0.0250, //vibrato slide
  45.0000, //vibrato frequency
  -0.3000, //vibrato depth slide
  -1.0000, //vibrato frequency slide
  0.0000, //change amount
  0.0000, //change speed
  0.0000, //square duty
  0.0000, //square duty sweep
  0.0000, //repeat speed
  0.0080, //phaser offset
  0.0000, //phaser sweep
  1.0000, //lp filter cutoff
  0.0040, //lp filter cutoff sweep
  0.0000, //lp filter resonance
  0.0000, //hp filter cutoff
  0.0100]; //hp filter cutoff sweep
}

//play the input array of audio data
//Used for debugging
var playNotes = function(notes) {
  this.sounds = [];
  for(var i = 0; i < notes.length; i++) {
    sounds[i] = jsfxlib.createWaves(notes);
  }

  for(var i = 0; i < notes.length; i++) {
    sounds[i][0].play();
  }
}
