module.exports = {
    Unit: function(value, gradient) {
        this.value = value;
        this.gradient = gradient;
    },
    MultiplyGate: function() {
        var self = this;
        this.forward = function(v1, v2) {
            self.v1 = v1;
            self.v2 = v2;
            self.ret = new module.exports.Unit(v1.value * v2.value, 0.0);
            return self.ret;
        }
        this.backward = function() {
            self.v1.gradient += self.v2.value * self.ret.gradient;
            self.v2.gradient += self.v1.value * self.ret.gradient;
        }
    },
    AddGate: function() {
        var self = this;
        this.forward = function(v1, v2) {
            self.v1 = v1;
            self.v2 = v2;
            self.ret = new module.exports.Unit(self.v1.value + self.v2.value, 0.0);
            return self.ret;
        }
        this.backward = function() {
            self.v1.gradient += 1 * self.ret.gradient;
            self.v2.gradient += 1 * self.ret.gradient;
        }
    },
    createArray: function(size) {
        var arr = new Array(size + 1);
        for(var i = 0; i < arr.length; i++) {
            arr[i] = new module.exports.Unit(1.0, 0.0);
        }
        return arr;
    }
}

