"use strict";
exports.__esModule = true;
var server_1 = require("@hocuspocus/server");
var extension_logger_1 = require("@hocuspocus/extension-logger");
var extension_monitor_1 = require("@hocuspocus/extension-monitor");
var server = server_1.Server.configure({
    port: 1234,
    name: 'my-unique-identifier',
    extensions: [
        new extension_logger_1.Logger(),
        new extension_monitor_1.Monitor(),
    ]
});
server.listen();
