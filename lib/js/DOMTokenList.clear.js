DOMTokenList.prototype.clear = function() {
    this.forEach(function(el) {
        this.remove(el);
    }.bind(this))
};