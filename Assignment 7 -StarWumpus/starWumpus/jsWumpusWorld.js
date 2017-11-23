//jsWumpusWorld v2 2016
//Core functions used in Wumpus World agent testbed for the 6CS003 "Graphics and Artificial Intelligence" module
//Written by Dr Desmond Case 2016

/*jslint browser:true */
/*global loadImages*/
/*global clearGrid*/
/*global displayImages*/
/*global scaleX*/
/*global scaleY*/
/*global ctx*/
/*global theCanvas*/
/*global alert*/
/*global confirm*/

var DirEnum = {north: 0, east: 1, south: 2, west: 3};
var PercEnum = {stench: 0, breeze: 1, bump: 2, glitter: 3, scream: 4, feel: 5};
var GpEnum = {exit: 1, wumpus: 2, control: 3, pit: 4, weapon: 5};
var ModeEnum = {fullGame: 0, agentTest: 1, manualTest: 2, agentQuest: 3};

var scenery = [[0, 0, 0, 4, 1, 4, 0, 0],
               [0, 4, 0, 0, 0, 2, 0, 0],
               [0, 0, 0, 4, 2, 0, 0, 4],
               [0, 2, 4, 0, 0, 0, 0, 0],
               [0, 0, 0, 5, 0, 0, 4, 0],
               [4, 0, 4, 0, 2, 4, 4, 0],
               [0, 0, 2, 0, 0, 0, 0, 0],
               [0, 0, 0, 0, 4, 3, 4, 0]];
var quest = [[[0, 0, 0, 0, 0, 4, 0, 0], [0, 4, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 4], [4, 0, 4, 0, 4, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 4, 0], [4, 0, 4, 4, 0, 4, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 4, 0, 0, 0, 4, 0]],
        [[0, 0, 0, 0, 0, 0, 0, 0], [0, 4, 0, 0, 0, 0, 4, 0],
        [0, 4, 0, 4, 4, 0, 4, 0], [0, 0, 0, 4, 0, 0, 4, 0],
        [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 4, 0, 0, 4, 4, 0],
        [0, 0, 4, 0, 0, 0, 4, 0], [0, 0, 0, 0, 0, 0, 0, 0]],
        [[0, 4, 0, 0, 0, 0, 0, 0], [0, 4, 0, 0, 4, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 4], [0, 0, 4, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 4, 0], [4, 0, 4, 4, 0, 0, 4, 0],
        [0, 0, 0, 0, 0, 0, 0, 0], [0, 0, 4, 0, 0, 0, 4, 0]]];

var gameMode = ModeEnum.manualTest;
var refreshIntervalId;
var gridState = true;
var ImgGold, ImgLSabre, ImgBones, ImgPit, ImgFloor, ImgDead;
var HeroImg = [0, 0, 0, 0];
var CtrlImg = [0, 0];
var ImgExit = [0, 0, 0, 0];
var SenseImg = [0, 0, 0, 0];
var ImgSt1 = [0, 0, 0, 0];
//var ImgSt2 = [0, 0, 0, 0];  // not used
//var ImgSt3 = [0, 0, 0, 0];  // not used
var FightImg = [0, 0, 0, 0];
var game;

function GamePiece() {
    "use strict";
    this.name;
    this.message;
    this.x;
    this.y;
}

function GamePiece_construct(name, point, adjacentMessage, touchingMessage) {
    "use strict";
    this.name = name;
    this.adjacentMessage = adjacentMessage;
    this.touchingMessage = touchingMessage;
    this.x = point.x;
    this.y = point.y;
    return this;
}

/* Checks to see if this game piece is in an adjacent space to the argument game piece */
function GamePiece_isAdjacent(gp) {
    "use strict";
    var x, y, space, left, front, right;
    x = game.hero.x;
    y = game.hero.y;
    space = game.board.space;
    switch (game.hero.facing) {
        case DirEnum.north:   // North  y is up/down, x is left/right
            left = (x + 1 > game.xMax ? x : x + 1);
            front = (y + 1 > game.yMax ? y : y + 1);
            right = (x - 1 < 0 ? x : x - 1);
            return space[left][y] === gp || space[x][front] === gp || space[right][y] === gp;
        case DirEnum.east:   // East
            left = (y + 1 > game.yMax ? y : y + 1);
            front = (x - 1 < 0 ? x : x - 1);
            right = (y - 1 < 0 ? y : y - 1);
            return space[x][left] === gp || space[front][y] === gp || space[x][right] === gp;
        case DirEnum.south:   // South
            left = (x - 1 < 0 ? x : x - 1);
            front = (y - 1 < 0 ? y : y - 1);
            right = (x + 1 > game.xMax ? x : x + 1);
            return space[left][y] === gp || space[x][front] === gp || space[right][y] === gp;
        case DirEnum.west:   // West
            left = (y - 1 < 0 ? y : y - 1);
            front = (x + 1 > game.xMax ? x : x + 1);
            right = (y + 1 > game.yMax ? y : y + 1);
            return space[x][left] === gp || space[front][y] === gp || space[x][right] === gp;
    }
    return false;
}

/* Checks to see if this game piece is touching (i.e. in the same space) as the argument game piece */
function GamePiece_isTouching(gp) {
    "use strict";
    if ( this.x === gp.x &&  this.y === gp.y ) {
        return true;
    } else {
        return false;
    }
}

GamePiece.prototype.construct = GamePiece_construct;
GamePiece.prototype.isAdjacent = GamePiece_isAdjacent;
GamePiece.prototype.isTouching = GamePiece_isTouching;
// GamePiece.prototype.move = GamePiece_move;

// StormTrooper
function StormTrooper(point) {
    "use strict";
    var gp = new GamePiece();
    gp.alive = true;
    return gp.construct("Stormtroopers",point,"You sense danger","You have been killed by a Stormtrooper!");
}

// Bats
function Bats(point) {
    "use strict";
    var gp = new GamePiece();
    return gp.construct("Bats",point,"You hear flapping","Bats carried you away!");
}

// Pit
function Pit(point) {
    "use strict";
    var gp = new GamePiece();
    return gp.construct("Pit",point,"You feel a breeze","You fell down a pit!");
}

// Hero
function Hero(point) {
    "use strict";
    var gp = new GamePiece();
    gp.fight = 0;
    gp.havelightsaber = false;
    gp.alive = true;
    gp.facing = DirEnum.north;
    gp.percept = [false, false, false, "dark", "silence", "nothing"];
    var p = Object.create(null);
    p.x = 7;
    p.y = 0;
    return gp.construct("Hero",p,"","");
}

// Weapon
function Weapon(point) {
    "use strict";
    var gp = new GamePiece();
    gp.onFloor = true;
    return gp.construct("Lightsaber",point,"You see a glimmer","You find your lightsaber");
}

// Gold
function Gold(point) {
    "use strict";
    var gp = new GamePiece();
    gp.onFloor = true;
    return gp.construct("Gold",point,"You see a glimmer","You found the gold!");
}

// Control Panel
function Control(point) {
    "use strict";
    var gp = new GamePiece();
    gp.active = true;
	gp.light = 0;
    return gp.construct("Control Panel",point,"You see a glimmer","You have found the control panel");
}

// Exit
function Exit(point) {
    var gp = new GamePiece();
	gp.open = false;
	gp.state = 0;
    return gp.construct("Exit",point,((gp.open == false) ? "Your way is barred": "The door is open"),"You have found the exit");
}

function Sense() {
    var gp = new GamePiece();
	gp.count = 0;
    return gp.construct("",{"x":0, "y":0},"","You search with your feelings");
}

function Sound() {
    this.isOn = true;
    this.event = {sndStep: null, sndTurn: null, sndMain: null, sndFire: null, sndFall: null, 
                  sndGold: null, sndExit1: null, sndExit2: null, sndLSabr: null, sense: null, 
                  sndBGMusic: [null, null, null, null],  sndStTalk: [null, null, null], activeTune:null};
}

function Sound_init() {
    this.event.sndStep = document.getElementById("sndStep");
    this.event.sndMain = document.getElementById("sndMain");
    this.event.sndFire = document.getElementById("sndFire");
    this.event.sndTurn = document.getElementById("sndTurn");

    this.event.sndFall = document.getElementById("sndFall");
    this.event.sndGold = document.getElementById("sndGold");
    this.event.sndExit1 = document.getElementById("sndExit1");
    this.event.sndExit2 = document.getElementById("sndExit2");

    this.event.sndLSabr = document.getElementById("sndLSabr");
    this.event.sense   = document.getElementById("sndEcho");

    this.event.sndStTalk[0] = document.getElementById("sndSt-1");
    this.event.sndStTalk[1] = document.getElementById("sndSt-2");
    this.event.sndStTalk[2] = document.getElementById("sndSt-3");

    this.event.sndBGMusic[0] = document.getElementById("sndBackG1");
    this.event.sndBGMusic[1] = document.getElementById("sndBackG2");
    this.event.sndBGMusic[2] = document.getElementById("sndBackG3");
    this.event.sndBGMusic[3] = document.getElementById("sndBackG4");

	this.event.sndMain.volume = 0.5;
    this.event.sndMain.currentTime = 0;
    this.event.sndMain.play();
}

function playBackGround(){
    var choice = Math.floor((Math.random() * game.sound.event.sndBGMusic.length));
    var music = game.sound.event.sndBGMusic[choice];
    
    music.loop = true;
    music.volume = 0.1;

    music.currentTime = 0;
    music.play();
    game.sound.event.activeTune = music;
}

function Sound_play(soundEvent) {
    if (this.isOn) {
        soundEvent.currentTime = 0;
        soundEvent.play();
    }
}

function Sound_toggle() {
    var arr = Object.keys(this.event), i = 0;
    this.isOn = !this.isOn;
    if (this.isOn) {
        this.event.activeTune.currentTime = 0;
        this.event.activeTune.play();
    }
    else {
        this.event.activeTune.pause();
        for (i = 0; i < arr.length; i += 1) {
            this.event[arr[i]].pause();
        }
    }
}

Sound.prototype.init = Sound_init;
Sound.prototype.play = Sound_play;
Sound.prototype.toggle = Sound_toggle;

// All-encompassing game object
function Game() {
    "use strict";
    this.width; // width of board in spaces
    this.height; // height of board in spaces
    this.xMax;  // width-1 limit of the board
    this.yMax;  // height-1 limit of the board
    this.arrowsLeft;
    this.feedback;
    this.board;
    this.hero;
    this.agent;
    this.pit;
    //this.gold;
    this.control;
    this.door;
    this.sense;
    this.bats;
    //this.wumpus;
    this.bumpBuffer;
    this.trooper = [null, null, null, null, null];
}

function Game_configure(){
    "use strict";
    var defaultWidth = 5;
    var defaultHeight = 5;
    var minWidth = 2;
    var minHeight = 2;
    var maxWidth = 12;
    var maxHeight = 12;

    this.arrowsLeft = 5;
    this.bumpBuffer = false;
    this.feedback = new Feedback();

    this.board = this.buildBoard();

    this.width = this.board.space[0].length;
    this.height = this.board.space.length;

    if ( this.width > maxWidth || this.height > maxHeight ) {
        alert("That's a biting off more than you can chew.");
        this.width = defaultWidth;
        this.height = defaultHeight;
    }
    if ( this.width < minWidth || this.height < minHeight ) {
        alert("Please. Let's try something more interesting.");
        this.width = defaultWidth;
        this.height = defaultHeight;
    }
    this.xMax = this.width - 1;
    this.yMax = this.height - 1;
    
    this.sound = new Sound();
    this.sound.init();

	setTimeout(playBackGround, 9000);                   
    loadImages();
}

function Game_init() {
    "use strict";
    var i = 0;
    clearInterval(refreshIntervalId);

    this.bats = new Bats(this.board.getRandomSpace());
    //highlight(myBats.x,myBats.y,"purple");

    // Random EMPTY space -- not the same place as bats
    this.pit = new Pit(this.board.getRandomEmptySpace());
    //highlight(myPit.x,myPit.y,"black");

    // Random space -- may be same place as bats or pit!
    for (i = 0; i < this.trooper.length; i += 1){
        this.trooper[i] = new StormTrooper(this.board.position.trooper[i]);
    }

    this.lightsaber = new Weapon(this.board.position.weapon);

    //this.gold  = new Gold(this.board.getRandomEmptySpace());
    this.control  = new Control(this.board.position.control);

    this.door  = new Exit(this.board.position.door);

    this.sense  = new Sense();
    
    this.hero = new Hero(this.board.getRandomEmptySpace());

    // This is really a poor way of doing this; there is no need for the array
    this.board.space[this.hero.x][this.hero.y] = this.hero;

    this.agent = new Agent(this.hero);
    this.agent.init();
    // Call move to highlight, check adjacent
    clearGrid(gridState, false, 40);
    game.feedback.clear();
//    setTimeout(game.draw, 750); // don't know why the direct call fails
	refreshIntervalId = setInterval(game.draw, 1000); // update every second
    
//	setTimeout(playBackGround, 9000);               
    return this;
}

function Game_draw() {
    "use strict";
    displayImages();
}

function Game_win() {
    "use strict";
    if (game.sound.event.activeTune){
        game.sound.event.activeTune.pause();
        game.sound.event.activeTune = null;
    }
    if (confirm("You WIN!!! New game?")) {
        game.init();
    } else {
        game.end();
    }
}

function Game_lose() {
    "use strict";
    this.feedback.addMessage("Our last hope is gone!");
    if (game.sound.event.activeTune){
        game.sound.event.activeTune.pause();
        game.sound.event.activeTune = null;
    }
    if (confirm("You lose! New game?")) {
        //clearGrid(gridState, false, 40);
        game.init();
    } else {
        game.end();
    }
}

function Game_loop() {
    "use strict";
    doMove(game.agent.process());
}

function Game_end() {
    "use strict";
    gameMode = ModeEnum.manualTest;
    clearInterval(refreshIntervalId);
    return 0;
}

// Should this be a method of GameBoard, e.g. board.build or board.buildHTML?
function Game_buildBoard() {
    "use strict";
    var myBoard = new GameBoard();
    return myBoard;
}

function Game_findTrooper(x1, y1){
    var i;
    for (i = 0; i < this.trooper.length; i += 1){
        if (this.trooper[i] && this.trooper[i].x == x1 && this.trooper[i].y == y1){
            return this.trooper[i];
        }
    }
    return this.trooper[0]; // default to something safe
}

Game.prototype.configure = Game_configure;
Game.prototype.init = Game_init;
Game.prototype.draw = Game_draw;
Game.prototype.win = Game_win;
Game.prototype.lose = Game_lose;
Game.prototype.buildBoard = Game_buildBoard;
Game.prototype.loop = Game_loop;
Game.prototype.end = Game_end;
Game.prototype.findTrooper = Game_findTrooper;

function GameBoard() {
    "use strict";
    var source = [];
    var stCount = 0;
    var i = 0;
    var j = 0;
    if (gameMode === ModeEnum.agentQuest){
        source = quest[Math.random() * quest.length].slice();
    }
    else{
        source = scenery.slice();
    }
    this.position = {door: null, control: null, weapon: null, trooper: [null, null, null, null, null]};
    for (i = 0; i < source.length; i += 1){
        for (j = 0; j < source[0].length; j += 1){
            switch(source[i][j]){
                case GpEnum.exit:
                    this.position.door = { "x":i, "y":j };
                    break;
                case GpEnum.control:
                    this.position.control = { "x":i, "y":j };
                    break;
                case GpEnum.weapon:
                    this.position.weapon = { "x":i, "y":j };
                    break;
                case GpEnum.wumpus:
                    this.position.trooper[stCount] = { "x":i, "y":j };
                    stCount += 1;
                    break;
            }
        }
    }
    this.space = source;
}

function GameBoard_getRandomSpace() {
    "use strict";
    var point = this.getRandomPoint();
    // This is rather horrible--we have a 2-dimensional array that is largely unnecessary except to store this
    this.space[point.x][point.y] = "occupied";
    return point;
}

function GameBoard_getRandomEmptySpace() {
    "use strict";
    var point = this.getRandomPoint();
    if ( this.space[point.x][point.y] === 0 ) {
        // This is rather horrible--we have a 2-dimensional array that is largely unnecessary except to store this
        // this.space[point.x][point.y] = "occupied";
        return { "x":point.x, "y":point.y };
    } else {
        return this.getRandomEmptySpace();
    }
}

function GameBoard_getRandomPoint() {
    "use strict";
    return { "x":Math.floor(Math.random()*this.space.length), "y":Math.floor(Math.random()*this.space[0].length) };
}

GameBoard.prototype.getRandomSpace = GameBoard_getRandomSpace;
GameBoard.prototype.getRandomPoint = GameBoard_getRandomPoint;
GameBoard.prototype.getRandomEmptySpace = GameBoard_getRandomEmptySpace;

function Feedback() {
    "use strict";
    if ( !document.getElementById("feedback") ) {
        //create feedback element
        var feedbackElement = document.createElement('div');
        // set ID of feedback element
        feedbackElement.id = "feedback";
        // Append feedback element to HTML body
        document.getElementsByTagName("body")[0].appendChild(feedbackElement);
    }
    this.message = document.getElementById("updates");
    this.compass = ["North","East","South","West"];
    return this;
}

function Feedback_addMessage(msg) {
    "use strict";
    this.message.innerHTML += msg + "<br>";
}

function Feedback_clear() {
    "use strict";
    this.message.innerHTML = "";
}

Feedback.prototype.addMessage = Feedback_addMessage;
Feedback.prototype.clear = Feedback_clear;

function initialiseExample() {
    "use strict";
    game = new Game();
    game.configure();
    game.init();
}

function toggleGrid() {
    "use strict";
    if (gridState === true) {
        clearGrid(false, false, 40);
        gridState = false;
        displayImages();
    } else {
        clearGrid(true, false, 40);
        gridState = true;
        displayImages();
    }
}

function loadImages() {
    "use strict";
    var imgToLoad = 4, imgLoaded = 0;
    var onImgLoad = function () {
        imgLoaded = imgLoaded + 1;
    };
    ImgFloor = new Image();
    ImgFloor.src = 'images/floor.png';
    ImgFloor.onload = onImgLoad;
    ImgPit = new Image();
    ImgPit.src = 'images/pit5.png'; // 'images/blade1.png';
    ImgBones = new Image();
    ImgBones.src = 'images/bones.png';

    ImgExit[0] = new Image();
    ImgExit[0].src = 'images/door0.png';
    ImgExit[1] = new Image();
    ImgExit[1].src = 'images/door1.png';
    ImgExit[2] = new Image();
    ImgExit[2].src = 'images/door2.png';
    ImgExit[3] = new Image();
    ImgExit[3].src = 'images/door3.png';
    
    ImgLSabre = new Image();
    ImgLSabre.src = 'images/LSaber1.png';

    CtrlImg[0] = new Image();
    CtrlImg[0].src = 'images/control-off.png';
    CtrlImg[1] = new Image();
    CtrlImg[1].src = 'images/control-on.png';
    
    FightImg[1] = new Image();
    FightImg[1].src = 'images/ls3.png';
    FightImg[2] = new Image();
    FightImg[2].src = 'images/flash.png';
    FightImg[3] = new Image();
    FightImg[3].src = 'images/ls4.png';


    HeroImg[DirEnum.north] = new Image();
    HeroImg[DirEnum.north].src = 'images/luke-north.png';
    HeroImg[DirEnum.north].onload = onImgLoad;
    HeroImg[DirEnum.east] = new Image();
    HeroImg[DirEnum.east].src = 'images/luke-east.png';
    HeroImg[DirEnum.east].onload = onImgLoad;
    HeroImg[DirEnum.south] = new Image();
    HeroImg[DirEnum.south].src = 'images/luke-south.png';
    HeroImg[DirEnum.south].onload = onImgLoad;
    HeroImg[DirEnum.west] = new Image();
    HeroImg[DirEnum.west].src = 'images/luke-west.png';
    HeroImg[DirEnum.west].onload = onImgLoad;
    ImgDead = new Image();
    ImgDead.src = 'images/luke-dead.png';
    ImgDead.onload = onImgLoad;

    SenseImg[DirEnum.north] = new Image();
    SenseImg[DirEnum.north].src = 'images/sense-north.png';
    SenseImg[DirEnum.east] = new Image();
    SenseImg[DirEnum.east].src = 'images/sense-east.png';
    SenseImg[DirEnum.south] = new Image();
    SenseImg[DirEnum.south].src = 'images/sense-south.png';
    SenseImg[DirEnum.west] = new Image();
    SenseImg[DirEnum.west].src = 'images/sense-west.png';
    
    ImgSt1[DirEnum.north] = new Image();
    ImgSt1[DirEnum.north].src = 'images/st1-north.png';
    ImgSt1[DirEnum.east] = new Image();
    ImgSt1[DirEnum.east].src = 'images/st1-east.png';
    ImgSt1[DirEnum.south] = new Image();
    ImgSt1[DirEnum.south].src = 'images/st1-south.png';
    ImgSt1[DirEnum.west] = new Image();
    ImgSt1[DirEnum.west].src = 'images/st1-west.png';
}

/* draws the axis lines, and labelling*/
function drawBoarder(x1, y1, x2, y2) {
    "use strict";
    //Draw heavier black lines for grid
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x1, y2);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1.0;
    ctx.stroke();
    ctx.closePath();
}

function adjustX(posX) {
    "use strict";
    return ((game.width-posX) * 40) - 200;
}

function adjustY(posY) {
    "use strict";
    return posY * 40 - 140;
}

function displayImages() {
    "use strict";
    var X1, Y1, i, j, height, width, ist, jst, item, hx, hy;
    //calculation to keep it in the middle of the screen
    height = game.height;
    ist = Math.round((15 - height) / 2);
    width = game.width;
    jst = Math.round((20 - width) / 2);
    X1 = ((ist + 2) * 40);
    Y1 = ((jst - 2) * 40);
    drawBoarder(X1, Y1, X1 + (height * 40), Y1 + (width * 40));

    //display Scenery
    if (gameMode !== ModeEnum.fullGame){
        for (i = 0; i < height; i = i + 1) {
            for (j = 0; j < width; j = j + 1) {
                item = game.board.space[i][j];
                X1 = scaleX(adjustX(Number(i)));
                Y1 = scaleY(adjustY(Number(j)));
                ctx.drawImage(ImgFloor, X1, Y1);
                switch (item) {
                    case GpEnum.exit:
                    case GpEnum.wumpus:
                    case GpEnum.pit:
                    case GpEnum.weapon:
                    case GpEnum.control:
                        switch (item) {
                            case GpEnum.exit:
                                if (game.door.open == true){ 
                                    if (game.door.state < 3){
                                        game.door.state += 1;
                                    }
                                }
                                else if (game.door.state > 0){
                                    game.door.state -= 1;
                                }
                                ctx.drawImage(ImgExit[game.door.state], X1, Y1);
                                break;
                            case GpEnum.wumpus:
                                var trooper = game.findTrooper(i, j);
                                if (trooper.alive) {
                                    var face = Math.round( Math.atan2((j-game.hero.y), (i-game.hero.x)));
                                    switch (face){
                                        case -1:
                                        case -2:
                                            face = DirEnum.north;
                                            break;
                                        case 2:
                                            face = DirEnum.south;
                                            break;
                                        case 3:
                                            face = DirEnum.west;
                                            break;
                                        case 1:
                                        default:
                                            face = DirEnum.east;
                                            break;
                                        
                                    }
                                    ctx.drawImage(ImgSt1[face], X1, Y1);
                                }
                                else {
                                    ctx.drawImage(ImgBones, X1, Y1);
                                }
                                break;
                            case GpEnum.control:
                                if (game.control.active){
								    game.control.light = (game.control.light + 1) % 8;	
                                    ctx.drawImage(CtrlImg[(game.control.light < 3? 0 : 1)], X1, Y1);
                                }
								else{
                                    ctx.drawImage(CtrlImg[0], X1, Y1);
								}
                                break;
                            case GpEnum.pit:
                                ctx.drawImage(ImgPit, X1, Y1);
                                break;
                            case GpEnum.weapon:
                                if (game.lightsaber.onFloor){
                                    ctx.drawImage(ImgLSabre, X1, Y1);
                                }
                                break;
                        }
                        break;
                }
            }
        }
    }
    //display User/Luke/Hero
    hx = game.hero.x;
    hy = game.hero.y;
    X1 = scaleX(adjustX(Number(hx)));
    Y1 = scaleY(adjustY(Number(hy)));
    if (game.hero.alive === true) {
		ctx.drawImage(HeroImg[game.hero.facing], X1, Y1);
	}
	else {
		ctx.drawImage(ImgDead, X1, Y1);
	}
    if (game.hero.fight > 0) {
        ctx.drawImage(FightImg[game.hero.fight], X1, Y1);
        game.hero.fight -= 1;
    }
    if (game.sense.count > 0){ 
        X1 = scaleX(adjustX(Number(game.sense.x)));
        Y1 = scaleY(adjustY(Number(game.sense.y)));
        ctx.drawImage(SenseImg[game.hero.facing], X1, Y1);
        game.sense.count -= 1;
    }
}

function doKeyDown(e) {
    "use strict";
    // Clear feedback panel
    game.feedback.clear();
    // Move the hero
    switch(e.keyCode){
        case 119: //W Key - Forward
            doMove("forward");
            break;
        case 115: //S Key - Backward
            doMove("back");
            break;
        case 97:  //A Key - turn left
            doMove("left");
            break;
        case 100: //D Key - turn right
            doMove("right");
            break;
        case 117: //U Key - use
            doMove("use");
            break;
        case 108: //L Key - sense
            doMove("sense");
            break;
    }
}

function doMove(e) {
    "use strict";
    var tempx, tempy, hx, hy, face;
//    game.hero.percept = [false, false, false, "dark", "silence", "nothing"];
    game.hero.percept = [false, false, game.bumpBuffer, "dark", "silence", "nothing"];
    game.bumpBuffer = false;
    hx = game.hero.x;
    hy = game.hero.y;
    face = game.hero.facing;
    if (e === "forward") { 
        if (face % 2 === 0){  // North or South
            tempy = hy; // Player[1];
            if (face === DirEnum.north){  // North
                tempy = (tempy < game.yMax ? tempy + 1 : tempy);
            }
            else if (face === DirEnum.south){  // South
                tempy = (tempy > 0 ? tempy - 1 : tempy);
            }
//            game.hero.percept[PercEnum.bump] = (game.hero.y === tempy);  // bump!
            game.bumpBuffer = (game.hero.y === tempy);  // bump!
            game.hero.y = tempy;   //Player[1] = tempy;
        }
        else{
            tempx = hx; // Player[0];
            if (face === DirEnum.east){  // East
                tempx = (tempx > 0 ? tempx - 1 : tempx);
            }
            else if (face === DirEnum.west){  // West
                tempx = (tempx < game.xMax ? tempx + 1 : tempx);
            }
//            game.hero.percept[PercEnum.bump] = (game.hero.x === tempx); // bump!
            game.bumpBuffer = (game.hero.x === tempx); // bump!
            game.hero.x = tempx;   //Player[0] = tempx;
        }
        game.sound.play(game.sound.event.sndStep);
    }
    if (e === "back") { 
        if (face % 2 === 0){  // North or South
            tempy = hy; // Player[1];
            if (face === DirEnum.north){  // North
                tempy = (tempy > 0 ? tempy - 1 : tempy);
            }
            else if (face === DirEnum.south){  // South
                tempy = (tempy < game.yMax ? tempy + 1 : tempy);
            }
//            game.hero.percept[PercEnum.bump] = (game.hero.y === tempy); // bump!
            game.bumpBuffer = (game.hero.y === tempy); // bump!
            game.hero.y = tempy;   //Player[1] = tempy;
        }
        else{
            tempx = hx; // Player[0];
            if (face === DirEnum.east){  // East
                tempx = (tempx < game.xMax ? tempx + 1 : tempx);
            }
            else if (face === DirEnum.west){  // West
                tempx = (tempx > 0 ? tempx - 1 : tempx);
            }
//            game.hero.percept[PercEnum.bump] = (game.hero.x === tempx);  // bump!
            game.bumpBuffer = (game.hero.x === tempx);  // bump!
            game.hero.x = tempx;   //Player[0] = tempx;
        }
        game.sound.play(game.sound.event.sndStep);
    }
    if (e === "left") { 
        game.hero.facing = (face === 0) ? 3 : (face - 1);
        game.sound.play(game.sound.event.sndTurn);
   }
    if (e === "right") { 
        game.hero.facing = (face + 1) % 4;
        game.sound.play(game.sound.event.sndTurn);
    }
    if (e === "use") {
        var gob = game.board.space[game.hero.x][game.hero.y];
        switch (gob){
            case 3:
                game.control.active = !game.control.active;
                game.door.open = !game.door.open;
                break;
            case 5:
                game.lightsaber.onFloor = false;
                game.hero.havelightsaber = true;
                break;
        }
    }
    if (e == "sense") {
        var isWumpus = false, isCave = false;
        switch (face){
            case DirEnum.north:  // N
                hy = (hy < game.yMax ? hy + 1 : hy);
                isWumpus = game.board.space[game.hero.x][hy] === GpEnum.wumpus;
                isCave = game.board.space[game.hero.x][hy] === GpEnum.pit;
                game.sense.x = game.hero.x;
                game.sense.y = hy;
                break;            
            case DirEnum.east:  // E
                hx = (hx > 0 ? hx - 1 : hx);
                isWumpus = game.board.space[hx][game.hero.y] === GpEnum.wumpus;
                isCave = game.board.space[hx][game.hero.y] === GpEnum.pit;
                game.sense.x = hx;
                game.sense.y = game.hero.y;
                break;            
            case DirEnum.south:  // S
                hy = (hy > 0 ? hy - 1 : hy);            
                isWumpus = game.board.space[game.hero.x][hy] === GpEnum.wumpus;
                isCave = game.board.space[game.hero.x][hy] === GpEnum.pit;
                game.sense.x = game.hero.x;
                game.sense.y = hy;
                break;            
            case DirEnum.west:  // W
                hx = (hx < game.xMax ? hx + 1 : hx);            
                isWumpus = game.board.space[hx][game.hero.y] === GpEnum.wumpus;
                isCave = game.board.space[hx][game.hero.y] === GpEnum.pit;
                game.sense.x = hx;
                game.sense.y = game.hero.y;
                break;            
        }
        game.sense.count = 2;
        game.sound.play(game.sound.event.sense);
        if (isWumpus){
            game.hero.percept[PercEnum.scream] = "disturbance";
        }
        if (isCave){
            game.hero.percept[PercEnum.scream] = "danger";
            game.hero.percept[PercEnum.breeze] = true;
        }
        game.feedback.addMessage(game.hero.percept);
    }
    clearGrid(gridState, false, 40);
    game.draw();

    // Updated feedback with current position
    if (gameMode == ModeEnum.fullGame || gameMode === ModeEnum.manualTest){
        game.feedback.addMessage("You are at " + game.hero.x + "," + game.hero.y + " - facing " + game.feedback.compass[game.hero.facing]);
    }
    if ( !checkTouch() ) {
        // otherwise, check if it is next to anything
        checkAdjacent();
    }
    if (gameMode === ModeEnum.agentTest || gameMode === ModeEnum.manualTest){
        game.feedback.addMessage(game.hero.percept);
    }
}

function checkTouch() {
    var isTouchingAnythingDangerous = false;
    var item = game.board.space[game.hero.x][game.hero.y];
    if (item != 0){
        if ( item === GpEnum.pit ) { // pit
            isTouchingAnythingDangerous = true;
            game.feedback.addMessage(game.pit.touchingMessage);
            game.sound.play(game.sound.event.sndFall);
            // end game
            game.lose();
        }
        if ( item === GpEnum.wumpus) { // wumpus
            var trooper = game.findTrooper(game.hero.x, game.hero.y);
            if (trooper.alive) {
                if (game.hero.havelightsaber == true){
                    
                    game.feedback.addMessage("Open a can of Jedi Wupp Ass!!");
                    game.sound.play(game.sound.event.sndLSabr);
                    game.hero.fight = 3;
                    game.hero.percept[PercEnum.scream] = "scream";
                    trooper.alive = false;  // dead wumpus 
                }
                else {
                    isTouchingAnythingDangerous = true;
                    game.feedback.addMessage(game.trooper[0].touchingMessage);
                    game.sound.play(game.sound.event.sndFire);
                    game.sound.play(game.sound.event.sndFall);
                    game.hero.alive = false;
                    // end game - lose
                    setTimeout(callLose, 2000);            
                }
            }
        }
        if ( item === GpEnum.control && game.control.active) {  // gold
            game.feedback.addMessage(game.control.touchingMessage);
            game.hero.percept[PercEnum.feel] = "control-panel"; // = "gold";
        } 
        if ( item === GpEnum.weapon && game.lightsaber.onFloor) {  // arrows
            game.feedback.addMessage(game.lightsaber.touchingMessage);
            game.hero.percept[PercEnum.feel] = "lightsaber";  // = "arrows";
        } 
        if ( item === GpEnum.exit &&  game.door.open == true) {  // exit
            game.sound.play(game.sound.event.sndExit1);
            // end game - win
			setTimeout(callWin, 5000);            
        }
        return isTouchingAnythingDangerous;
    }
}

function callLose() {
    game.lose();
}

function callWin() {
    game.sound.play(game.sound.event.sndExit2); // Vader
    game.win();
}

function checkAdjacent() {
//    game.feedback.addMessage("Adjacent to something???"); if (game.wumpus.alive) {
    if ( game.hero.isAdjacent(GpEnum.wumpus)){ // && game.trooper.alive) { //fix this later
        game.hero.percept[PercEnum.stench] = true;
        game.feedback.addMessage(game.trooper[0].adjacentMessage);
        game.sound.play(game.sound.event.sndStTalk[Math.floor((Math.random() * 3))]);
    }
    if ( game.hero.isAdjacent(GpEnum.weapon) && game.lightsaber.onFloor) {
        game.hero.percept[PercEnum.glitter] = "lightsaber";
        game.feedback.addMessage(game.lightsaber.adjacentMessage);
        game.sound.play(game.sound.event.sndGold);
    }
    if ( game.hero.isAdjacent(GpEnum.control) && game.control.active) {
        game.hero.percept[PercEnum.glitter] = "control-panel";
        game.feedback.addMessage(game.control.adjacentMessage);
        game.sound.play(game.sound.event.sndGold);
    }
    if ( game.hero.isAdjacent(GpEnum.exit) ) {
        game.hero.percept[PercEnum.glitter] = "door";
        game.feedback.addMessage(game.door.adjacentMessage);
        game.sound.play(game.sound.event.sndGold);
    }
    if ( game.hero.isAdjacent(GpEnum.pit) ) {
        game.hero.percept[PercEnum.breeze] = true;
        game.feedback.addMessage(game.pit.adjacentMessage);
    }
}

// ===== Different game modes for the UI =====
function wumpusGame(){
    gameMode = ModeEnum.fullGame;
    game.init();
}

function agentTestMode(){
    gameMode = ModeEnum.agentTest;
    game.init();
    refreshIntervalId = setInterval(game.loop, 1000);
}

function manualTestMode(){
    gameMode = ModeEnum.manualTest;
    game.init();
}

function randomMapMode(){
    gameMode = ModeEnum.agentQuest;
    game.init();
    refreshIntervalId = setInterval(game.loop, 1000);
}

function toggleSound(){
    game.sound.toggle();
}