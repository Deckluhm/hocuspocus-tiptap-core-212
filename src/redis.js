"use strict";
exports.__esModule = true;
var server_1 = require("@hocuspocus/server");
var extension_logger_1 = require("@hocuspocus/extension-logger");
var extension_redis_1 = require("@hocuspocus/extension-redis");
var extension_sqlite_1 = require("@hocuspocus/extension-sqlite");
var server = new server_1.Hocuspocus({
    port: 1234,
    name: 'redis-1',
    extensions: [
        new extension_logger_1.Logger(),
        new extension_redis_1.Redis({
            host: '127.0.0.1',
            port: 6379
        }),
        new extension_sqlite_1.SQLite(),
    ]
});
server.listen();
var anotherServer = new server_1.Hocuspocus({
    port: 1235,
    name: 'redis-2',
    extensions: [
        new extension_logger_1.Logger(),
        new extension_redis_1.Redis({
            host: '127.0.0.1',
            port: 6379
        }),
        new extension_sqlite_1.SQLite(),
    ]
});
anotherServer.listen();
