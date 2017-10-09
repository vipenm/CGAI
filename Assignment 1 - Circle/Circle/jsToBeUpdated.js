//jsToBeUpdated v2 2017 Circle
//js file to be amended by student and used in the 6CS003 "Graphics and Artificial Intelligence" module
//this version was written by Dr Sarah Slater 2015

/*jslint browser:true */
/*global drawCross*/
/*global drawLine*/
/*global window*/
/*global clearGrid*/

var steps = 0; //used to stop text on the side bar scrolling off the screen1

/*
    solution here
*/
function drawCircle(x, y, r, nSteps) {
    "use strict";

    var angleInDegrees = 360 / nSteps;
    var angleInRadians = angleInDegrees * (Math.PI / 180);

    /*hold original x and y coordinates*/
    var originX = x;
    var originY = y;

    var xCoord = 0;
    var yCoord = 0;
    var i = 0;
    x = x + r;

   for (i = 1; i <= nSteps; i += 1) {

        //calculate points on a circle
        xCoord = r * Math.cos(angleInRadians * i) + originX;
        yCoord = r * Math.sin(angleInRadians * i) + originY;

        drawLine(Number(x), Number(y), Number(xCoord), Number(yCoord), "blue", 1.0);

        //store new coordinates
        x = xCoord;
        y = yCoord;

    }
}

//displays user input
function displaySideText(x, y, r, nSteps) {
    "use strict";
    if (steps < 6) {
        document.getElementById("updates").innerHTML += "(X,Y) of Centre (" + x + "," + y + ")" + "<br>" + "Radius " + r + "<br>" + "Number of Steps " + nSteps + "<br>" + "<br>";
        steps = steps + 1;
    } else {
        document.getElementById("updates").innerHTML = "(X,Y) of Centre (" + x + "," + y + ")" + "<br>" + "Radius " + r + "<br>" + "Number of Steps " + nSteps + "<br>" + "<br>";
        steps = 0;
    }
}

//nothing drawn initially but needed for main library
function initialiseExample() {
    "use strict";
    clearGrid(true, true, 10);
    displaySideText(0, 0, 100, 30);
    drawLine(0, 0, 100, 0, "green", 4.0); //Draw radius
    drawCross(0, 0);
    drawCircle(0, 0, 100, 30);
    return;
}

//asks user for X coordinate for Circle and validates it
function getUserXInput() {
    "use strict";
    var userX;
    var valid;
    valid = false;
    while (!valid) {
        userX = window.prompt("Enter x co-ordinate for centre of Circle" + "\n" + "Acceptable range is integers between -400 and +400", "");
        if (Number(userX) < -400 || Number(userX) > 400) {
            window.alert("You Entered: " + userX + "\n" + "Acceptable range is integers between -400 and +400" + "\n" + "Please try again");
            valid = false;
        } else {
            valid = true;
        }
    }
    return userX;
}

//asks user for Y coordinate for Circle and validates it
function getUserYInput() {
    "use strict";
    var userY;
    var valid;
    valid = false;
    while (!valid) {
        userY = window.prompt("Enter y co-ordinate for centre of Circle" + "\n" + "Acceptable range is integers between -300 and +300", "");
        if (Number(userY) < -300 || Number(userY) > 300) {
            window.alert("You Entered: " + userY + "\n" + "Acceptable range is integers between -250 and +250" + "\n" + "Please try again");
            valid = false;
        } else {
            valid = true;
        }
    }
    return userY;
}

/* function that does most of the main work
   gets initial user input
   displays user inputs
   displays the radius and cross graphics on the grid
   calls drawCircle() diamond appears of course
  */
function newCircle() {
    "use strict";
    var x;
    var y;
    var r;
    var nSteps;
    x = getUserXInput();
    y = getUserYInput();
    r = window.prompt("Enter radius of Circle", "");
    nSteps = window.prompt("Enter number of steps to be drawn around Circle", "");
    clearGrid(true, true, 10);
    displaySideText(x, y, r, nSteps);
    drawLine(Number(x), Number(y), Number(x) + Number(r), Number(y), "green", 1.0); //Draw radius
    drawCross(Number(x), Number(y));
    drawCircle(Number(x), Number(y), Number(r), Number(nSteps));
}