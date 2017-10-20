//js file to be amended by student and used in the 6CS003 "Graphics and Artificial Intelligence" module
//by Dr Sarah Slater 2014

/*jslint browser:true */
/*global drawCross*/
/*global drawLine*/
/*global displaySideText*/
/*global drawBezierCurve*/
/*global clearGrid*/
/*global window*/

var arrayX = [-200, -100, 100, 200];
var arrayY = [200, -200, -200, 200];
var nSteps = 4;

function drawBezierCurve() {
    "use strict";

    var x;
    var y;
    var t;
    var i;

    //assign new variables to equal the original
    var oldX = arrayX[0];
    var oldY = arrayY[0];

    //get resolution
    t = 1 / nSteps;

    var tIncrement = t;


    for (i = 0; i < nSteps; i += 1) {

        //input variables into cubic equation
        x = Math.pow((1 - t), 3) * arrayX[0] + (3 * Math.pow((1 - t), 2)) * t * arrayX[1] + (3 * (1 - t)) * Math.pow(t, 2) * arrayX[2] + Math.pow(t, 3) * arrayX[3];
        y = Math.pow((1 - t), 3) * arrayY[0] + (3 * Math.pow((1 - t), 2)) * t * arrayY[1] + (3 * (1 - t)) * Math.pow(t, 2) * arrayY[2] + Math.pow(t, 3) * arrayY[3];

        drawLine(oldX, oldY, x, y, "blue");

        //update original variables with new ones so it moves to the end of the previously drawn line
        oldX = x;
        oldY = y;

        //increment resolution so the the equation is updated to draw the next line
        t += tIncrement;
    }
}

// points array
function displaySideText() {
    "use strict";
    var i;
    for (i = 1; i < 5; i = i + 1) {
        document.getElementById("updates").innerHTML += "Point " + i + " is " + "(" + arrayX[i - 1] + "," + arrayY[i - 1] + ")" + "<br>";
    }
    document.getElementById("updates").innerHTML += "Number of Steps :" + nSteps;
}

function initialiseExample() {
    "use strict";
    var i;
    var j;

    clearGrid(true, true, 10); //clear canvas area ready for redraw
    //draw 4 crosses at control points
    for (i = 0; i <= 3; i = i + 1) {
        drawCross(arrayX[i], arrayY[i]);
    }
    //draw lines connecting points in blue
    for (j = 0; j <= 2; j = j + 1) {
        drawLine(arrayX[j], arrayY[j], arrayX[j + 1], arrayY[j + 1], "red");
    }
    displaySideText();
    drawBezierCurve();
}

function alterControlPoint() {
    "use strict";
    var tempx;
    var tempy;
    var point;

    point = window.prompt("Enter number of point you want to change (1-4)", "");
    if (0 < point && point < 5) {
        window.alert("You chose to change point " + point + "\n" + "Old X = " + arrayX[point - 1] + "\n" + "Old Y = " + arrayY[point - 1]);
        tempx = window.prompt("Enter X co-ordinate (range -250 to 250", ""); //get new X
        tempy = window.prompt("Enter Y co-ordinate (range -250 to 250", ""); //get new Y
        arrayX[point - 1] = Number(tempx); //cast input as numerical data
        arrayY[point - 1] = Number(tempy); //cast input as numerical data
        document.getElementById("updates").innerHTML = ""; //clear side bar ready for new data
        clearGrid(true, true, 10); //clear canvas area ready for redraw
        initialiseExample(); //draw curves
    }
}

function alterSteps() {
    "use strict";
    var tempsteps;
    tempsteps = window.prompt("Enter number of steps for your curve");
    nSteps = Number(tempsteps);
    document.getElementById("updates").innerHTML = ""; //clear side bar ready for new data
    clearGrid(true, true, 10); //clear canvas area ready for redraw
    initialiseExample(); //draw curves
}