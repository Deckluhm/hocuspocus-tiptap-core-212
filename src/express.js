"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var express_ws_1 = __importDefault(require("express-ws"));
var server_1 = require("@hocuspocus/server");
var extension_logger_1 = require("@hocuspocus/extension-logger");
var server = server_1.Server.configure({
    extensions: [
        new extension_logger_1.Logger(),
    ]
});
var app = (0, express_ws_1["default"])((0, express_1["default"])()).app;
app.get('/', function (request, response) {
    response.send('Hello World!');
});
app.ws('/:documentName', function (websocket, request) {
    var context = { user_id: 1234 };
    server.handleConnection(websocket, request, request.params.documentName, context);
});
app.listen(1234, function () { return console.log('Listening on http://127.0.0.1:1234…'); });
