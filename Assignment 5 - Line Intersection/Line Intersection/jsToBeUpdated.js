//js file to be amended by student and used in the 6CS003 "Graphics and Artificial Intelligence" module Task 5
//based on Java application originally written by Arline Wilson.
//this version was written by Dr Sarah Slater 2014

/*jslint browser:true */
/*global drawLine*/
/*global drawLines*/
/*global clearGrid*/
/*global nextLine*/


// test data needed to create one of each type of intersection
// [0] X1 co-ordinate
// [1] Y1 co-ordinate
// [2] X2 co-ordinate
// [3] Y2 co-ordinate
var shapeCoords = [[-200, -200, 100, -100], [-50, 0, -100, 100],  //first pair of lines - intersection type 3
                   [100, 200, 150, 150], [100, 100, 200, 200], //second pair of lines - type 2
                   [-200, -50, -50, -200], [-50, -50, -125, -125], //third pair of lines - type 1 
                   [50, -50, 100, -150], [100, -50, 150, -150], //fourth pair of lines - type -1
                   [-200, -200, -50, 100], [200, -200, 50, 100], //fifth pair of lines - type 0
                   [-100, -100, 100, 100], [100, -100, -100, 100], //sixth pair of lines - type -2 
                   [-100, -200, -100, 50], [-100, -100, -100, 100], //seventh pair of lines - vertical co-linear
                   [-200, -200, 200, -200], [-100, 100, 100, 100]]; //eighth pair of lines - horizontal parallel
var drawCounter = 0;
var result = [0, 0, 0];

function initialiseExample() {
    "use strict";
    nextLine();
}

function lineIntersection(x1Coord1, y1Coord1, x1Coord2, y1Coord2, x2Coord1, y2Coord1, x2Coord2, y2Coord2) {
    "use strict";
    // replace the following three lines of code with the correct code
    result[0] = 0;
    result[1] = 0;
    result[2] = 0;
}

function nextLine() {
    "use strict";
    drawLines(drawCounter);
    drawCounter = drawCounter + 1;
    if (drawCounter > 7) {
        drawCounter = 0;
    }
}

function drawLines() {
    "use strict";
    var x1f, y1f, x2f, y2f, x1s, y1s, x2s, y2s, xResult, yResult, intersection;
    clearGrid(true, true, 10);
    x1f = shapeCoords[drawCounter * 2][0];
    y1f = shapeCoords[drawCounter * 2][1];
    x2f = shapeCoords[drawCounter * 2][2];
    y2f = shapeCoords[drawCounter * 2][3];
    x1s = shapeCoords[drawCounter * 2 + 1][0];
    y1s = shapeCoords[drawCounter * 2 + 1][1];
    x2s = shapeCoords[drawCounter * 2 + 1][2];
    y2s = shapeCoords[drawCounter * 2 + 1][3];
    // calculate co-ordinates of line intersection (if they do cross)
    lineIntersection(x1f, y1f, x2f, y2f, x1s, y1s, x2s, y2s);
    xResult = result[0];
    yResult = result[1];
    intersection = result[2];
    if (intersection > -1) {
        drawLine(x1f, y1f, xResult, yResult, 'red');
        drawLine(x2f, y2f, xResult, yResult, 'red');
        drawLine(x1s, y1s, xResult, yResult, 'red');
        drawLine(x2s, y2s, xResult, yResult, 'red');
    }
    //draw first line and then second line
    drawLine(x1s, y1s, x2s, y2s, 'blue');
    drawLine(x1f, y1f, x2f, y2f, 'blue');
    switch (intersection) {
    case 3: // True intersection
        document.getElementById("updates").innerHTML = "True intersection at (" + xResult + "," + yResult + ")" + "<br>";
        break; // end True intersection
    case 2: // On line seg 2 only
        document.getElementById("updates").innerHTML = "On line seg 2 only at (" + xResult + "," + yResult + ")" + "<br>";
        break; // end On line seg 2 only
    case 1: // On line seg 1 only
        document.getElementById("updates").innerHTML = "On line seg 1 only at (" + xResult + "," + yResult + ")" + "<br>";
        break; // end On line seg 1 only
    case 0: // Not on either line segment
        document.getElementById("updates").innerHTML = "Not on either line segment" + "<br>" + "Intersection would be at " + "<br>" + "(" + xResult + "," + yResult + ")" + "<br>";
        break; // end Not on either line segment
    case -1: // Parallel Lines
        document.getElementById("updates").innerHTML = "Parallel Lines" + "<br>";
        break; // end Parallel Lines
    case -2: // Co-linear lines
        document.getElementById("updates").innerHTML = "Co-linear lines" + "<br>";
        break; // end Co-linear lines
    default:
        document.getElementById("updates").innerHTML = "invalid intersection" + "<br>" + "No recalculation of co-ordinates done" + "<br>";
        break;
    } // end switch
}
