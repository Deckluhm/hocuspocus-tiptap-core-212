"use strict";
exports.__esModule = true;
var http_1 = require("http");
var crypto_1 = require("crypto");
var server_1 = require("@hocuspocus/server");
var extension_logger_1 = require("@hocuspocus/extension-logger");
var transformer_1 = require("@hocuspocus/transformer");
var extension_webhook_1 = require("@hocuspocus/extension-webhook");
/*
 * Setup server
 */
var server = server_1.Server.configure({
    port: 1234,
    extensions: [
        new extension_logger_1.Logger(),
        new extension_webhook_1.Webhook({
            transformer: transformer_1.TiptapTransformer,
            secret: '1234',
            url: 'http://localhost:12345',
            events: [
                extension_webhook_1.Events.onCreate, extension_webhook_1.Events.onChange, extension_webhook_1.Events.onConnect,
            ]
        }),
    ]
});
server.listen();
/*
 * Setup receiver
 */
var WebhookReceiver = /** @class */ (function () {
    function WebhookReceiver() {
        this.secret = '1234';
        this.apiToken = '123456';
        this.server = (0, http_1.createServer)(this.handleRequest.bind(this));
        this.server.listen(12345, function () {
            console.log('[WebhookReceiver] listening on port 12345…');
        });
    }
    WebhookReceiver.prototype.verifySignature = function (body, header) {
        var signature = Buffer.from(header);
        var hmac = (0, crypto_1.createHmac)('sha256', this.secret);
        var digest = Buffer.from("sha256=".concat(hmac.update(body).digest('hex')));
        return signature.length !== digest.length || (0, crypto_1.timingSafeEqual)(digest, signature);
    };
    WebhookReceiver.prototype.handleRequest = function (request, response) {
        var _this = this;
        var data = '';
        request.on('data', function (chunk) {
            data += chunk;
        });
        request.on('end', function () {
            if (!_this.verifySignature(data, request.headers['x-hocuspocus-signature-256'])) {
                response.writeHead(403, 'signature not valid');
            }
            var _a = JSON.parse(data), event = _a.event, payload = _a.payload;
            try {
                // @ts-ignore - let me do some magic here please TypeScript
                _this["on".concat(event[0].toUpperCase()).concat(event.substr(1))](payload, response);
            }
            catch (e) {
                console.log("[WebhookReceiver] unknown event \"".concat(event, "\""));
            }
        });
    };
    WebhookReceiver.prototype.onConnect = function (payload, response) {
        var _a;
        console.log("[WebhookReceiver] user connected to ".concat(payload.documentName));
        // authorize user
        if (((_a = payload.requestParameters) === null || _a === void 0 ? void 0 : _a.token) !== this.apiToken) {
            response.writeHead(403, 'unathorized');
            return response.end();
        }
        // return context
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({
            user: {
                id: 1,
                name: 'John'
            }
        }));
    };
    WebhookReceiver.prototype.onCreate = function (payload, response) {
        console.log("[WebhookReceiver] document ".concat(payload.documentName, " created"));
        // return a document for the "default" field
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({
            "default": {
                type: 'doc',
                content: [
                    {
                        type: 'paragraph',
                        content: [
                            {
                                type: 'text',
                                text: 'What is love?'
                            },
                        ]
                    },
                ]
            }
        }));
    };
    WebhookReceiver.prototype.onChange = function (payload, response) {
        console.log("[WebhookReceiver] document ".concat(payload.documentName, " was changed: ").concat(JSON.stringify(payload.document)));
    };
    WebhookReceiver.prototype.onDisconnect = function (payload, response) {
        console.log("[WebhookReceiver] user ".concat(payload.context.user.name, " disconnected from ").concat(payload.documentName));
    };
    return WebhookReceiver;
}());
var receiver = new WebhookReceiver();
