/**
 * Utility class for fubus.
 */
(function(module){

    /**
     * Parse ubus parameters from JSON-RPC call.
     * @param args Arguments to parse.
     * @returns Object Parsed ubus parameters.
     */
    var parseUbusParameters = function(args){

        var ubusParams = {
            session: args[0],
            object: args[1],
            method: args[2],
            arguments: args[3]
        };
        return ubusParams;
    };

    /**
     * Module exports.
     */
    module.exports = {
        parseUbusParameters: parseUbusParameters
    }
})(module);