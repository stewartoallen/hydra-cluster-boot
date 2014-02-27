var boot = require('hydra-boot');

var arg = process.argv.slice();
var nvm = arg.shift();
var app = arg.shift();

if (process.argv.length >= 2) {
    for (var i=2; i<process.argv.length; i++) {
        var kv = process.argv[i].split("=");
        boot.config(kv[0],kv[1]);
    }
    boot.init();
}

module.exports = boot;
