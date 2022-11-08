"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var EnumSocket_1 = require("./model/EnumSocket");
var net_1 = require("net");
var http = require("http");
var config_1 = require("./model/config");
var fs_1 = require("fs");
var hugin_1 = require("./model/hugin");
var os_1 = require("os");
var nets = (0, os_1.networkInterfaces)();
var clientip = '192.168.10.?';
if (nets.Ethernet)
    clientip = nets.Ethernet.filter(function (x) { return x.family == 'IPv4'; })[0].address;
var username = "".concat((0, os_1.hostname)(), "::").concat((0, os_1.userInfo)().username, "::").concat(clientip);
var sleep = function (t) {
    return new Promise(function (rel, rej) {
        setTimeout(function () { rel(0); }, t);
    });
};
var isConnect = false;
var isConvert = false;
var isClose = false;
var trytime = 10;
var hugin = new hugin_1.default();
var fakeconvert = false;
var PanoClient = /** @class */ (function () {
    function PanoClient() {
        this.ip = '127.0.0.1';
        console.log('Starting client');
        this.watingconect();
    }
    PanoClient.prototype.watingconect = function () {
        var _this = this;
        console.log("Trying connect after ".concat(trytime, "s . . ."));
        setTimeout(function () {
            _this.connect();
        }, trytime * 1000);
    };
    PanoClient.prototype.getserverip = function () {
        var options = {
            host: '192.168.10.200',
            path: '/ratool/uetool/?server',
            port: '8080',
            method: 'GET'
        };
        return new Promise(function (rel, rej) {
            var callback = function (response) {
                var str = '';
                response.on('data', function (chunk) {
                    str += chunk;
                });
                response.on('end', function () {
                    rel(str);
                });
                response.on('error', function (e) {
                    rej(e);
                });
            };
            http.request(options, callback).end();
        });
    };
    PanoClient.prototype.connect = function () {
        var _this = this;
        isConnect = true;
        process.stdout.write('Finding server . . . . .');
        this.getserverip()
            .then(function (res) {
            _this.ip = res;
            process.stdout.write("[".concat(_this.ip, "]"));
            console.log('');
            process.stdout.write("Connect to  [".concat(_this.ip, "] . . . . ."));
            _this.init();
        })
            .catch(console.error);
    };
    PanoClient.prototype.sendmsg = function (code, msg) {
        if (this.socket)
            this.socket.write((0, EnumSocket_1.CreateMSG)(code, msg));
    };
    PanoClient.prototype.init = function () {
        var _this = this;
        this.socket = new net_1.Socket();
        this.socket.connect(config_1.default.socketport, this.ip, function () {
            process.stdout.write("[OK]");
            console.log('');
        });
        this.socket.on('data', function (chunk) {
            var _a, _b;
            var data = (0, EnumSocket_1.ParseMSG)(chunk);
            if (!data) {
                console.log("wrong: ".concat(chunk));
                return;
            }
            switch (data.code) {
                case EnumSocket_1.OPPCODE.CLIENT_CONFIG:
                    console.log('Check config . . . .');
                    var opt = JSON.parse(data.payload);
                    var allow = !!opt;
                    allow = allow && (0, fs_1.existsSync)(opt.outputdir);
                    if (allow) {
                        console.log('DIR . . . .[OK]');
                    }
                    else {
                        console.log('DIR . . . .[ERR]', opt.outputdir);
                    }
                    if (allow) {
                        Object.assign(config_1.default, opt);
                        var info_1 = {
                            name: username,
                            capture: false,
                            equirect: true,
                            pts: hugin.canpts,
                            racube: true
                        };
                        hugin.init(config_1.default).finally(function () {
                            info_1.pts = hugin.canpts;
                            _this.sendmsg(EnumSocket_1.OPPCODE.CLIENT_READY, JSON.stringify(info_1));
                        });
                    }
                    break;
                case EnumSocket_1.OPPCODE.CLIENT_PANO:
                    var p_1 = JSON.parse(data.payload);
                    process.stdout.write("Convert pano : ".concat(p_1.name, " . . . . "));
                    console.log('');
                    isConvert = true;
                    if (fakeconvert) {
                        var id = p_1.name;
                        sleep(Math.random() * 10000)
                            .then(function () {
                            isConvert = false;
                            p_1.capture = 2;
                            p_1.equirect = 2;
                            p_1.pts = 2;
                            p_1.racube = 2;
                            _this.sendmsg(EnumSocket_1.OPPCODE.CLIENT_PANO_FINISH, JSON.stringify(p_1));
                        });
                    }
                    else {
                        var b = hugin.loadPano(p_1.name);
                        if (!b) {
                            console.log('error no pano', p_1.name);
                        }
                        else if (p_1.equirect != 2) {
                            hugin.genEquirec(p_1);
                        }
                        else if (p_1.pts != 2) {
                            hugin.runpts(p_1);
                        }
                        else if (p_1.racube != 2) {
                            hugin.genRACube(p_1);
                        }
                        isConvert = false;
                        _this.sendmsg(EnumSocket_1.OPPCODE.CLIENT_PANO_FINISH, JSON.stringify(p_1));
                    }
                    if (isClose)
                        (_a = _this.socket) === null || _a === void 0 ? void 0 : _a.destroy();
                    break;
                case EnumSocket_1.OPPCODE.CLIENT_FINISH:
                    console.log('CLIENT_FINISH');
                    hugin.quitpts();
                    break;
                case EnumSocket_1.OPPCODE.CLIENT_CLOSE:
                    if (isConvert)
                        isClose = true;
                    else
                        (_b = _this.socket) === null || _b === void 0 ? void 0 : _b.destroy();
                    break;
                default:
                    break;
            }
        });
        this.socket.on('error', function () {
            console.log('Connection error');
            _this.socket = undefined;
        });
        this.socket.on('close', function () {
            if (isConnect)
                console.log('Connection closed');
            _this.socket = undefined;
            isConnect = false;
            _this.watingconect();
        });
    };
    return PanoClient;
}());
exports.default = PanoClient;
