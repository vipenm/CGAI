//Common functions used in the 6CS003 "Graphics and Artificial Intelligence" module
//based on Java application originally written by Arline Wilson.
//this version was written by Dr Sarah Slater 2014

/*global initialiseExample*/
/*global drawGrid*/
/*global clearGrid*/
/*jslint browser:true */

var theCanvas = null;
var ctx = null;

/*sets context of canvas ready for use
 takes 3 parameters
 renderGrid is a boolean that decides if to display the grid if true
 cartesianOn is a boolean that decides if to display the Cartesian overlay if true
 grid Spacing is how far apart grid lines should be drawn and is an integer
*/
function firstLoad(renderGrid, cartesianOn, gridSpacing) {
    "use strict";
    theCanvas = document.getElementById('myCanvas');
    ctx = theCanvas.getContext('2d');
    clearGrid(renderGrid, cartesianOn, gridSpacing);
    initialiseExample();
}

/* draws the axis lines, and labelling*/
function drawCartesianOverlay() {
    "use strict";
    //Draw heavier black lines for grid
    ctx.beginPath();
    ctx.moveTo(0.5, 300.5);
    ctx.lineTo(800.5, 300.5);
    ctx.moveTo(400.5, 0.5);
    ctx.lineTo(400.5, 600.5);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1.0;
    ctx.stroke();
    //-x arrow for line
    ctx.beginPath();
    ctx.moveTo(5.5, 295.5);
    ctx.lineTo(0.5, 300.5);
    ctx.lineTo(5.5, 305.5);
    //+x arrow for line
    ctx.moveTo(795.5, 295.5);
    ctx.lineTo(800.5, 300.5);
    ctx.lineTo(795.5, 305.5);
    //+y arrow for line
    ctx.moveTo(395.5, 5.0);
    ctx.lineTo(400.5, 0.5);
    ctx.lineTo(405.5, 5.0);
    //-y arrow for line
    ctx.moveTo(395.5, 595.5);
    ctx.lineTo(400.5, 600.5);
    ctx.lineTo(405.5, 595.5);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1.0;
    ctx.stroke();
    //Label Graphs
    ctx.font = "9px Georgia";
    ctx.fillText("-x", 1, 288);
    ctx.fillText("+", 790, 288);
    ctx.fillText("x", 795, 288);
    ctx.fillText("-y", 382, 597);
    ctx.fillText("+", 381, 8);
    ctx.fillText("y", 386, 8);
}

//scales x coordinate from screen space to Cartesian points
function scaleX(passedX) {
    "use strict";
    var tempX = Number(passedX) + 400;
    return tempX;
}

//scales x coordinate from screen space to Cartesian points
function scaleY(passedY) {
    "use strict";
    var tempY = 300 - Number(passedY);
    return tempY;
}

//draws radius in green from centre of circle obviously
function drawRadius(x, y, r) {
    "use strict";
    var scaledX, scaledY;
    //draws a line across the radius    
    scaledX = scaleX(Number(x));
    scaledY = scaleY(Number(y));
    ctx.beginPath();
    ctx.moveTo(scaledX, scaledY);
    ctx.lineTo(scaledX + r, scaledY);
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 1.0;
    ctx.stroke();
}

//draws a red cross at the centre of the circle
function drawCross(x, y) {
    "use strict";
    var scaledX, scaledY;
    //draws a red x at the origin
    scaledX = scaleX(Number(x));
    scaledY = scaleY(Number(y));
    ctx.beginPath();
    ctx.moveTo(scaledX - 5, scaledY - 5);
    ctx.lineTo(scaledX + 5, scaledY + 5);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1.0;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(scaledX - 5, scaledY + 5);
    ctx.lineTo(scaledX + 5, scaledY - 5);
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1.0;
    ctx.stroke();
}

//draws a line between two points on the canvas in a colour of your choice
function drawLine(x1, y1, x2, y2, clr) {
    "use strict";
    var scaledX1, scaledY1, scaledX2, scaledY2;
    scaledX1 = scaleX(Number(x1));
    scaledY1 = scaleY(Number(y1));
    scaledX2 = scaleX(Number(x2));
    scaledY2 = scaleY(Number(y2));
    //origin
    ctx.beginPath();
    ctx.moveTo(scaledX1, scaledY1);
    ctx.lineTo(scaledX2, scaledY2);
    ctx.strokeStyle = clr;
    ctx.lineWidth = 1.0;
    ctx.stroke();
}

//clears canvas and redraws it
function clearGrid(renderGrid, cartesianOn, gridSpacing) {
    "use strict";
    ctx.clearRect(0, 0, 800, 600);
    if (renderGrid === true) {
        drawGrid(gridSpacing);
    }
    if (cartesianOn === true) {
        drawCartesianOverlay();
    }
}

//draws the grid of lines in the spacing chosen
function drawGrid(gridSpacing) {
    "use strict";
    var row, column;
    ctx.beginPath();
    //draw rows
    for (row = 0.5; row <= 600.5; row = row + gridSpacing) {
        ctx.moveTo(0.5, row);
        ctx.lineTo(800.5, row);
        ctx.strokeStyle = "#C8C8C8";
        ctx.lineWidth = 1.0;
        ctx.stroke();
    }
    //draw columns
    for (column = 0.5; column <= 800.5; column = column + gridSpacing) {
        ctx.moveTo(column, 0.5);
        ctx.lineTo(column, 800);
        ctx.strokeStyle = "#C8C8C8";
        ctx.lineWidth = 1.0;
        ctx.stroke();
    }
}
