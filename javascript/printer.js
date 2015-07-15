var printWin;
function printPage()
{
   var html="<html>";
   html += "<head>";
   html += document.getElementsByTagName('title')[0].outerHTML;
   html += document.getElementsByTagName('meta')[0].outerHTML;
   var htmlString = ""
   for(var i = 0; i < document.getElementsByTagName("link").length; i++){
     htmlString = document.getElementsByTagName("link")[i].outerHTML;
     html += htmlString;
   }
   var bg = document.getElementById("graphCC").style.background;
   if(bg===""){
    bg = "url('stylesheets/halftone/halftone.png')";
   }
   html += "</head>";
   html += "<body>";
   html += "<header><h1 id='title' tabindex='0'>Data Analyzer</h1></header>";
   html += "<div id='content'>";
   html += "<h3 style='text-align:center;'>Data Analyzer Graph</h3><div id='graphImg' style=\"background:" +bg + "\"><img tabindex='0' alt='Data Analyzer Graph' width='800px' src='" + chart.toBase64Image() + "'/></div>";
   html += "<div id='summaryBox' style='display: block;'>";
   html += document.getElementById('summaryBox').innerHTML;
   html += "</div><div id='printTable'><h3 id='printTableHeader'>Data Table</h3>";
   html += "<div id='printTableBody'>";
   var s = "<table class='printTable'>";
   if(type === "bar"){
      var counter = 0;
      for(var j = 0; j<(chart.datasets[0].bars.length/10); j++){
         s+="<tr class='border'>";
         for(var i = 0; (i<chart.datasets[0].bars.length && counter<10 && chart.datasets[0].bars[(10*j)+i]!= undefined); i++){
            s+="<th class='border'>" + chart.datasets[0].bars[(10*j)+i].label + "</th>";
            counter++;
         }
         s+="</tr>";
         counter = 0;
         for (var i = 0; i < chart.datasets.length; i++) {
            s+="<tr class='border'>";
            for(var k = 0; (k<chart.datasets[i].bars.length && counter<10 && chart.datasets[i].bars[(10*j)+k]!= undefined); k++) {
               s+= "<td class='border'>" + chart.datasets[i].bars[(10*j) + k].value + "</td>";
               counter++;
            }
            counter = 0;
            s += "</tr>";
         }

         s+="</table><br /><table class='printTable'>";
         counter = 0;
      }
   }
   else{
      var counter = 0;
      for(var j = 0; j<(chart.datasets[0].points.length/10); j++){
         s+="<tr class='border'>";
         for(var i = 0; (i<chart.datasets[0].points.length && counter<10 && chart.datasets[0].points[(10*j)+i]!= undefined); i++){
            s+="<th class='border'>" + chart.datasets[0].points[(10*j)+i].label + "</th>";
            counter++;
         }
         s+="</tr>";
         counter = 0;
         for (var i = 0; i < chart.datasets.length; i++) {
            s+="<tr class='border'>";
            for(var k = 0; (k<chart.datasets[i].points.length && counter<10 && chart.datasets[i].points[(10*j)+k]!= undefined); k++) {
               s+= "<td class='border'>" + chart.datasets[i].points[(10*j) + k].value + "</td>";
               counter++;
            }
            counter = 0;
            s += "</tr>";
         }

         s+="</table><br /><table class='printTable'>";
         counter = 0;
      }
   }
   html += s;
   html += "</div></div>";
   html += "</content>";
   html += "</body></html>";
   printWin = window.open("about:blank");
   printWin.document.write(html);
   printWin.document.close();
   printWin.document.getElementById("colors").style.maxHeight = "none";
   var inputs = printWin.document.getElementsByTagName("input");

   for(var i = 0; i < inputs.length; i++) {
     inputs[i].style.display = "none";
   }
  var sumBox = printWin.document.getElementById("summaryBox");
  var paragraphs = sumBox.getElementsByTagName("p");
  for(var i = 0; i < paragraphs.length; i++) {
    paragraphs[i].style.background = "rgba(0,0,0,0)";
  }
   //var div = "squaredTwo";
   var divArr = printWin.document.getElementsByClassName("squaredTwo");
   for(var i = 0; i < divArr.length; i++){
      divArr[i].style.display = "none";
   }
   var brArray = printWin.document.getElementsByTagName("br");
   for(var i = 0; i < brArray.length; i ++){
      if(brArray[i].parentNode.nodeName === "LI"){
         brArray[i].style.display="none";
      }
   }

   var colorBoxes = printWin.document.getElementsByClassName("colorblock")
   var image = new Image();
   var length = colorBoxes.length;
   for(var i = 0; i < length; i++){
     /*
     image.src = colorBoxes[i].toDataURL("image/png");
     var myImg = printWin.document.createElement("img");
     myImg = image;
     colorBoxes[i].parentNode.replaceChild(myImg, colorBoxes[i]);
     */
     var imgHTML = printWin.document.write('<img src="' + colorBoxes[0].toDataURL("image/png")+'"/>');
     imgHTML.setAttribute("src",colorBoxes[0].toDataURL("image/png"));
     imgHTML.setAttribute("alt","Color Box");
     imgHTML.setAttribute("width",65);
     imgHTML.setAttribute("height",24);
     colorBoxes[0].parentNode.replaceChild(imgHTML, colorBoxes[0]);
   }

   var redTriangles = printWin.document.getElementsByClassName("fa fa-exclamation-triangle");
   for(var i = 0; i <redTriangles.length; i ++){
    redTriangles[i].parentNode.remove(redTriangles[i]);
   }
   printWin.document.getElementsByTagName('body')[0].style.background = document.getElementsByTagName("body")[0].style.background;
   printWin.document.getElementsByTagName("body")[0].style.color = document.getElementsByTagName("body")[0].style.color ;
   printWin.document.getElementsByClassName("printTable")[0].style.border = "1px solid " + findContrastor(convertRGBtoHex(document.getElementsByTagName("body")[0].style.background));
   var ths = printWin.document.getElementsByTagName("th");
   var trs = printWin.document.getElementsByTagName("tr");
   var tds = printWin.document.getElementsByTagName("td");
   for(var i =0; i <ths.length; i++){
    ths[i].style.border = "1px solid " + findContrastor(convertRGBtoHex(document.getElementsByTagName("body")[0].style.background));
   }
   for(var i =0; i <trs.length; i++){
    trs[i].style.border = "1px solid " + findContrastor(convertRGBtoHex(document.getElementsByTagName("body")[0].style.background));
   }
   for(var i =0; i <tds.length; i++){
    tds[i].style.border = "1px solid " + findContrastor(convertRGBtoHex(document.getElementsByTagName("body")[0].style.background));
   }
   printWin.focus();
   setTimeout(function(){printWin.print();},100);
}
