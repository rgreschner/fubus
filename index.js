/**
 * Fubus library.
 */
(function(module){

    var fubus = require("./fubus");

    /**
     * Library exports.
     */
    module.exports.create = function(opts) {
        var instance = new fubus(opts);
        return instance;
    }

})(module);

