"use strict"; // strict mode syntax
// Opens a file
var ev;
var openFile = function(openfile) {
  ev = openfile;
  Alert.render("Choose a type of graph: ");
};

var newFile = function(newFile) {
  ev = newFile;
  Alert2.render("Choose a type of graph: ")
}

function loadFile(){
  var input = ev.target;
  var colorlist = document.getElementById("colors");
  while(colorlist.firstChild){
    colorlist.removeChild(colorlist.firstChild);
  }
  // use PapaParse for handing the csv file
    var results = Papa.parse(input.files[0], {
    	complete: function(results) {
        var resData = results.data;
       if((resData[resData.length-1].length == 1) && (resData[resData.length-1][0] == "")){
          results.data.pop();
        }
  	 	loadData(results);
  	 }
    });
}

// provides the openFile function call to the DOM
var loadListener = function(){
  document.getElementById('files').addEventListener('change', openFile, false);
}

var createListener = function() {
  document.getElementById('newTable').addEventListener('click', newFile, false);
}

// Creates empty table value
var createFile = function(rows, columns) {
  if (rows <= 1) {
    rows = 2;
  }
  if (columns <= 1) {
    columns = 2;
  }

  // Reset color list
  var colorlist = document.getElementById("colors");
  while(colorlist.firstChild){
    colorlist.removeChild(colorlist.firstChild);
  }

  // Used to create appropriately formated object to be passed in
  var emptyArray = [];
  var emptyObject = { };
  var rowArray = new Array(parseInt(rows));

  for (var i = 0; i < rowArray.length; i++) {
    rowArray[i] = new Array(parseInt(columns));

    for (var j = 0; j < rowArray[i].length; j++) {
      rowArray[i][j] = 0;
    }
  } 

  for (var i = 0; i < rowArray[0].length; i++) {
    rowArray[0][i] = "Label " + i;
  }

  // Create object
  var newTable = {data: rowArray, errors: emptyArray, meta: emptyObject };

  // Load new table :)
  loadData(newTable);
}
var changeType= function(){
    var results = new Object();
    results.data= [];
    results.errors=[];
    var m ={
      aborted:false,
      cursor:94,
      delimiter: ",",
      linebreak: "",
      truncated: false
    }
    results.meta = m;
    var resData = grid.getData();
    for(var i = 0; i< resData.length; i++){
      results.data[i]= [];
      for(var key in resData[i]){
        if(key != "id")
        results.data[i].push(resData[i][key]);
      }
    }
    loadData(results);
}


// Place a new row on the end of the existing table
 var addRow = function() {

    // Reset color list
  var colorlist = document.getElementById("colors");
  while(colorlist.firstChild){
    colorlist.removeChild(colorlist.firstChild);
  }

  var currTable = new Object();
  currTable.data = [];
  currTable.errors = [];
  var resData = grid.getData();

  for(var i = 0; i< resData.length; i++){
    currTable.data[i]= [];
    for(var key in resData[i]){
      if(key != "id")
      currTable.data[i].push(resData[i][key]);
    }
  }

  var newRow = new Array(currTable.data[0].length);
  for (var i = 0; i < newRow.length; i++) {
    newRow[i] = 0;
  }
  currTable.data.push(newRow);
  loadData(currTable);
 }

// // Place a new column on the end of the existing table
var addColumn = function() {
  // Reset color list
  var colorlist = document.getElementById("colors");
  while(colorlist.firstChild){
    colorlist.removeChild(colorlist.firstChild);
  }

  var currTable = new Object();
  currTable.data = [];
  currTable.errors = [];

  var resData = grid.getData();
      for(var i = 0; i< resData.length; i++){
        currTable.data[i]= [];
        for(var key in resData[i]){
          if(key != "id")
          currTable.data[i].push(resData[i][key]);
        }
      }

    for (var i = 0; i < currTable.data.length; i++) {
      currTable.data[i].push(0);
    }

    currTable.data[0][currTable.data[0].length - 1] = "Label " + currTable.data[0].length;
    loadData(currTable);
 }




