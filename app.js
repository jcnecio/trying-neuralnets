var lib = require('./lib');

var data = [[1,1,2],
            [1,3,4],
            [2,5,7],
            [3,4,7]];
            
var dVars = lib.createArray(data[0].length-1);
var iVars = new Array(data[0].length-1);
var mGates = new Array(data[0].length-1);
var aGates = new Array(data[0].length-1);
var last;
for(var i = 0; i < mGates.length; i++) {
    mGates[i] = new lib.MultiplyGate();
    aGates[i] = new lib.AddGate();
}

for(var i = 0; i < iVars.length; i++)
    iVars[i] = new lib.Unit(data[0][i],0.0);
var allForward = function() {
    var i;
    for(i = 0; i < mGates.length; i++)
        mGates[i].forward(iVars[i], dVars[i]);
    for(i = 0; i < aGates.length - 1; i++)
        aGates[i].forward(mGates[i].ret, mGates[i+1].ret);
    last = aGates[i].forward(aGates[i-1].ret, dVars[dVars.length-1]);
}

var allBackward = function(pull) {
    last.gradient = pull;
    for(var i = aGates.length - 1; i >= 0; i--)
        aGates[i].backward();
    for(var i = mGates.length - 1; i >= 0; i--)
        mGates[i].backward();
}

var step = function(stepSize) {
    for(var i = 0; i < dVars.length; i++)
        dVars[i].value += stepSize * dVars[i].gradient;
}

var adjust = 1.0;
for(var j = 0; j < 100; j++) {
    allForward();
    for(var i = 0; i < iVars.length; i++)
        iVars[i] = new lib.Unit(data[0][i],0.0);
    allBackward(adjust);
    for(var i = 0; i < dVars.length; i++)
        dVars[i].gradient = 0.0;
    adjust = last.value < data[0][2] ? 1.0 : -1.0;
    step(0.01);
    console.log(dVars);
    console.log(last);
}

allForward();
console.log(last.value);