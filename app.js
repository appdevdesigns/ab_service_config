//
// config
// (AppBuilder) This service is responsible for managing the configuration
// volume and initializing it's contents
//

var fs = require("fs");
var path = require("path");

var configPath = path.sep + "config";
// var pathSource = path.sep + path.join("app", "config");

var possibleBatches = [
   // All our BASE config files
   { source: path.sep + path.join("app", "config"), dest: configPath },
   // The dev config file
   { source: path.sep + path.join("config_safe"), dest: configPath },
   {
      source: path.sep + path.join("mysql_config_source"),
      dest: path.sep + "mysql_config",
   },
   {
      source: path.sep + path.join("mysql_key_source"),
      dest: path.sep + "mysql_key",
   },
   {
      source: path.sep + path.join("mysql_password_source"),
      dest: path.sep + "mysql_password",
   },
   {
      source: path.sep + path.join("nginx"),
      dest: path.sep + path.join("nginx_etc", "nginx"),
   },
   {
      source: path.sep + path.join("ssl"),
      dest: path.sep + path.join("nginx_etc", "ssl", "certs"),
   },
];

var batches = [];

possibleBatches.forEach((b) => {
   try {
      var stat = fs.lstatSync(b.dest);
      batches.push(b);
   } catch (e) {
      // console.log("destination not loaded, so skip")
   }
});

var isInstall = process.env.AB_CONFIG_INSTALL;
if (!isInstall) {
   // only do the config batch:
   batches = batches.filter((b) => b.dest == configPath);
}

/**
 * @function copyItem()
 * attempt to smartly copy the given file. If the file is a directory, then
 * try to recreate the directory recursively.
 * @param {string} file
 *      the name of the entry we are trying to copy
 * @param {string} currPath
 *      the current relative path from our {pathSource} that we are under.
 */
function copyItem(pathSource, pathConfig, file, currPath = null) {
   var sourceFile = path.join(
      pathSource,
      currPath ? path.join(currPath, file) : file
   );
   var configFile = path.join(
      pathConfig,
      currPath ? path.join(currPath, file) : file
   );

   try {
      var stat = fs.lstatSync(sourceFile);
      if (stat.isDirectory()) {
         fs.mkdirSync(configFile, { recursive: true });
         var subFiles = fs.readdirSync(sourceFile);
         (subFiles || []).forEach((f) => {
            copyItem(
               pathSource,
               pathConfig,
               f,
               currPath ? path.join(currPath, file) : file
            );
         });
      } else {
         console.log(`copying: ${sourceFile} -> ${configFile}`);
         contents = fs.readFileSync(sourceFile);
         fs.writeFileSync(configFile, contents);
      }
   } catch (e) {
      console.log(`skipping file ${sourceFile}`);
   }
}

function runBatch(batch) {
   var pathSource = batch.source;
   var pathConfig = batch.dest;

   var filesToCopy = fs.readdirSync(pathSource);
   // {array}
   // an array of files names to copy from our {pathSource}

   if (!isInstall && pathConfig.indexOf(configPath) > -1) {
      // if not an INSTALL  just update the local.js
      filesToCopy = ["local.js"];
   }

   //
   // 1) remove all relevant files in our dest directory
   // -----------------------------------------------------------
   (filesToCopy || []).forEach((f) => {
      var configFile = path.join(pathConfig, f);
      console.log(`removing: ${configFile}`);
      try {
         var stat = fs.lstatSync(configFile);
         if (stat.isDirectory()) {
            fs.rmSync(configFile, { recursive: true });
         } else if (stat.isFile()) {
            fs.unlinkSync(configFile);
         }
      } catch (e) {
         // if (e.toString().indexOf("ENOENT") == -1) {
         //    console.log(e);
         // }
      }
   });

   //
   // 2) make copies of all files in our /config_source -> /config
   // -----------------------------------------------------------
   (filesToCopy || []).forEach((f) => {
      copyItem(pathSource, pathConfig, f);
   });
}

(batches || []).forEach((batch) => {
   runBatch(batch);
});

// done
// 3) create the file marker indicating we are done.
// -----------------------------------------------------------
var pathReadyFile = path.join(configPath, ".config_ready");
fs.writeFileSync(pathReadyFile, "1");

//
// 4) setup our process listeners so we remove our marker
// as we exit.
// -----------------------------------------------------------
function onExit() {
   console.log("removing .config_ready");
   fs.unlinkSync(pathReadyFile);
}
process.on("SIGINT", onExit);
process.on("SIGTERM", onExit);

//
// Now we just wait to be closed out when the docker stack is removed.
function wait() {
   // console.log(".");
}

console.log("... config preparation complete");
setInterval(wait, 10000);
