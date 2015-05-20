/**
 * An example of how to use fubus module
 * with JRPC2 JSON-RPC over HTTP.
 */


/**
 * Import promise support if not available.
 */
if (!global.Promise){
    global.Promise = require('bluebird');
}

var bunyan = require('bunyan');

global.log = bunyan.createLogger({
    "name": "Fubus JRPC2 Server Test",
    "level": "debug"
});

var express = require('express');
var cors = require('cors');
var rpc = require('jrpc2');
var bodyParser = require('body-parser');

var Fubus = require("../index");

/**
 * Create fubus instance.
 */
var fubus = Fubus.create();

/**
 * Generate random session id suitable for ubus
 * session.
 * @returns {string} Session id consisting of 32 random hex characters.
 */
var generateRandomSessionId = function () {
    var buffer = new Buffer(16);
    for (var i = 0; i < buffer.length; ++i) {
        buffer[i] = Math.round(255*Math.random());
    }
    var hexString = buffer.toString('hex');
    return hexString;
};

/**
 * Mock session interface.
 */
var mockSession = {

    /**
     * User login.
     */
    login: function (ubusParams) {

        var credentials = {
            username: ubusParams.arguments.username,
            password: ubusParams.arguments.password
        };
        log.debug({credentials: credentials}, "Received credentials.");


        var sessionId = generateRandomSessionId();


        var authResult = {
            ubus_rpc_session: sessionId,
            timeout: 300,
            expires: 299,
            acls: {
                "access-group": {"superuser": ["read", "write"], "unauthenticated": ["read"]},
                "ubus": {"*": ["*"], "session": ["access", "login"]},
                "uci": {"*": ["read", "write"]}
            }
        };
        authResult.username = credentials.username;

        var serviceResult = [0, authResult];
        return Promise.resolve(serviceResult);
    }
};

/**
 * Mock test interface.
 */
var mockTest = {

    /**
     * Echo input.
     */
    echo: function(ubusParams) {

        var text = ubusParams.arguments.text;
        log.debug({text: text});
        var serviceResult = [0, {"text": text}];
        return Promise.resolve(serviceResult);

    }
}

/**
 * Actually register ubus service interfaces.
 */
fubus.registerHandlerObject("session", mockSession);
fubus.registerHandlerObject("test", mockTest);

/**
 * Initialize JRPC2 server and
 * register ubus call handler.
 */
var rpcServer = new rpc.Server();
rpcServer.expose('call', fubus.handleUbusCall);

/**
 * Initialize express app.
 */
var app = express();

app.use(cors());
app.use(bodyParser.json());

/**
 * Wrap POST on '/ubus' endpoint.
 */
var handlePostOnUbus = function(req, res){
    rpcServer.handleCall(req.body, {}, function(answer){
        res.json(answer);
    });
};

app.post('/ubus', handlePostOnUbus);

var port = process.env.PORT || 3000;

app.listen(port, function(){
    log.info({port: port}, "Server is listening.");
})