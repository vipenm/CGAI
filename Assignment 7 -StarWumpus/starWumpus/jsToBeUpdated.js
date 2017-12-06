//js file to be amended by students and used in the 6CS003 "Graphics and Artificial Intelligence" module
//Written by Dr Desmond Case 2016
/*jslint browser:true */
/*global Leaf*/
/*global Selector*/
/*global Sequence*/
/*global PercEnum*/
// ================================================
// =                Behaviours                    =
// = Each behaviour is an object that implements  =
// = run method that sends an action back to the  -
// = environment.
// ================================================
// Moves the avatar forward one step
function Forward(status) {
    "use strict";
    Leaf.call(this);
    this.state = status;
}

Forward.prototype.run = function () {
    "use strict";
    this.state.action = "forward";
    return true;
};

// Turns the avatar to the right
function Right(status) {
    "use strict";
    Leaf.call(this);
    this.state = status;
}

Right.prototype.run = function () {
    "use strict";
    this.state.action = "right";
    return true;
};

// Turns the avatar to the left
function Left(status) {
    "use strict";
    Leaf.call(this);
    this.state = status;
}

Left.prototype.run = function () {
    "use strict";
    this.state.action = "left";
    return true;
};

// Issue the Jedi sense command
function JediSense(status) {
    "use strict";
    Leaf.call(this);
    this.state = status;
}

JediSense.prototype.run = function () {
    "use strict";
    this.state.action = "sense";
    return true;
};

// Issue command to use a nearby object
function Use(status) {
    "use strict";
    Leaf.call(this);
    this.state = status;
}

Use.prototype.run = function () {
    "use strict";
    this.state.action = "use";
    return true;
};

// Sense if the agent is near to any danger
function NearDanger(status) {
    "use strict";
    Leaf.call(this);
    this.state = status;
}

NearDanger.prototype.run = function () {
    "use strict";
    var breeze = this.state.percepts[PercEnum.breeze];
    var stench = this.state.percepts[PercEnum.stench];
    return breeze === false && stench === false; // then its safe
};

// Sense if we have hit a wall
function Bump(status) {
    "use strict";
    Leaf.call(this);
    this.state = status;
}

Bump.prototype.run = function () {
    "use strict";
    var bump = this.state.percepts[PercEnum.bump];
    return bump === true; // hit the wall?
};

// Tingle from the agent's Jedi sense
function Tingle(status) {
    "use strict";
    Leaf.call(this);
    this.state = status;
}

Tingle.prototype.run = function () {
    "use strict";
    var scream = this.state.percepts[PercEnum.scream];
    return scream === "silence";
};

// Tingle from the agent's Jedi sense
function Stormtrooper(status) {
    "use strict";
    Leaf.call(this);
    this.state = status;
}

Stormtrooper.prototype.run = function () {
    "use strict";
    var scream = this.state.percepts[PercEnum.scream];
    return scream === "disturbance";
};

function Interactable(status) {
    "use strict";
    Leaf.call(this);
    this.state = status;
}

Interactable.prototype.run = function () {
    "use strict";
    var feel = this.state.percepts[PercEnum.feel];
    return feel === "nothing";
};
// ================================================
// =               KnowledgeBase                  =
// ================================================
function Memory() {
    "use strict";
    this.percepts = null; // sensors from NPC
    this.action = "";     // action to NPC
}
// Method called by the game to initialise the agent
function Memory_clearAction() {
    "use strict";
    this.action = "";
}
// Method called by the game to initialise the agent
function Memory_NoAction() {
    "use strict";
    return this.action === "";
}
Memory.prototype.clearAction = Memory_clearAction;
Memory.prototype.noAction = Memory_NoAction;

// ================================================
// =       BT agent for wumpus world              =
// ================================================
function Agent(hero) {
    "use strict";
    // the line below must NOT be changed
    // allows information from the game NPC
    this.hero = hero;  // pointer to the NPC
}

// Method called by the game to initialise the agent
// Note: below is for example purposes, you are free to delete/edit/hack
// it to your hearts content to engineer the agent behaviour you need
function Agent_init() {
    "use strict";
    // data for your AI can be initialised here
    var knowledgeBase = new Memory();

    // our top level/root behaviour
    var root = new Selector();

    // Create Actions
    var forward = new Forward(knowledgeBase); // go forward
    var right = new Right(knowledgeBase); // turn right
    var left = new Left(knowledgeBase); // turn left
    var bump = new Bump(knowledgeBase); // detect when hit a wall
    var use = new Use(knowledgeBase);    // interacts with item
    var sense = new JediSense(knowledgeBase); // sense if there is danger directly in front
    var goNoGo = new NearDanger(knowledgeBase); // if safe from stormtroopers or caves
    var tingle = new Tingle(knowledgeBase); // returns object from jedi sense
    var stormtrooper = new Cave(knowledgeBase); // returns if object in front is stormtrooper
    var interactable = new Interactable(knowledgeBase); // returns interactable object

    // Some sub-sequences -
    var seq1 = new Selector();
    var seq2 = new Sequence();
    var seq3 = new Sequence();
    var seq4 = new Sequence();
    var seq5 = new Sequence();
    var step4 = new Sequence();
    var rndTurn = new NDSelector(); // a non-deterministic sequence

    // Add actions to BT
    rndTurn.add_child(right);
    rndTurn.add_child(left);

    // third sequence - uses jedi sense and if nothing in front, move forward
    seq2.add_child(sense);
    seq2.add_child(tingle);
    seq2.add_child(forward);
    seq2.add_child(interactable);

    // first sequence - if hit wall, turn
    seq3.add_child(bump);
    seq3.add_child(rndTurn);

    seq1.add_child(seq3);
    seq1.add_child(seq4);

    // fourth sequence - interact with object then continue
    seq5.add_child(use);
    seq5.add_child(seq4);

    // second sequence - if there is no danger around, move forward
    seq4.add_child(goNoGo);
    seq4.add_child(forward);

    step4.add_child(seq1);

    root.add_child(step4);
    root.add_child(seq2);
    root.add_child(seq5);
    root.add_child(rndTurn);

    // Add BT root to object
    this.root = root;
    this.memory = knowledgeBase;
}

// Method called by the game to run the agent, it returns an action to control the NPC
function Agent_process() {
    "use strict";
    // drive BT reasoning here
    var action = "";
    var status = this.hero.percept; // get sensors from NPC
    this.memory.clearAction();      // clear previous action
    this.memory.percepts = status;  // update the information in the AI
    while (this.memory.noAction()) { // have we decide what to do yet?
        this.root.run();            // do some (more) thinking
    }
    action = this.memory.action;    // get the decided action

    // return the action to be performed by the NPC
    return action;
}

// These allow JS to be more OO in design
Agent.prototype.init = Agent_init;
Agent.prototype.process = Agent_process;