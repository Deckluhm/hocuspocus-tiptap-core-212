"use strict";
exports.__esModule = true;
var server_1 = require("@hocuspocus/server");
var extension_logger_1 = require("@hocuspocus/extension-logger");
var extension_sqlite_1 = require("@hocuspocus/extension-sqlite");
var server = server_1.Server.configure({
    port: 1234,
    address: '127.0.0.1',
    name: 'hocuspocus-fra1-01',
    extensions: [
        new extension_logger_1.Logger(),
        new extension_sqlite_1.SQLite(),
    ]
});
// server.enableMessageLogging()
server.listen();
