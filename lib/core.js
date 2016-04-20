"use strict";

const path = require("path");
const http = require("http");
const https = require("https");
const httpProxy = require("http-proxy");
const LEX = require("letsencrypt-express");

module.exports = function(args) {
    console.log("Reading configuration from " + args.config);
    const config = require(args.config);
    
    let proxy = httpProxy.createProxy();
    
    console.log("Using Let's Encrypt certificates from:");
    console.log("  - Directory: " + config.https.dir);
    console.log("  - Key: " + config.https.key);
    console.log("  - Cert: " + config.https.cert);
    
    let lex = LEX.create({
        configDir: config.https.dir,
        key: path.join(config.https.dir, config.https.key),
        cert: path.join(config.https.dir, config.https.cert)
    });
    
    http
    .createServer(LEX.createAcmeResponder(lex, (request, response) => {
        response.writeHead(302, {
            Location: "https://" + request.headers.host + request.url
        });
        response.end("<!-- Please use HTTPS instead -->");
    }))
    .listen(80);
    console.log("Now listening to port 80 for redirection");
    
    https
    .createServer(lex.httpsOptions, LEX.createAcmeResponder(lex, (request, response) => {
        if (!config.paths[request.headers.host]) {
            console.error("Request: Could not find a target for " + request.headers.host);
            response.statusCode = 404;
            response.end("No target");
            return;
        }
    
        if (args.debug) {
            console.log("Request: " + request.headers.host + " => " + config.paths[request.headers.host] + " :: " + request.url);
        }
    
        proxy.web(request, response, {
            target: "http://" + config.paths[request.headers.host]
        });
    }))
    .on("upgrade", (request, socket, head) => {
        if (!config.paths[request.headers.host]) {
            console.error("Upgrade: Could not find a target for " + request.headers.host);
            socket.end();
            return;
        }
    
        if (args.debug) {
            console.log("Upgrade: " + request.headers.host + " => " + config.paths[request.headers.host] + " :: " + request.url);
        }
    
        proxy.ws(request, socket, head, {
            target: "http://" + config.paths[request.headers.host]
        });
    })
    .listen(443);
    console.log("Now listening to port 443");
};
