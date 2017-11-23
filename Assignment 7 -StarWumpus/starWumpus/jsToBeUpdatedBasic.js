//js file to be amended by students and used in the 6CS003 "Graphics and Artificial Intelligence" module
//Written by Dr Desmond Case 2015

/*global PercEnum*/

// ===== AI agent for wumpus world =====
// The constructor 
function Agent(hero) {
    "use strict";
    // the line below must NOT be changed, it 
    // allows information from the game NPC
    this.hero = hero;   // pointer to the NPC
}

// Method called by the game to initialise the agent
function Agent_init() {
    "use strict";
    // ==== Data for your agent can be initialised here ====
    // The table below is just for this demonstration, where actions 
    // are chosen at random and the is a bias towards walking forward
    this.actionTable = ["forward"];
}

// Method called by the game to run the agent, it returns an action to control the NPC
function Agent_process() {
    "use strict";
    var percept = this.hero.percept;  // sensors from the agent
    var stench = percept[PercEnum.stench], breeze = percept[PercEnum.breeze], glitter = percept[PercEnum.glitter];
    var bump = percept[PercEnum.bump], scream = percept[PercEnum.scream];
    var facing = this.hero.facing;
    var sense = percept[PercEnum.sense];
    var randomChoice = Math.floor(Math.random() * this.actionTable.length); // pick any action
    if (stench || breeze || glitter || bump || scream){
    	
    } 
    // ...and return the action to be performed
    return this.actionTable[randomChoice];
}

// These allow JS to be more OO in design
Agent.prototype.init = Agent_init; 
Agent.prototype.process = Agent_process;

