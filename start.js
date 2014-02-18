var boot = require('hydra-boot');

var arg = process.argv.slice();
var nvm = arg.shift();
var app = arg.shift();

switch (arg.length > 0 ? arg[0] : 'init') {
    case 'init':
        boot.init();
        break;
    case 'dump':
        boot.dump(arg[1]);
        break;
    case 'load':
        boot.load(arg[1]);
        break;
}
