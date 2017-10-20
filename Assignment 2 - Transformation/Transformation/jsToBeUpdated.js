//jsToBeUpdated v2 2015 Rotate, Scale and Translate
//js file to be amended by student and used in the 6CS003 "Graphics and Artificial Intelligence" module
//by Dr Sarah Slater 2015

/*jslint browser:true */
/*global drawLine*/
/*global clearGrid*/
/*global window*/

var newTransform = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
var shapeCoords = [
    [20, 20], [20, 40], [60, 40], [60, 20], [20, 20],  //car outline
    [25, 40], [25, 42], [35, 42], [35, 40],             //tyre upper left
    [45, 40], [45, 42], [55, 42], [55, 40],             //tyre upper right
    [25, 20], [25, 18], [35, 18], [35, 20],             //tyre lower left
    [45, 20], [45, 18], [55, 18], [55, 20],             //tyre lower right
    [23, 24], [23, 36], [45, 36], [45, 24], [23, 24]
]; //car roof
var composite = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
var newComposite = 0;

/* pretty easy to understand
[1 0 0]
[0 1 0]
[0 0 1]
*/
function setUnitMatrixC() {
    "use strict";
    var row;
    var col;
    for (row = 0; row < 3; row = row + 1) {
        for (col = 0; col < 3; col = col + 1) {
            if (row === col) {
                composite[row][col] = 1;
            } else {
                composite[row][col] = 0;
            }
        }
    }
}

/* Draws the car for the first time, its not optimised so students can see exactly how its drawn */
function initialiseExample() {
    "use strict";
    clearGrid(true, true, 10);
    drawLine(shapeCoords[0][0], shapeCoords[0][1], shapeCoords[1][0], shapeCoords[1][1], "red", 1.0);
    drawLine(shapeCoords[1][0], shapeCoords[1][1], shapeCoords[2][0], shapeCoords[2][1], "red", 1.0);
    drawLine(shapeCoords[2][0], shapeCoords[2][1], shapeCoords[3][0], shapeCoords[3][1], "red", 1.0);
    drawLine(shapeCoords[3][0], shapeCoords[3][1], shapeCoords[4][0], shapeCoords[4][1], "red", 1.0);
    drawLine(shapeCoords[5][0], shapeCoords[5][1], shapeCoords[6][0], shapeCoords[6][1], "blue", 1.0); //upper left tyre
    drawLine(shapeCoords[6][0], shapeCoords[6][1], shapeCoords[7][0], shapeCoords[7][1], "blue", 1.0);
    drawLine(shapeCoords[7][0], shapeCoords[7][1], shapeCoords[8][0], shapeCoords[8][1], "blue", 1.0);
    drawLine(shapeCoords[9][0], shapeCoords[9][1], shapeCoords[10][0], shapeCoords[10][1], "blue", 1.0); //upper right tyre
    drawLine(shapeCoords[10][0], shapeCoords[10][1], shapeCoords[11][0], shapeCoords[11][1], "blue", 1.0);
    drawLine(shapeCoords[11][0], shapeCoords[11][1], shapeCoords[12][0], shapeCoords[12][1], "blue", 1.0);
    drawLine(shapeCoords[13][0], shapeCoords[13][1], shapeCoords[14][0], shapeCoords[14][1], "blue", 1.0); //lower left tyre
    drawLine(shapeCoords[14][0], shapeCoords[14][1], shapeCoords[15][0], shapeCoords[15][1], "blue", 1.0);
    drawLine(shapeCoords[15][0], shapeCoords[15][1], shapeCoords[16][0], shapeCoords[16][1], "blue", 1.0);
    drawLine(shapeCoords[17][0], shapeCoords[17][1], shapeCoords[18][0], shapeCoords[18][1], "blue", 1.0); //lower right tyre
    drawLine(shapeCoords[18][0], shapeCoords[18][1], shapeCoords[19][0], shapeCoords[19][1], "blue", 1.0);
    drawLine(shapeCoords[19][0], shapeCoords[19][1], shapeCoords[20][0], shapeCoords[20][1], "blue", 1.0);
    drawLine(shapeCoords[21][0], shapeCoords[21][1], shapeCoords[22][0], shapeCoords[22][1], "red", 1.0); //car roof
    drawLine(shapeCoords[22][0], shapeCoords[22][1], shapeCoords[23][0], shapeCoords[23][1], "red", 1.0);
    drawLine(shapeCoords[23][0], shapeCoords[23][1], shapeCoords[24][0], shapeCoords[24][1], "red", 1.0);
    drawLine(shapeCoords[24][0], shapeCoords[24][1], shapeCoords[25][0], shapeCoords[25][1], "red", 1.0);
    setUnitMatrixC();
}

/* Multiples the two 3 x 3 matrices
[a b c] [j k l]
[d e f] [m n o]
[g h i] [p q r]
*/
function matrixMultiply() {
    "use strict";

    var i;
    var j;
    var k;

    newComposite = new Array(composite.length);

    for (i = 0; i < newComposite.length; i += 1) {
        newComposite[i] = new Array(newTransform[i].length);
        for (j = 0; j < composite.length; j += 1) {
            newComposite[i][j] = 0; // initialise to 0
            for (k = 0; k < newTransform.length; k += 1) {
                newComposite[i][j] += composite[i][k] * newTransform[k][j]; // multiply matrices together
            }
        }
    }
    composite = newComposite;
}

function transformCoordsX(position) {
    "use strict";

    position = (shapeCoords[position][0] * composite[0][0]) + (shapeCoords[position][1] * composite[0][1]) + composite[0][2];

    return position;
}

function transformCoordsY(position) {
    "use strict";

    position = (shapeCoords[position][0] * composite[1][0]) + (shapeCoords[position][1] * composite[1][1]) + composite[1][2];

    return position;
}

function setUnitMatrixT() {
    "use strict";
    var row;
    var col;
    for (row = 0; row < 3; row = row + 1) {
        for (col = 0; col < 3; col = col + 1) {
            if (row === col) {
                newTransform[row][col] = 1;
            } else {
                newTransform[row][col] = 0;
            }
        } // end for loop
    }
}

/* Redraws the final car based on the transformed coordinates kept in the results matrix */
function reDraw() {
    "use strict";
    var results;
    var i;
    results = [
        [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0],
        [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]
    ];
    matrixMultiply();
    for (i = 0; i < 26; i = i + 1) { // calculate new co-ordinate pairs
        results[i][0] = transformCoordsX(i);//new x coordinate
        results[i][1] = transformCoordsY(i);//new y coordinate
    }
    /* again, not pretty code, but its left this way to ease understanding */
    drawLine(results[0][0], results[0][1], results[1][0], results[1][1], "red", 1.0);
    drawLine(results[1][0], results[1][1], results[2][0], results[2][1], "red", 1.0);
    drawLine(results[2][0], results[2][1], results[3][0], results[3][1], "red", 1.0);
    drawLine(results[3][0], results[3][1], results[4][0], results[4][1], "red", 1.0);
    drawLine(results[5][0], results[5][1], results[6][0], results[6][1], "blue", 1.0); //upper left tyre
    drawLine(results[6][0], results[6][1], results[7][0], results[7][1], "blue", 1.0);
    drawLine(results[7][0], results[7][1], results[8][0], results[8][1], "blue", 1.0);
    drawLine(results[9][0], results[9][1], results[10][0], results[10][1], "blue", 1.0); //upper right tyre
    drawLine(results[10][0], results[10][1], results[11][0], results[11][1], "blue", 1.0);
    drawLine(results[11][0], results[11][1], results[12][0], results[12][1], "blue", 1.0);
    drawLine(results[13][0], results[13][1], results[14][0], results[14][1], "blue", 1.0); //lower left tyre
    drawLine(results[14][0], results[14][1], results[15][0], results[15][1], "blue", 1.0);
    drawLine(results[15][0], results[15][1], results[16][0], results[16][1], "blue", 1.0);
    drawLine(results[17][0], results[17][1], results[18][0], results[18][1], "blue", 1.0); //lower right tyre
    drawLine(results[18][0], results[18][1], results[19][0], results[19][1], "blue", 1.0);
    drawLine(results[19][0], results[19][1], results[20][0], results[20][1], "blue", 1.0);
    drawLine(results[21][0], results[21][1], results[22][0], results[22][1], "red", 1.0); //car roof
    drawLine(results[22][0], results[22][1], results[23][0], results[23][1], "red", 1.0);
    drawLine(results[23][0], results[23][1], results[24][0], results[24][1], "red", 1.0);
    drawLine(results[24][0], results[24][1], results[25][0], results[25][1], "red", 1.0);
}

/* Creates the rotate shape matrix ready for the transformation */
function rotateShape() {
    "use strict";
    var radians;
    var sine;
    var cosine;
    var angle;
    var tempNumber;

    tempNumber = window.prompt("Enter Angle of Rotation ");
    angle = Number(tempNumber);
    document.getElementById("updates").innerHTML += "You entered a rotation angle of " + angle + "\u00B0" + "<br>";
    radians = (angle * 3.1415) / 180;
    sine = Math.sin(radians);
    cosine = Math.cos(radians);
    setUnitMatrixT();
    newTransform[0][0] = cosine;
    newTransform[1][0] = -sine;
    newTransform[0][1] = sine;
    newTransform[1][1] = cosine;
    reDraw();
}

/* Creates the scale shape matrix ready for the transformation */
function scaleShape() {
    "use strict";
    var tempx;
    var tempy;
    setUnitMatrixT();
    tempx = window.prompt("Enter Scale in X");
    tempy = window.prompt("Enter Scale in Y");
    newTransform[0][0] = Number(tempx);
    newTransform[1][1] = Number(tempy);
    document.getElementById("updates").innerHTML += "You entered Scale " + newTransform[0][0] + " in X" + "<br>" + "You entered Scale " + newTransform[1][1] + " in Y" + "<br>";
    reDraw();
}

/* Creates the translate shape matrix ready for the transformation */
function translateShape() {
    "use strict";
    var tempx;
    var tempy;
    setUnitMatrixT();
    tempx = window.prompt("Enter Translate in X");
    tempy = window.prompt("Enter Translate in Y");
    newTransform[0][2] = Number(tempx);
    newTransform[1][2] = Number(tempy);
    document.getElementById("updates").innerHTML += "You entered Translate " + newTransform[0][2] + " in X" + "<br>" + "You entered Translate " + newTransform[1][2] + " in Y" + "<br>";
    reDraw();
}