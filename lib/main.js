"use strict";

let core = require("./core");
let packageData = require("../package.json");
let argv = require("yargs")
.usage("Usage: $0 -c [config]")
.example("$0 -c /etc/letsproxy.json", "Start server with specific configuration file")
.help("help")
.strict()
.option("c", {
    alias: "config",
    default: "/etc/letsproxy.json",
    describe: "Configuration file",
    type: "string"
})
.option("d", {
    alias: "debug",
    default: false,
    describe: "Log requests",
    type: "boolean",
    demand: true
})
.argv;

process
.on("SIGINT", () => {
    console.log("User interrupt, exiting...");
    process.exit(1);
})
.on("SIGTERM", () => {
    console.log("Terminate received, exiting...");
    process.exit(2);
});

console.log("LetsProxy version " + packageData.version);

core(argv);
