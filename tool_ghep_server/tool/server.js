"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var socketserver_1 = require("./socketserver");
function getarg(argname) {
    var id = process.argv.findIndex(function (x) { return x == "-".concat(argname); });
    if (id >= 0 && process.argv.length > id && !process.argv[id + 1].startsWith('-')) {
        return process.argv[id + 1];
    }
    return '';
}
var opt = {
    outputdir: 'datapath',
    capture: true,
    equirect: true,
    photoshop: true,
    racube: true,
    shutdown: true,
    timeout: 900
};
function main() {
    opt.outputdir = getarg('dir');
    opt.capture = getarg('capture') == "True";
    opt.equirect = getarg('equirect') == "True";
    opt.racube = getarg('racube') == "True";
    opt.photoshop = getarg('photoshop') == "True";
    opt.shutdown = getarg('shutdown') == "True";
    var server = new socketserver_1.default(opt);
    server.init();
}
main();
