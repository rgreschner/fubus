/**
 * Fubus service class.
 * Provides mock implementation of OpenWRT
 * ubus service.
 */
(function(module){

    var utils = require("./utils");

    /**
     * Constructor for Mock ubus service.
     */
    function fubus(opts) {
        if (!opts){
            opts = {
                log: global.log
            };
        }
        this._log = opts.log;
        if (!this._log){
            this._log = {
                "debug": console.log
            }
        }
        this._handlerObjects = {};
        this._handleUbusCall = this.handleUbusCall;
        var self = this;
        this.handleUbusCall = function(){
            return self._handleUbusCall.apply(self, arguments);
        }
    }

    /**
     * Register handler object.
     * @param name Referenced name.
     * @param handlerObject Handler object providing service methods.
     */
    fubus.prototype.registerHandlerObject = function(name, handlerObject){
        this._handlerObjects[name] = handlerObject;
    }

    /**
     * Handle call to ubus from JSON-RPC / jrpc2 library.
     * @returns {Promise} Resolves to service result.
     */
    fubus.prototype.handleUbusCall = function() {

        var self = this;

        var ubusParams = utils.parseUbusParameters(arguments);

        var callPromise = new Promise(function(resolve, reject){

            var callPromiseInternal = new Promise(function(resolve, reject){
                var handlerObject = self._handlerObjects[ubusParams.object];
                if (!handlerObject)
                {
                    reject();
                    return ;
                }
                handlerMethod = handlerObject[ubusParams.method];
                if (!handlerMethod)
                {
                    reject();
                    return ;
                }
                handlerMethod(ubusParams).then(function(callResult){
                    resolve(callResult);
                }).catch(function() {
                    reject();
                });
            });

            callPromiseInternal.then(function(callResult){
                self._log.debug({result: callResult, params: ubusParams}, "Handled call on fubus.");
                resolve(callResult);
                return ;
            }).catch(function(){
                resolve([6]);
                return ;
            })

        });

        return callPromise;
    }

    /**
     * Module exports.
     */
    module.exports = fubus;

})(module);