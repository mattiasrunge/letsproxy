"use strict";

const path = require("path");
const http = require("http");
const https = require("https");
const httpProxy = require("http-proxy");
const LEX = require("letsencrypt-express");
const config = require("/etc/mproxy.json");

let proxy = httpProxy.createProxy();

let lex = LEX.create({
    configDir: config.https.dir,
    key: path.join(config.https.dir, config.https.key),
    cert: path.join(config.https.dir, config.https.cert)
});

http
.createServer(LEX.createAcmeResponder(lex, (request, response) => {
    response.setHeader("Location", "https://" + request.headers.host + request.url);
    response.end("<!-- Please use HTTPS instead -->");
}))
.listen(80);

https
.createServer(lex.httpsOptions, LEX.createAcmeResponder(lex, (request, response) => {
    if (!config.paths[request.headers.host]) {
        console.log("Could not find target for " + request.headers.host);
        response.statusCode = 404;
        response.end("No target");
        return;
    }

    console.log("get", request.headers.host, "=>", config.paths[request.headers.host]);

    proxy.web(request, response, {
        target: "http://" + config.paths[request.headers.host]
    });
}))
.on("upgrade", (request, socket, head) => {
    if (!config.paths[request.headers.host]) {
        console.log("Could not find target for " + request.headers.host);
        socket.end();
        return;
    }

    console.log("upgrade", request.headers.host, "=>", config.paths[request.headers.host]);

    proxy.ws(request, socket, head, {
        target: "http://" + config.paths[request.headers.host]
    });
})
.listen(443)
