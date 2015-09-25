#!/usr/bin/env node

/* Includes */
var http = require("http");
var httpProxy = require("http-proxy");
var proxy = httpProxy.createProxy();

/* Default variables */
var command = "--run";
var defaultConfigFile = "/etc/mproxy.json";
var serviceFile = "/etc/init/mproxy.conf";


/* Check command line argument */
if (process.argv.length >= 3) {
  command = process.argv[2];
}


/* Run requested command */
if (command === "--help") {
  printHelp();
} else if (command === "--autostart") {
  toggleAutostart(process.argv[3]);
} else if (command === "--init") {
  createConfig(process.argv[3]);
} else if (command === "--list") {
  listConfig(process.argv[3]);
} else if (command === "--run") {
  startProxy(process.argv[3]);
} else {
  console.log("Unknown command: " + command);
  printHelp();
  process.exit(1);
}

process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log(err);
});

function startProxy(configFile) {
  if (!configFile) {
    configFile = defaultConfigFile;
  }

  var fs = require("fs");

  fs.exists(configFile, function(exists) {
    if (!exists) {
      console.error("Could not find the configuration file " + configFile + "!");
      process.exit(1);
    }

    var config = require(configFile);

    if (!config.paths) {
      console.error("Missing paths from configuration file " + configFile + "!");
      process.exit(1);
    }

    if (!config.port) {
      console.error("Missing port from configuration file " + configFile + "!");
      process.exit(1);
    }

    console.log("Proxy listening for connections on port " + config.port);

    var server = http.createServer(function(req, res) {

      if (!config.paths[req.headers.host]) {
        console.log("Could not find target for " + req.headers.host);
        res.statusCode = 404;
        res.end("No target");
        return;
      }

      //console.log("get", req.headers.host, "=>", config.paths[req.headers.host]);

      proxy.web(req, res, {
        target: "http://" + config.paths[req.headers.host]
      });
    });

    server.on("upgrade", function(req, socket, head) {
      if (!config.paths[req.headers.host]) {
        console.log("Could not find target for " + req.headers.host);
        socket.end();
        return;
      }

      //console.log("upgrade", req.headers.host, "=>", config.paths[req.headers.host]);

      proxy.ws(req, socket, head, {
        target: "http://" + config.paths[req.headers.host]
      });
    });

    server.listen(config.port)
  });
};

function listConfig(configFile) {
  if (!configFile) {
    configFile = defaultConfigFile;
  }

  var fs = require("fs");

  fs.exists(configFile, function(exists) {
    if (!exists) {
      console.error("Could not find the configuration file " + configFile + "!");
      process.exit(1);
    }

    var config = require(configFile);

    if (!config.paths) {
      console.error("Missing paths from configuration file " + configFile + "!");
      process.exit(1);
    }

    if (!config.port) {
      console.error("Missing port from configuration file " + configFile + "!");
      process.exit(1);
    }

    console.log("Found the following paths:");

    for (var name in config.paths) {
      console.log("  " + name + ":" + config.port + " => " + config.paths[name]);
    }
  });
};

function createConfig(configFile) {
  if (!configFile) {
    configFile = defaultConfigFile;
    console.error("No configuration file path was supplied, will write configuration to the default path.");
  }

  var config = {};

  config.port = 80;
  config.paths = {};
  config.paths['www1.example.com'] = "localhost:8000";
  config.paths['www2.example.com'] = "localhost:9000";

  var fs = require("fs");

  fs.exists(configFile, function(exists) {
    if (exists) {
      console.log(configFile + " already exists, you have to remove it first!");
      return;
    }

    fs.writeFile(configFile, JSON.stringify(config, null, 2), function(error) {
      if (error) {
        console.error("Failed to write sample configuration to " + configFile + ", check your rights!");
        console.log(error);
        process.exit(1);
      }

      console.log("Wrote sample configuration to " + configFile + ".");
    });
  });
};

function toggleAutostart(mode) {
  if (!mode || !(mode === "on" || mode === "off")) {
    console.error("Invalid or missing mode parameter, valid values are 'on' or 'off'!");
    process.exit(1);
  }

  var fs = require("fs");

  fs.exists(serviceFile, function(exists) {
    if (exists && mode === "on") {
      console.log("Autostart is already on!");
    } else if (!exists && mode === "off") {
      console.log("Autostart is already off!");
    } else if (mode === "on") {
      var startString = "exec mproxy\n";

      fs.writeFile(serviceFile, startString, function(error) {
        if (error) {
          console.error("Failed to write service configuration to " + serviceFile + ", check your rights!");
          console.log(error);
          process.exit(1);
        }

        console.log("Turned proxy autostart on by writing " + serviceFile + ".");
      });
    } else if (mode === "off") {
      fs.unlink(serviceFile, function (error) {
        if (error) {
          console.error("Failed to remove service configuration to " + serviceFile + ", check your rights!");
          console.log(error);
          process.exit(1);
        }

        console.log("Turned proxy autostart off by removing " + serviceFile + ".");
      });
    } else {
      console.error("Don't know what to do!");
      process.exit(1);
    }
  });
};

function printHelp() {
  console.log("Usage: mproxy <command>");
  console.log("");
  console.log("  mproxy --help                 Print this help");
  console.log("  mproxy --init [filepath]      Create an initial configuration");
  console.log("  mproxy --list [filepath]      List paths in configuration");
  console.log("  mproxy --autostart <on/off>   Set the proxy to autostart or not, Ubuntu only");
  console.log("  mproxy [--run] [filepath]     Start the proxy server using the filepath configuration");
  console.log("");
};
