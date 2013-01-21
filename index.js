
/* Require modules */
var httpProxy = require("http-proxy");


/* Check command line arguments */
if (process.argv.length < 3)
{
  console.error("Missing path to configuration file!");
  process.exit(1);
}


/* Read configuration file */
console.info("Will read configuration from " + process.argv[2] + ".");

var configuration = require(process.argv[2]);


/* Check configuration file */
if (!configuration.paths)
{
  console.error("Missing paths from configuration file!");
  process.exit(1);
}

configuration.port = configuration.port || 80;


/* Start proxy server */
console.info("Will listen on incomming connection on port " + configuration.port);

httpProxy.createServer({
  router: configuration.paths
}).listen(configuration.port);
