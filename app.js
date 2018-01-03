var lib = require('./lib');

var data = [[2,7,9],
[8,2,10],
[6,3,9],
[3,8,11],
[10,10,20],
[2,6,8],
[9,9,18],
[2,4,6],
[4,6,10],
[3,5,8],
[8,8,16],
[2,2,4],
[6,9,15],
[4,3,7],
[4,8,12],
[2,8,10],
[7,6,13],
[9,2,11],
[2,5,7],
[6,10,16],
[6,4,10],
[8,5,13],
[8,10,18],
[6,7,13],
[6,6,12],
[4,2,6],
[9,3,12],
[6,8,14],
[9,4,13],
[3,6,9],
[8,3,11],
[5,3,8],
[10,7,17],
[9,8,17],
[5,4,9],
[4,7,11],
[10,6,16],
[9,5,14],
[4,9,13],
[6,2,8],
[8,6,14],
[4,4,8],
[5,8,13],
[8,7,15],
[3,7,10],
[7,9,16],
[10,2,12],
[4,10,14],
[8,9,17],
[10,9,19]];

var Circuit = function(size) {
    this.mGates = new Array(size);
    this.aGates = new Array(size);
    for(var i = 0; i < size; i++) {
        this.mGates[i] = new lib.MultiplyGate();
        this.aGates[i] = new lib.AddGate();
    }
}
Circuit.prototype = {
    forward: function(data, dVars) {
        var i;
        var aGates = this.aGates;
        var mGates = this.mGates;
        for(i = 0; i < mGates.length; i++)
            mGates[i].forward(data[i], dVars[i]);
        for(i = 0; i < aGates.length - 1; i++)
            aGates[i].forward(mGates[i].ret, mGates[i+1].ret);
        this.last = aGates[i].forward(aGates[i-1].ret, dVars[dVars.length-1]);
        return this.last;
    },

    backward: function(pull) {
        var aGates = this.aGates;
        var mGates = this.mGates;
        this.last.gradient = pull;
        for(var i = aGates.length - 1; i >= 0; i--)
            aGates[i].backward();
        for(var i = mGates.length - 1; i >= 0; i--)
            mGates[i].backward();
    }
}

var SVM = function() {
    this.dVars = lib.createArray(data[0].length);
    this.circuit = new Circuit(data[0].length-1);
}

SVM.prototype = {
    forward: function(data) {
        this.unit_out = this.circuit.forward(data, this.dVars);
        return this.unit_out;
    },
    backward: function(ans) {
        var dVars = this.dVars;
        for(var i = 0; i < this.dVars.length; i++)
            dVars[i].gradient = 0.0;
        var diff = ans - this.unit_out.value;
        var pull = diff > 0 ? diff === 0 ? 0.0 : 1.0 : -1.0;
        this.circuit.backward(pull);
        for(var i = 0; i < this.dVars.length - 1; i++)
            this.dVars[i].gradient += -this.dVars[i].value;
    },
    parameterUpdate: function() {
        var step_size = 0.0001;
        for(var i = 0; i < this.dVars.length; i++)
            this.dVars[i].value += step_size * this.dVars[i].gradient;
    },
    learnFrom: function(data, ans) {
        this.forward(data);
        this.backward(ans);
        this.parameterUpdate();
    }
}

var svm = new SVM();
for(var i = 0; i < 400000; i++) {
    var index = Math.floor(Math.random() * data.length);
    var datas = new Array(data[index].length - 1);
    for(var j = 0; j < data[index].length - 1; j++) 
        datas[j] = new lib.Unit(data[index][j], 0.0);
    svm.learnFrom(datas, data[index][data[index].length-1]);
}

console.log(svm.forward([new lib.Unit(15.0, 0.0), new lib.Unit(15.0, 0.0)]));
console.log(svm.dVars);