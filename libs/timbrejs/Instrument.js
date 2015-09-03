require(["libs/timbrejs/soundfont.js"]);
//Make an instrument object with a given instrument number
function Instrument(number){
  this.number = number;
  this.bpm = 120; //Default tempo
  this.subdiv = "L4";
  this.makeSoundFont(number);
  this.infoCollection = new ArrayCollection([]);
  this.playing = false;
  this.isLoading = false;
  this.pnotes = null;
  this.t = null;
  this.paused = false;
}

//Create a T soundfont object based on number
Instrument.prototype.makeSoundFont = function(number){
  T.soundfont.setInstrument(number);
}

//Change instrument number of this instrument
Instrument.prototype.changeInstrument = function(number){
  if(this.number === number)
    return;
  this.number = number;
  this.makeSoundFont(this.number-1);
  this.setCollection(this.infoCollection.collection);
}

//Play a single note
Instrument.prototype.playSingleNote= function(number){
  this.playing = true;
  T.soundfont.play(number);
  this.playing = false;
}

//Play an entire set of notes
Instrument.prototype.playDataSet = function(line,startIndex,endIndex){
  this.playing = true;
  this.paused = false;
  var i = startIndex;
  var j = line;
  var self = this;
  timbre.bpm = this.bpm;
  this.t = T("interval", {interval:this.subdiv,timeout:"55sec"},function(){
    self.line = line;
    if(i>=endIndex || self.infoCollection.collection[j].array[i+1] === undefined){
      self.playing = false;
      self.t.stop();

    }
    var key =  parseInt(self.infoCollection.collection[j].array[i]);
    if(key === undefined){
      self.playing = false;
      self.paused = false;
      self.t.stop();
      return;
    }
    T.soundfont.play(self.pnotes[key],false);
    i++;
  }).on("ended",function(){
    this.stop();
  }).start();
  $("*").css("cursor", "default");
}

//For Bar Graph, play a certain month
Instrument.prototype.playColumn = function(col){
  this.playing = true;
  var i = col;
  var j = 0;
  var self = this;
  timbre.bpm = this.bpm;
  this.t = T("interval", {interval:this.subdiv,timeout:"55sec"},function(){
    if(j>=self.infoCollection.collection.length-1 || self.infoCollection.collection[j] === undefined){
      self.playing = false;
      this.stop();
      self.t.stop();
    }
    var key =  parseInt(self.infoCollection.collection[j].array[i]);
    T.soundfont.play(self.pnotes[key],false);
    j++;
  }).on("ended",function(){
    this.stop();
  }).start();
  $("*").css("cursor", "default");
}

//For Bar Graph, play through, playing all columns as chords
Instrument.prototype.playColumnsAsChords = function(line,startIndex,endIndex){
  this.playing = true;
  var i = startIndex;
  var j = line;
  var self = this;
  timbre.bpm = this.bpm;
  this.t = T("interval", {interval:this.subdiv,timeout:"55sec"},function(){
    if(i>=endIndex || self.infoCollection.collection[j].array[i+1] === undefined){
      self.playing = false;
      this.stop();
      self.t.stop();
    }
    for(var k = 0; k < self.infoCollection.collection.length; k++){
      var key =  parseInt(self.infoCollection.collection[k].array[i]);
      T.soundfont.play(self.pnotes[key],false);
    }
    i++;
  }).on("ended",function(){
    this.stop();
  }).start();
  $("*").css("cursor", "default");
  self.playing = false;
}

//Sonically represent the regression line using an instrument
Instrument.prototype.playRegressionLine = function(){
  this.playing = true;
  var i = 0;
  var myNotes = chart.calcBestFit();
  var self = this;
  timbre.bpm = this.bpm;
  this.t = T("interval", {interval:this.subdiv,timeout:"55sec"},function(){
    var key =  parseInt(myNotes[i][1])+30;
    T.soundfont.play(key);
    i++;
    if(i>myNotes.length || myNotes[i]===undefined){
      self.playing = false;
      self.t.stop();
      this.stop();
    }
  }).on("ended",function(){
    this.stop();
  }).start();
  $("*").css("cursor", "default");
}

//Using an arrayCollection object you can add a group of lines to the audio object
Instrument.prototype.setCollection = function(collection) {
  var dropdownString ="";
  this.infoCollection.setCollection(collection);
  for(var i = 0; i < collection.length; i++) {
    dropdownString += "<option value="+(i + 1)+">"+(i + 1)+"</option>"
  }
  /*[DO NOT MOVE]: This section preloads all of the notes in the current collection
  * in order to make playback even and uniform (if you're getting a sound that resembles
  * an individual sitting on a piano, then you probably moved this)
  */
  this.notes = this.buildNotes();
  document.getElementById("audioSpan").style.display = "";
  if(document.getElementById("lineDropdown").innerHTML.length < dropdownString.length)
  document.getElementById("lineDropdown").innerHTML = dropdownString;
}

//A change was made to a line in the table
Instrument.prototype.changeLine = function(line, index, newValue) {
  if(newValue != -1) {
    if(!isNaN(newValue)){
      this.infoCollection.changeLine(line,index,newValue);
      this.buildNotes();
    }
  }
}

//Toggle playing either on or off
Instrument.prototype.playToggle = function(line, startIndex, endIndex, mode) {
  if(!this.playing) {
    if(this.t && this.line != line){
      this.t.stop();
    }
    if(this.paused){
      this.t.start();
      this.paused = false;
      this.playing = true;
      return;
    }
    $("*").css("cursor", "progress");
    this.looping = true;
    while(this.looping){
      if(!this.isLoading){
        var self = this;
        var q = function(){
            self.looping = false;
            self.playing = true;
        }
        setTimeout(q(), 1000);
      }
    }
    var self = this;
    if(!mode || mode === 0)
      setTimeout(function() {self.playDataSet(line,startIndex,endIndex);}, 1000);
    else if(mode === 1){
      if(type === "bar")
      setTimeout(function() {self.playColumn(line);}, 1000);
      else
      setTimeout(function() {self.playRegressionLine();}, 1000);
    }
    else if(mode === 2){
      setTimeout(function() {self.playColumnsAsChords(line,startIndex,endIndex);}, 1000);
    }
    }
    else{
      if(this.t){
        this.t.stop();
        this.playing = false;
        if(!this.paused)
          this.paused = true;
        if(this.line != undefined && (this.line != line)){
          this.t = null;
          this.paused = false;
        }
      }
    }
}

//Set play speed
Instrument.prototype.setBpm = function(bpm){
  this.subdiv = "L4";
  if(bpm > 280){
    while(bpm>280){
      this.subdiv = "L" + parseInt(this.subdiv.substr(1))*2;
      bpm /= 2;
    }
  }
  this.bpm = bpm;
}
//Preload all notes in the collection
Instrument.prototype.buildNotes= function(){
  var range = this.getMaxMin();
  var newNotes = {};
  for(var i = 0; i < this.infoCollection.collection.length; i++){
    for(var j = 0; j < this.infoCollection.collection[i].array.length; j++){
        var key =(parseInt(this.infoCollection.collection[i].array[j]));
        newNotes[key] = key+range[0];
    }
  }
  var toSort = [];
  for(var key in newNotes){
    toSort.push(parseInt(newNotes[key]));
  }
  toSort.sort(function(a,b){
    if(a<b)
      return -1;
    else if(a>b)
      return 1;
    else
      return 0;
  });
  if(toSort[toSort.length-1]>range[1]){
    var mult = range[1]/toSort[toSort.length-1];
    for(var i = 0; i<toSort.length; i++){
      toSort[i] = parseInt(mult*toSort[i]);
    }
  }
  T.soundfont.preload(toSort);
  var i = 0;
  this.pnotes = new Object();
  for(var key in newNotes){
    newNotes[key] = toSort[i];
    i++;
    var a = [];
    a.push(newNotes[key]);
    this.pnotes[key] = newNotes[key];
  }
}

//Get key in hash given a value
Instrument.prototype.getKeyByValue = function( value ) {
    for( var prop in this.notes ) {
        if( this.hasOwnProperty( prop ) ) {
             if( this[prop] === value )
                 return prop;
        }
    }
}

Instrument.prototype.stop = function(){
  this.t.stop();
  this.playing = false;
  this.paused = false;
}

Instrument.prototype.getMaxMin = function(){
  if(ranges[this.number])
    return ranges[this.number];
  else
    return [30,100];  
}