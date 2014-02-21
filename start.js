var boot = require('hydra-boot');

var arg = process.argv.slice();
var nvm = arg.shift();
var app = arg.shift();

if (process.argv.length >= 2) {
    boot.init();
    console.log("started cluster boot service");
}

module.exports = boot;
