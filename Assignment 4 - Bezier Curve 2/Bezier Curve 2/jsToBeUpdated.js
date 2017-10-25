//jsToBeUpdated v2 2015 Bezier
//to be amended by student and used in the 6CS003 "Graphics and Artificial Intelligence" module
//by Dr Sarah Slater 2015

/*jslint browser: true*/
/*global drawCross*/
/*global drawLine*/
/*global displaySideText*/
/*global drawBezierCurve*/
/*global clearGrid*/
/*global window*/
/*global displayText*/
/*global changeBackgroundColour*/

//define 7 sets of points to be used on quadratic bezier curves
var points = [[-340, 90], [-320, 280], [-190, 220],
        [-190, 220], [-120, 190], [-85, 110],
        [-85, 110], [-35, -15], [105, 40],
        [105, 40], [185, 75], [275, -10],
        [275, -10], [345, -70], [225, -160],
        [225, -160], [75, -270], [-90, -215],
        [-90, -215], [-355, -120], [-340, 90]];

var nSteps = 300; //greater value bette the curve :)
var totalPoints = 21; //used to manage total points on curves
var lineWidth = 100; //used to allow different width of bezier curves to be drawn
var gridState = true; //flag for grid to be toggled on and off
var curveState = true; //flag used to toggle curve on and off

function drawBezierCurve() {
    "use strict";

    var x;
    var y;
    var t;
    var i;

    //assign new variables to equal the original
    var oldX;
    var oldY;

    //get resolution
    t = 1 / nSteps;

    var tIncrement = t;

    for (var j = 0; j < 3; j += 3) {
        oldX = points[j][0];
        oldY = points[j][1];

        for (i = 0; i < nSteps; i += 1) {

            //input variables into quadratic equation

            x = Math.pow((1 - t), 2) * points[j][0] + 2 * (1 - t) * t * points[j + 1][0] + Math.pow(t, 2) * points[j + 2][0];
            y = Math.pow((1 - t), 2) * points[j][1] + 2 * (1 - t) * t * points[j + 1][1] + Math.pow(t, 2) * points[j + 2][1];


            drawLine(oldX, oldY, x, y, "black", lineWidth);

            //increment resolution so the the equation is updated to draw the next line
            t += tIncrement;

            //update original variables with new ones so it moves to the end of the previously drawn line
            oldX = x;
            oldY = y;
        }
    }
}

//keeps the side bar information up to date
function displaySideText() {
    "use strict";
    var i, count = 0;
    document.getElementById("updates").innerHTML = "";
    for (i = 0; i <= totalPoints - 1; i = i + 1) {
        if ((i !== 2) && (i !== 5) && (i !== 8) && (i !== 11) && (i !== 14) && (i !== 17) && (i !== 20)) {
            count = count + 1;
            document.getElementById("updates").innerHTML += "Point " + count + " is " + "(" + points[i][0] + "," + points[i][1] + ")" + "<br>";
        }
    }
    document.getElementById("updates").innerHTML += "<br>" + "Number of Steps :" + nSteps;
    document.getElementById("updates").innerHTML += "<br>" + "Line Width :" + lineWidth;
}

function displayScreen() {
    "use strict";
    var i, j, count = 0;
    //draw crosses at control points
    for (i = 0; i <= totalPoints - 1; i = i + 1) {
        drawCross(points[i][0], points[i][1]);
    }
    //draw lines connecting points in blue
    for (j = 0; j <= totalPoints - 2; j = j + 1) {
        drawLine(points[j][0], points[j][1], points[j + 1][0], points[j + 1][1], 'red', 1.0);
    }
    displaySideText();
    if (curveState === true) {
        drawBezierCurve(); //draw track
    }
    //Draw text on the curve indicating the points
    for (i = 0; i <= totalPoints; i = i + 1) {
        if ((i !== 2) && (i !== 5) && (i !== 8) && (i !== 11) && (i !== 14) && (i !== 17) && (i !== 20)) {
            count = count + 1;
            displayText((points[i][0] - 20), points[i][1], ("P" + count), 'black', 1.0);
        }
    }
}

//Entry Point for application
function initialiseExample() {
    "use strict";
    clearGrid(true, true, 10);
    displayScreen();
}

//allows user to move control points for bezier curves
function alterControlPoint() {
    "use strict";
    var point, tempx, tempy;
    point = window.prompt("Enter number of the point you want to change 1-" + (totalPoints * (2 / 3)), "");
    if ((point > 0) && (point < (totalPoints * (2 / 3)))) {
        tempx = window.prompt("Enter X co-ordinate (range -400 to 400", ""); //get new X
        tempy = window.prompt("Enter Y co-ordinate (range -300 to 300", ""); //get new Y
        switch (Number(point)) {
        case 1:
            points[0][0] = tempx;
            points[0][1] = tempy;
            points[20][0] = tempx;
            points[20][1] = tempy;
            break;
        case 2:
            points[1][0] = tempx;
            points[1][1] = tempy;
            break;
        case 3:
            points[2][0] = tempx;
            points[2][1] = tempy;
            points[3][0] = tempx;
            points[3][1] = tempy;
            break;
        case 4:
            points[4][0] = tempx;
            points[4][1] = tempy;
            break;
        case 5:
            points[5][0] = tempx;
            points[5][1] = tempy;
            points[6][0] = tempx;
            points[6][1] = tempy;
            break;
        case 6:
            points[7][0] = tempx;
            points[7][1] = tempy;
            break;
        case 7:
            points[8][0] = tempx;
            points[8][1] = tempy;
            points[9][0] = tempx;
            points[9][1] = tempy;
            break;
        case 8:
            points[10][0] = tempx;
            points[10][1] = tempy;
            break;
        case 9:
            points[11][0] = tempx;
            points[11][1] = tempy;
            points[12][0] = tempx;
            points[12][1] = tempy;
            break;
        case 10:
            points[13][0] = tempx;
            points[13][1] = tempy;
            break;
        case 11:
            points[14][0] = tempx;
            points[14][1] = tempy;
            points[15][0] = tempx;
            points[15][1] = tempy;
            break;
        case 12:
            points[16][0] = tempx;
            points[16][1] = tempy;
            break;
        case 13:
            points[17][0] = tempx;
            points[17][1] = tempy;
            points[18][0] = tempx;
            points[18][1] = tempy;
            break;
        case 14:
            points[19][0] = tempx;
            points[19][1] = tempy;
            break;
        }
        if (gridState === false) {
            clearGrid(false, false, 10);
            changeBackgroundColour('green');
            displayScreen(); //draw curves
        } else {
            clearGrid(true, true, 10);
            displayScreen(); //draw curves
        }
    } else {
        window.alert(point + " is not a Valid Point, 1-14 only. Please try again!");
    }
}

//Speaks for itself, adjust the smoothness of the bezier curve
function alterSteps() {
    "use strict";
    var tempsteps;
    tempsteps = window.prompt("Enter number of steps for your curve");
    nSteps = Number(tempsteps);
    document.getElementById("updates").innerHTML = ""; //clear side bar ready for new data
    clearGrid(true, true, 10); //clear canvas area ready for redraw
    displayScreen(); //draw curves
}

//Adjust the main bezier curve thickness
function increaseLineWidth() {
    "use strict";
    lineWidth = lineWidth + 1;
    if (gridState === false) {
        clearGrid(false, false, 10);
        changeBackgroundColour('green');
        displayScreen(); //draw curves
    } else {
        clearGrid(true, true, 10);
        displayScreen(); //draw curves
    }
}

//Adjust the main bezier curve thickness
function decreaseLineWidth() {
    "use strict";
    if (lineWidth > 0) {
        lineWidth = lineWidth - 1;
    }
    if (gridState === false) {
        clearGrid(false, false, 10);
        changeBackgroundColour('green');
        displayScreen(); //draw curves
    } else {
        clearGrid(true, true, 10);
        displayScreen(); //draw curves
    }
}

//allows grid to be switched on and off
function toggleGrid() {
    "use strict";
    if (gridState === true) {
        clearGrid(false, false, 10);
        gridState = false;
        changeBackgroundColour('green');
        displayScreen(); //draw curves
    } else {
        clearGrid(true, true, 10);
        gridState = true;
        displayScreen(); //draw curves
    }
}

//allows curve to be switched on and off
function toggleCurve() {
    "use strict";
    if (gridState === false) { //ensures background is maintained regardless if curve is shown or not
        clearGrid(false, false, 10);
        changeBackgroundColour('green');
    } else {
        clearGrid(true, true, 10);
    }
    if (curveState === true) { //toggles curve flag and redraws
        curveState = false;
    } else {
        curveState = true;
    }
    displayScreen(); //redraw
}