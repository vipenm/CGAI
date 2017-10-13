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
    // replace the following two lines with the correct code
    drawLine(arrayX[0], arrayY[0], (arrayX[0] + arrayX[1] + arrayX[2] + arrayX[3]) / 4, (arrayY[0] + arrayY[1] + arrayY[2] + arrayY[3]) / 4, 'blue');
    drawLine((arrayX[0] + arrayX[1] + arrayX[2] + arrayX[3]) / 4, (arrayY[0] + arrayY[1] + arrayY[2] + arrayY[3]) / 4, arrayX[3], arrayY[3], 'blue');
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
    var i, j;
    clearGrid(true, true, 10); //clear canvas area ready for redraw
    //draw 4 crosses at control points
    for (i = 0; i <= 3; i = i + 1) {
        drawCross(arrayX[i], arrayY[i]);
    }
    //draw lines connecting points in blue
    for (j = 0; j <= 2; j = j + 1) {
        drawLine(arrayX[j], arrayY[j], arrayX[j + 1], arrayY[j + 1], 'red');
    }
    displaySideText();
    drawBezierCurve();
}

function alterControlPoint() {
    "use strict";
    var tempx, tempy, point;
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