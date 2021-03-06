Backbone.Model.prototype.increase = function (key, addition) {
    this.set(key, this.get(key) + addition)
};

var Cell = Backbone.Model.extend({
    defaults: {
        value: 0
    },
    initialize: function (options) {
        this.set("index", options.index);
    },
    inc: function () {
        if (this.get("value") >= 32767) {
            this.set("value", -32768);
        } else {
            this.increase("value", 1);
        }
    },
    dec: function () {
        if (this.get("value") <= -32768) {
            this.set("value", 32767);
        } else {
            this.increase("value", -1);
        }
    },
    mul: function(prevCell) {
        this.set("value", this.value() * prevCell.value());
    },
    div: function(prevCell) {
        this.set("value", Math.round(this.value() / prevCell.value()));
    },
    rem: function(prevCell) {
        this.set("value", this.value() % prevCell.value());
    },
    put: function (c) {
        this.set("value", c.charCodeAt(0));
    },
    char: function () {
        if (this.get("value") == 10 ||
            this.get("value") == 13)
            return "\n";
        return String.fromCharCode(this.get("value"))
    },
    value: function() {
      return this.get("value");
    }
});

var Cells = Backbone.Collection.extend({
    model: Cell
});

var Tape = Backbone.Model.extend({
    tapeIndex: function (index) {
        var firstIndex = this.get("cells").first().get("index");
        var lastIndex = this.get("cells").last().get("index");
        if (index < firstIndex || lastIndex < index) {
            throw {
                name: "Error",
                message: "Memory error: " + index
            };
        }
        return index - firstIndex;
    },
    cellAt: function (index) {
        return this.get("cells").at(this.tapeIndex(index));
    }
});

var Pointer = Backbone.Model.extend({
    defaults: {
        index: 0
    },
    left: function () {
        this.increase("index", -1);
    },
    right: function () {
        this.increase("index", +1);
    }
});
