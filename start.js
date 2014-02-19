var boot = require('hydra-boot');

var arg = process.argv.slice();
var nvm = arg.shift();
var app = arg.shift();

if (process.argv.length >= 2) {
    switch (arg.length > 0 ? arg[0] : null) {
        case 'init':
            boot.init();
            break;
        case 'dump':
            boot.dump(arg[1]);
            break;
        case 'load':
            boot.load(arg[1]);
            break;
        default:
            console.log("start [ init | dump | load]");
            break;
    }
}

module.exports = boot;
