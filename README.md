# fubus

## Introduction

fubus provides a mock implementation of OpenWRT ubus as described in [OpenWrt micro bus architecture](http://wiki.openwrt.org/doc/techref/ubus).

## Usage

The fubus module provides a basic means to parse and handle ubus calls supplied in JSON format.

Basic usage is similar to this:

```
// Module import.
var Fubus = require("../index");

// Create fubus instance.
var fubus = Fubus.create();

// Register test object.
fubus.registerHandlerObject("test", {
    /**
     * Echo input method.
     */
    echo: function(ubusParams) {

        var text = ubusParams.arguments.text;
        log.debug({text: text});
        var serviceResult = [0, {"text": text}];
        return Promise.resolve(serviceResult);

    }
});
```

Using *fubus.registerHandlerObject* it is possible to register handler objects exposing methods on fubus.

For proper emulation of ubus like it is used in uhttp for remote method invocation, the module needs to be wrapped using a JSON-RPC 2.0 server, e.g. jrpc2.
A more detailed example for this is available in *examples/jrpc2.js*.

To test *jrpc2* example, use curl call, for example

```
curl -X POST -H "Content-Type: application/json" -d "{\"jsonrpc\":\"2.0\",\"method\":\"call\",\"id\":1,\"params\":[\"00000000000000000000000000000000\",\"session\",\"login\",{\"username\":\"root\",\"password\":\"foobar\"}]}" http://localhost:3000/ubus
```

## License

Licensed under *The MIT License*. For details, see *LICENSE* file in repository root.