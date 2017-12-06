//jsToBeUpdated v2 2015 Pan & Zoom
//js file to be amended by student and used in the 6CS003 "Graphics and Artificial Intelligence" module
//by Dr Sarah Slater 2015

/*jslint browser:true */
/*global drawLine*/
/*global zoomAndPan*/
/*global drawPicture*/
/*global clearGrid*/
/*global window*/
/*global drawShape*/

var composite = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
// data needed to draw picture
// [0] X co-ordinate
// [1] Y co-ordinate
// [2] indicator to decide whether to MOVE pen or DRAW to next co-ordinate
// 1 = move, 2 = draw
var shapeCoords = [
    [-24, 14, 1, "#FFFFCC"], [20, 10, 2, "#FFFFCC"], [18, -10, 2, "#FFFFCC"], [20, -20, 2, "#FFFFCC"], [-30, -20, 3, "#FFFFCC"], //body in cream
    [15, 18, 1, "#FFFFCC"], [22, 12, 2, "#FFFFCC"], [34, -2, 2, "#FFFFCC"], [32, -6, 2, "#FFFFCC"], //right arm
    [30, -10, 2, "#FFFFCC"], [30, -12, 2, "#FFFFCC"], [22, -6, 2, "#FFFFCC"], [19, -2, 2, "#FFFFCC"], [20, 10, 3, "#FFFFCC"],
    [-22, 4, 1, "#D0C0C0"], [-18, 0, 2, "#C0C0C0"], [-15, -10, 2, "#C0C0C0"], [-16, -14, 2, "#C0C0C0"], //front of lightsabre
    [-20, -10, 2, "#C0C0C0"], [-22, -4, 3, "#C0C0C0"],
    [-20, -2, 1, "#00FF00"], [74, 22, 2, "#00FF00"], [76, 20, 2, "#00FF00"], [76, 16, 2, "#00FF00"], [-18, -8, 3, "#00FF00"], //light sabre in green
    [-34, 14, 1, "#FFFFCC"], [-24, 14, 2, "#FFFFCC"], [-30, -20, 2, "#FFFFCC"], [-40, -16, 3, "#FFFFCC"], //left side top
    [-54, -4, 1, "#FFFFCC"], [-50, 6, 2, "#FFFFCC"], [-46, 10, 2, "#FFFFCC"], [-18, 28, 2, "#FFFFCC"], //left arm
    [-22, 14, 2, "#FFFFCC"], [-38, -2, 2, "#FFFFCC"], [-42, -2, 2, "#FFFFCC"], [-46, 0, 2, "#FFFFCC"], [-50, 0, 3, "#FFFFCC"],
    [-22, 14, 1, "#D9D690"], [-20, 20, 2, "#D9D690"], [-10, 12, 3, "#D9D690"], //yoda neck
    [-30, -20, 1, "#8B4513"], [20, -20, 2, "#8B4513"], [20, -22, 2, "#8B4513"], [-30, -22, 3, "#8B4513"],// belt in brown
    [-30, -22, 1, "#FFFFCC"], [20, -22, 2, "#FFFFCC"], [18, -26, 2, "#FFFFCC"], [20, -32, 2, "#FFFFCC"], [2, -34, 2, "#FFFFCC"], [2, -32, 2, "FFFFCC"],//thighs in cream
    [-2, -28, 2, "#FFFFCC"], [-10, -28, 2, "#FFFFCC"], [-12, -32, 2, "#FFFFCC"], [-34, -30, 2, "#FFFFCC"], [-34, -26, 3, "#D9D690"],//thighs in cream
    [2, -34, 1, "#FFFFCC"], [20, -32, 2, "#FFFFCC"], [20, -40, 2, "#FFFFCC"], [2, -42, 3, "#FFFFCC"], //right knee cream
    [2, -42, 1, "#FFFFCC"], [20, -40, 2, "#FFFFCC"], [22, -42, 2, "#FFFFCC"], [4, -44, 3, "#FFFFCC"],
    [4, -44, 1, "#FFFFCC"], [22, -42, 2, "#FFFFCC"], [22, -50, 2, "#FFFFCC"], [4, -52, 3, "#D9D690"], //right foot cream
    [-10, -48, 1, "#FFFFCC"], [-10, -28, 2, "#FFFFCC"], [-2, -28, 2, "#FFFFCC"], [2, -32, 2, "#FFFFCC"],  //side of right foot in cream
    [2, -42, 2, "#FFFFCC"], [4, -44, 2, "#FFFFCC"], [4, -52, 3, "#FFFFCC"],
    [-34, -30, 1, "#FFFFCC"], [-12, -32, 2, "#FFFFCC"], [-12, -40, 2, "#FFFFCC"], [-14, -42, 2, "#FFFFCC"], //left foot knee cream
    [-36, -40, 2, "#FFFFCC"], [-34, -36, 3, "#FFFFCC"],
    [-36, -40, 1, "#FFFFCC"], [-14, -42, 2, "#FFFFCC"], [-12, -44, 2, "#FFFFCC"], [-34, -42, 3, "#FFFFCC"],
    [-34, -42, 1, "#FFFDD0"], [-12, -44, 2, "#FFFDD0"], [-12, -52, 2, "#FFFDD0"], [-34, -50, 3, "#D9D690"], //left foot cream
    [-40, -46, 1, "#FFFFCC"], [-40, -16, 2, "#FFFFCC"], [-30, -20, 2, "#FFFFCC"], [-30, -22, 2, "#FFFFCC"], [-34, -26, 2, "#FFFFCC"], //side of left foot in le cream
    [-34, -36, 2, "#FFFFCC"], [-36, -40, 2, "#FFFFCC"], [-34, -42, 2, "#FFFFCC"], [-34, -50, 3, "#FFFFCC"],
    [-50, 52, 1, "#00FF00"], [-48, 50, 2, "#00FF00"], [-40, 46, 2, "#FFFFCC"], [-28, 42, 2, "#FFFFCC"], //yoda head outline
    [-24, 42, 2, "#00FF00"], [-18, 48, 2, "#00FF00"], [-14, 50, 2, "#FFFFCC"], [-10, 52, 2, "#FFFFCC"],
    [-6, 56, 2, "#00FF00"], [-2, 56, 2, "#00FF00"], [4, 54, 2, "#FFFFCC"], [16, 44, 2, "#FFFFCC"],
    [18, 44, 2, "#00FF00"], [22, 46, 2, "#00FF00"], [32, 50, 2, "#FFFFCC"], [34, 50, 2, "#FFFFCC"],
    [44, 48, 2, "#00FF00"], [40, 46, 2, "#00FF00"], [32, 44, 2, "#FFFFCC"], [26, 40, 2, "#FFFFCC"],
    [20, 32, 2, "#00FF00"], [20, 28, 2, "#00FF00"], [18, 22, 2, "#FFFFCC"], [8, 10, 2, "#FFFFCC"],
    [6, 10, 2, "#00FF00"], [4, 8, 2, "#00FF00"], [2, 8, 2, "#FFFFCC"], [-2, 10, 2, "#FFFFCC"],
    [-10, 12, 2, "#00FF00"], [-20, 20, 2, "#00FF00"], [-22, 22, 2, "#FFFFCC"], [-22, 26, 2, "#FFFFCC"],
    [-24, 28, 2, "#00FF00"], [-30, 28, 2, "#00FF00"], [-34, 30, 2, "#FFFFCC"], [-44, 40, 2, "#FFFFCC"],
    [-48, 44, 2, "#00FF00"], [-50, 48, 3, "#7AA42F"],
    [-12, 30, 1, "#000000"], [-10, 32, 2, "#000000"], [-10, 26, 2, "#000000"],//left eye
    [-12, 28, 3, "#000000"], [-10, 32, 1, "#000000"], [-8, 32, 2, "#000000"], [-8, 26, 2, "#000000"], [-10, 26, 3, "#000000"],
    [-8, 32, 1, "#000000"], [-6, 30, 2, "#000000"], [-6, 28, 2, "#000000"], [-8, 26, 3, "#000000"],
    [-14, 48, 1, "#000000"], [-13, 46, 3, "#000000"], [-6, 50, 1, "#000000"], [-5, 48, 3, "#000000"], [4, 50, 1, "#000000"], [5, 48, 3, "#000000"], //facial features forehead
    [-11, 43, 1, "#000000"], [-10, 41, 3, "#000000"], [-4, 44, 1, "#000000"], [-2, 40, 3, "#000000"], [6, 44, 1, "#000000"], [8, 40, 3, "#000000"], //facial features forehead
    [-18, 42, 1, "#000000"], [-13, 44, 3, "#000000"], [-11, 45, 1, "#000000"], [-8, 46, 2, "#000000"], [-4, 46, 2, "#000000"], [-2, 46, 1, "#000000"], [9, 46, 3, "#000000"], //facial features forehead
    [-20, 36, 1, "#000000"], [-16, 40, 2, "#000000"], [-6, 40, 2, "#000000"], [-2, 38, 2, "#000000"], [0, 36, 2, "#000000"], //left brow
    [6, 36, 1, "#000000"], [10, 40, 2, "#000000"], [14, 40, 2, "#000000"], [18, 37, 2, "#000000"], //right brow
    [-14, 34, 1, "#000000"], [-6, 34, 2, "#000000"], [-2, 32, 2, "#000000"], [0, 30, 2, "#000000"], //left lower brow
    [-16, 24, 1, "#000000"], [-10, 20, 2, "#000000"], [-6, 18, 2, "#000000"], //left cheek line
    [0, 24, 1, "#000000"], [0, 22, 2, "#000000"], [6, 22, 2, "#000000"], [8, 24, 2, "#000000"], //nose
    [-2, 18, 1, "#000000"], [0, 16, 2, "#000000"], [4, 14, 2, "#000000"], [8, 18, 2, "#000000"], //mouth
    [-44, 46, 1, "#000000"], [-30, 40, 2, "#000000"], [-26, 34, 2, "#000000"], [-26, 32, 2, "#000000"], //left ear inside
    [-16, 30, 1, "#000000"], [-12, 32, 2, "#000000"], [-6, 32, 2, "#000000"], [-2, 30, 2, "#000000"], //left eye outline
    [-2, 26, 2, "#000000"], [-6, 24, 2, "#000000"], [-8, 24, 2, "#000000"], [-16, 28, 2, "#000000"], [-16, 30, 2, "#000000"],
    [-12, 26, 1, "#000000"], [-14, 28, 2, "#000000"], [-14, 30, 2, "#000000"], [-12, 32, 2, "#000000"],
    [-6, 32, 1, "#000000"], [-4, 30, 2, "#000000"], [-4, 28, 2, "#000000"], [-6, 26, 2, "#000000"], [-12, 26, 2, "#000000"],
    [6, 30, 1, "#000000"], [6, 28, 2, "#000000"], //nose stem
    [8, 30, 1, "#000000"], [8, 32, 2, "#000000"], [12, 36, 2, "#000000"], [16, 36, 2, "#000000"], //right lower eyebrow
    [22, 42, 1, "#000000"], [30, 46, 2, "#000000"], [36, 47, 2, "#000000"], //ear lining
    [10, 30, 1, "#000000"], [12, 32, 2, "#000000"], [12, 26, 2, "#000000"], [10, 28, 3, "#000000"], //right eye
    [12, 32, 1, "#000000"], [14, 32, 2, "#000000"], [14, 26, 2, "#000000"], [12, 26, 3, "#000000"],
    [14, 32, 1, "#000000"], [16, 30, 2, "#000000"], [16, 28, 2, "#000000"], [14, 26, 3, "#000000"],
    [8, 28, 1, "#000000"], [14, 34, 2, "#000000"], [16, 34, 2, "#000000"], [19, 31, 2, "#000000"], //right eye outline
    [14, 26, 2, "#000000"], [10, 26, 2, "#000000"], [8, 28, 2, "#000000"],
    [13, 33, 1, "#000000"], [15, 33, 2, "#000000"], [17, 31, 2, "#000000"], [17, 29, 2, "#000000"],
    [12, 20, 1, "#000000"], [16, 24, 2, "#000000"],
    [15, 18, 1, "#D9D690"], [20, 10, 2, "#D9D690"], [8, 10, 3, "#D9D690"], //neck
    [-54, -4, 1, "#D9D690"], [-50, 0, 2, "#D9D690"], [-46, 0, 2, "#D9D690"], [-42, -2, 2, "#D9D690"], //left wrist
    [-42, -10, 3, "#D9D690"],
    [-80, -12, 1, "#C0C0C0"], [-80, -20, 2, "#C0C0C0"], [-78, -26, 2, "#C0C0C0"], [-74, -30, 2, "#C0C0C0"], //back of lightsabre
    [-64, -26, 2, "#C0C0C0"], [-68, -22, 2, "#C0C0C0"], [-70, -16, 2, "#C0C0C0"], [-70, -8, 3, "#C0C0C0"],
    [-70, -8, 1, "#D0C0C0"], [-66, -12, 2, "#C0C0C0"], [-63, -22, 2, "#C0C0C0"], [-64, -26, 2, "#C0C0C0"], //back of lightsabre
    [-68, -22, 2, "#C0C0C0"], [-70, -16, 3, "#C0C0C0"],
    [-32, 0, 1, "#C0C0C0"], [-32, -8, 2, "#C0C0C0"], [-30, -14, 2, "#C0C0C0"], [-26, -18, 2, "#C0C0C0"], //front of lightsabre
    [-16, -14, 2, "#C0C0C0"], [-20, -10, 2, "#C0C0C0"], [-22, -4, 2, "#C0C0C0"], [-22, 4, 3, "#C0C0C0"],
    [-68, -12, 1, "#A9A9A9"], [-68, -18, 2, "#A9A9A9"], [-65, -22, 2, "#A9A9A9"], [-29, -15, 2, "#A9A9A9"], //light sabre shaft
    [-30, -14, 2, "#A9A9A9"], [-32, -4, 3, "#A9A9A9"],
    [-64, -8, 1, "#7AA42F"], [-62, -6, 2, "#7AA42F"], [-52, -4, 2, "#7AA42F"], [-44, -4, 2, "#7AA42F"], //left hand  top
    [-52, -10, 2, "#7AA42F"], [-64, -12, 3, "#7AA42F"],
    [-64, -12, 1, "#7AA42F"], [-52, -10, 2, "#7AA42F"], [-44, -4, 2, "#7AA42F"], [-44, -6, 2, "#7AA42F"], //left hand   top
    [-52, -12, 2, "#7AA42F"], [-62, -14, 3, "#7AA42F"],
    [-60, -22, 1, "#7AA42F"], [-60, -19, 2, "#7AA42F"], [-48, -17, 2, "#7AA42F"], [-46, -19, 2, "#7AA42F"], //left hand bottom
    [-42, -18, 2, "#7AA42F"], [-48, -22, 2, "#7AA42F"], [-58, -24, 3, "#7AA42F"],
    [30, -12, 1, "#7AA42F"], [30, -10, 2, "#7AA42F"], [32, -6, 2, "#7AA42F"], [34, -2, 2, "#7AA42F"], //right hand
    [40, 2, 2, "#7AA42F"], [44, 0, 2, "#7AA42F"], [44, -5, 2, "#7AA42F"], [52, -10, 2, "#7AA42F"],
    [52, -14, 2, "#7AA42F"], [42, -8, 2, "#7AA42F"], [42, -4, 2, "#7AA42F"], //right hand
    [40, -2, 2, "#7AA42F"], [38, -2, 2, "#7AA42F"], [34, -8, 2, "#7AA42F"], [38, -14, 2, "#7AA42F"], [48, -18, 2, "#7AA42F"],
    [46, -20, 2, "#7AA42F"], [38, -18, 3, "#7AA42F"],
    [44, 0, 1, "#7AA42F"], [51, -5, 2, "#7AA42F"], [52, -10, 2, "#7AA42F"], [44, -5, 3, "#7AA42F"],
    [48, -18, 1, "#7AA42F"], [38, -14, 2, "#7AA42F"], [34, -8, 2, "#7AA42F"], [38, -2, 2, "#7AA42F"], //right hand
    [40, -2, 2, "#7AA42F"], [42, -4, 2, "#7AA42F"], [42, -8, 2, "#7AA42F"], [48, -12, 3, "#7AA42F"]
];

var wxMin;
var wxMax;
var wyMin;
var wyMax;
var vxMin;
var vxMax;
var vyMin;
var vyMax;

var imageState = true; //if true draw solid shape, if false draw line

function setWindowViewPort() {
    "use strict";
    //returns matrix for multiply, changes what is being displayed/where it is looking
    composite[0][0] = (vxMax - vxMin) / (wxMax - wxMin); //scale x
    composite[0][1] = 0;
    composite[0][2] = -wxMin * ((vxMax - vxMin) / (wxMax - wxMin)) + vxMin; //moving x
    composite[1][0] = 0;
    composite[1][1] = (vyMax - vyMin) / (wyMax - wyMin);//scale y
    composite[1][2] = -wyMin * ((vyMax - vyMin) / (wyMax - wyMin)) + vyMin;//moving y
    composite[2][0] = 0;
    composite[2][1] = 0;
    composite[2][2] = 1;
}

function transformCoordsX(position) {
    "use strict";
    var newX;
    newX = (shapeCoords[position][0] * composite[0][0]) + (shapeCoords[position][1] * composite[0][1]) + (composite[0][2]); //new x coordinate
    return newX;
}

function transformCoordsY(position) {
    "use strict";
    var newY;
    newY = (shapeCoords[position][0] * composite[1][0]) + (shapeCoords[position][1] * composite[1][1]) + (composite[1][2]); //new y coordinate
    return newY;
}

function drawPicture() {
    "use strict";
    var X;
    var Y;
    var i;

    // draw viewport box
    setWindowViewPort();
    //window.alert("vxMin" + vxMin + " vxMax" + vxMax + "\n" + "vyMin" + vyMin + " vyMax" + vyMax);
    clearGrid(true, true, 10);
    for (i = 0; i < 340; i = i + 1) {
        X = transformCoordsX(i);
        Y = transformCoordsY(i);
        drawShape(X, Y, shapeCoords[i][2], imageState, shapeCoords[i][3]);
    }
}

function initialiseExample() {
    "use strict";
    wxMin = -100;
    wxMax = 150;
    wyMin = -100;
    wyMax = 150;
    vxMin = -250;
    vxMax = 250;
    vyMin = -250;
    vyMax = 250;
    drawPicture();
}

function zoomAndPan(direction) {
    "use strict";

    // move 75% to give 25% overlap in both X and Y
    var translateX = 0.75 * (wxMax - wxMin);
    var translateY = 0.75 * (wyMax - wyMin);

    // double window
    if (direction === 5) {
        wxMin /= 2;
        wxMax /= 2;
        wyMin /= 2;
        wyMax /= 2;

    // halve window
    } else if (direction === 0) {
        wxMin *= 2;
        wxMax *= 2;
        wyMin *= 2;
        wyMax *= 2;

    // translate in specified direction
    } else if (direction === 4) {
        wxMax += translateX;
        wxMin += translateX;
    } else if (direction === 6) {
        wxMax -= translateX;
        wxMin -= translateX;
    } else if (direction === 2) {
        wyMax += translateY;
        wyMin += translateY;
    } else if (direction === 8) {
        wyMax -= translateY;
        wyMin -= translateY;
    } else if (direction === 7) {
        wxMax += translateX;
        wxMin += translateX;
        wyMax -= translateY;
        wyMin -= translateY;
    } else if (direction === 9) {
        wyMax -= translateY;
        wyMin -= translateY;
        wxMax -= translateX;
        wxMin -= translateX;
    } else if (direction === 1) {
        wxMax += translateX;
        wxMin += translateX;
        wyMax += translateY;
        wyMin += translateY;
    } else if (direction === 3) {
        wxMax -= translateX;
        wxMin -= translateX;
        wyMax += translateY;
        wyMin += translateY;
    }

    return direction;
}

function panZoom() {
    "use strict";
    var userInput;
    userInput = window.prompt("Enter pan direction, or zoom in/out choice");
    document.getElementById("updates").innerHTML = "You entered " + userInput;
    zoomAndPan(Number(userInput));
    drawPicture();
}

function toggleImageState() {
    "use strict";
    if (imageState === false) {
        imageState = true;
    } else {
        imageState = false;
    }
    drawPicture();
}
