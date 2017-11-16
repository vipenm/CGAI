// js file for use in the 6CS003 "Graphics and Artificial Intelligence" module
// OO(?) behaviour-tree engine written by Dr Desmond Case 2016

// ================================================
// =          Behaviour Tree engine               =
// ================================================
function Leaf(){ 
    // Base class for a leaf of a Tree Behaviour
    return this;
}

Leaf.prototype.run = function() {
    println("This method should be overridden");
    return false;
}

function Task(){ 
    // Base class for a node of a Tree Behaviour
    Leaf.call(this);
    this.count = 0;
	this.start = 0;  // to be overridden in the ND variations
    this._children = [];
}

Task.prototype = Object.create(Leaf.prototype);
Task.prototype.constructor = Task;

Task.prototype.add_child = function(c){
    this._children.push(c);
};

function Selector(){
    // Implementation of the Selector
    Task.call(this);
}

Selector.prototype = Object.create(Task.prototype);
Selector.prototype.constructor = Selector;
 
// uses tri-state logic true/false/undefined
Selector.prototype.run = function() {
    var state = false;
	if (this.count < this._children.length) {
        state = this._children[this.count].run(); 
        switch (state){
            case true:
                this.count = this.start;  // next time start from here
                return state;
            case false:
                this.count += 1;
                if (this.count >= this._children.length){
                    this.count = this.start; // next time start from here
                    return state;
                }
                return undefined;      // means still running
            default:
                return state;
        }
    }
    return state;
};

function Sequence() {
    // Implementation of the Sequence
	Task.call(this);
}

Sequence.prototype = Object.create(Task.prototype);
Sequence.prototype.constructor = Sequence;

// uses tri-state logic true/false/undefined
Sequence.prototype.run = function() {
    var state = false;
	if (this.count < this._children.length) {
        state = this._children[this.count].run(); 
        switch (state){
            case false:
                this.count = this.start;  // next time start from here
                return state;
            case true:
                this.count += 1;
                if (this.count >= this._children.length){
                    this.count = this.start;  // next time start from here
                    return state;
                }
                return undefined;      // means still running
            default:
                return state;
        }
    }
    return state;
};

// Non-Deterministic Selector
function NDSelector(){
    // Implementation of the Selector
	Selector.call(this);
    this.parent = this.__proto__;
}

NDSelector.prototype = Object.create(Selector.prototype);
NDSelector.prototype.constructor = NDSelector;

NDSelector.prototype.add_child = function(c){
	this._children.push(c);
    this._children.sort(function(a, b) { return .4 - Math.random() }); // scramble the order for ND
	this.start = Math.floor(Math.random() * this._children.length); // restart at a random location
};

// Non-Deterministic Sequence
function NDSequence() {
    // Implementation of the Sequence
	Sequence.call(this);
}

NDSequence.prototype = Object.create(Sequence.prototype);
NDSequence.prototype.constructor = NDSequence;

NDSequence.prototype.add_child = function(c){
	this._children.push(c);
    this._children.sort(function(a, b) { return .7 - Math.random() }); // scramble the order for ND
	this.start = Math.floor(Math.random() * this._children.length); // restart at a random location
};

function Decorator(){
    // Implementation of the Decorator
	Leaf.call(this);
    this._child;
}

Decorator.prototype.add_child = function(c){
    if (c instanceof Leaf){
        this._child = c;
    }
};

Decorator.prototype.run = function() {
    // This method should be overridden
    return this._child.run();
}

Decorator.prototype = Object.create(Leaf.prototype);
Decorator.prototype.constructor = Decorator;

