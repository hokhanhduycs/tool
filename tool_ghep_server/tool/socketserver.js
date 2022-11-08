"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var os_1 = require("os");
var net_1 = require("net");
var config_js_1 = require("./model/config.js");
var EnumSocket_js_1 = require("./model/EnumSocket.js");
var fs_1 = require("fs");
var http = require("http");
var url_1 = require("url");
var job_js_1 = require("./model/job.js");
var crenderer_js_1 = require("./model/crenderer.js");
var client_js_1 = require("./model/client.js");
var lastjob = {
    opt: {},
    jobs: new Array()
};
var PanoServer = /** @class */ (function (_super) {
    __extends(PanoServer, _super);
    function PanoServer(opt) {
        var _this = this;
        var _a;
        _this = _super.call(this, opt) || this;
        _this.jobs = [];
        _this.ip = '127.0.0.1';
        _this.game = null;
        _this.interval = null;
        _this.requestClose = false;
        _this.clients.length = 0;
        var nets = (0, os_1.networkInterfaces)();
        _this.ip = ((_a = nets.Ethernet) === null || _a === void 0 ? void 0 : _a.filter(function (x) { return x.family == 'IPv4'; })[0].address) || '192.168.10.x';
        _this.setserverip();
        if (!(0, fs_1.existsSync)(opt.outputdir) ||
            !(0, fs_1.existsSync)(opt.outputdir + '/requestcapture.json') ||
            !(0, fs_1.existsSync)(opt.outputdir + '/config.json')) {
            console.log('server', 'can not found requestcapture.json or config.json in ' + opt.outputdir);
            return _this;
        }
        var localconfig = JSON.parse((0, fs_1.readFileSync)(opt.outputdir + '/config.json', { encoding: 'utf8' }));
        Object.assign(config_js_1.default, localconfig, opt);
        lastjob.jobs = _this.jobs;
        lastjob.opt = opt;
        return _this;
    }
    PanoServer.prototype.sendlog = function (catalog, msg) {
        (0, fs_1.writeFileSync)("".concat(config_js_1.default.outputdir, "/lastjob.json"), JSON.stringify(lastjob, null, 2));
        _super.prototype.sendlog.call(this, catalog, msg);
    };
    PanoServer.prototype.addjob = function (jname) {
        if (this.jobs.find(function (x) { return x.name == jname; })) {
            console.log('Job duplicate', jname);
            return null;
        }
        var j = new job_js_1.default(jname);
        // 
        // todo check dir
        if (!config_js_1.default.capture || (0, fs_1.existsSync)("".concat(config_js_1.default.outputdir, "/pano/").concat(j.name, ".json")))
            j.capture = 2;
        else
            j.capture = 0;
        if (!config_js_1.default.equirect || (0, fs_1.existsSync)("".concat(config_js_1.default.outputdir, "/pano/").concat(j.name, ".tif")))
            j.equirect = 2;
        else
            j.equirect = 0;
        if (!config_js_1.default.photoshop || (0, fs_1.existsSync)("".concat(config_js_1.default.outputdir, "/pano_out/").concat(j.name, ".tif")))
            j.pts = 2;
        else
            j.pts = 0;
        if (!config_js_1.default.racube || (0, fs_1.existsSync)("".concat(config_js_1.default.outputdir, "/pano_out/").concat(j.name, ".json")))
            j.racube = 2;
        else
            j.racube = 0;
        this.jobs.push(j);
        return j;
    };
    PanoServer.prototype.updateinfo = function () {
        var info = this.serverinfo;
        info.request.total = 0;
        info.run.total = 0;
        info.finish.total = 0;
        if (config_js_1.default.capture) {
            info.request.capture = this.jobs.filter(function (x) { return x.capture == 0; }).length;
            info.run.capture = this.jobs.filter(function (x) { return x.capture == 1; }).length;
            info.finish.capture = this.jobs.filter(function (x) { return x.capture == 2; }).length;
            info.request.total += info.request.capture;
            info.run.total += info.run.capture;
            info.finish.total += info.finish.capture;
        }
        if (config_js_1.default.equirect) {
            info.request.equirect = this.jobs.filter(function (x) { return x.equirect == 0; }).length;
            info.run.equirect = this.jobs.filter(function (x) { return x.equirect == 1; }).length;
            info.finish.equirect = this.jobs.filter(function (x) { return x.equirect == 2; }).length;
            info.request.total += info.request.equirect;
            info.run.total += info.run.equirect;
            info.finish.total += info.finish.equirect;
        }
        if (config_js_1.default.pts) {
            info.request.pts = this.jobs.filter(function (x) { return x.pts == 0; }).length;
            info.run.pts = this.jobs.filter(function (x) { return x.pts == 1; }).length;
            info.finish.pts = this.jobs.filter(function (x) { return x.pts == 2; }).length;
            info.request.total += info.request.pts;
            info.run.total += info.run.pts;
            info.finish.total += info.finish.pts;
        }
        if (config_js_1.default.racube) {
            info.request.racube = this.jobs.filter(function (x) { return x.racube == 0; }).length;
            info.run.racube = this.jobs.filter(function (x) { return x.racube == 1; }).length;
            info.finish.racube = this.jobs.filter(function (x) { return x.racube == 2; }).length;
            info.request.total += info.request.pts;
            info.run.total += info.run.pts;
            info.finish.total += info.finish.pts;
        }
        // info.request.total = info.request.capture+info.request.equirect+info.request.pts+info.request.racube
        // info.run.total = info.run.capture+info.run.equirect+info.run.pts+info.run.racube
        // info.finish.total = info.finish.capture+info.finish.equirect+info.finish.pts+info.finish.racube
    };
    PanoServer.prototype.setserverip = function () {
        var params = new url_1.URLSearchParams();
        params.append('server', this.ip);
        var data = params.toString();
        var options = {
            host: '192.168.10.200',
            path: '/ratool/uetool/',
            port: '8080',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(data)
            },
            method: 'POST'
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
            var req = http.request(options, callback);
            req.write(data);
            req.end();
        });
    };
    PanoServer.prototype.update = function (dt) {
        this.updateinfo();
        // if(this.serverinfo.request.capture){
        //     const job = this.jobs.find(x=>x.capture==0 && x.finish==0)
        //     const client = this.clients.find((x=>x.idle && x.capture)) 
        //     if(client){
        //     }
        // }
        if (this.serverinfo.request.capture) {
            var job = this.jobs.find(function (x) { return x.capture == 0 && x.finish == 0; });
            var client = this.clients.find((function (x) { return x.idle && x.capture; }));
            if (job && client) {
                client.idle = false;
                client.job = job;
                client.jobname = job.name;
                client.time = 0;
                job.start = new Date().getTime();
                job.capture = 1;
                job.finish = 1;
                client.socket.write((0, EnumSocket_js_1.CreateMSG)(EnumSocket_js_1.OPPCODE.CLIENT_PANO, JSON.stringify(job)));
                this.sendlog('server', "request capture ".concat(client.jobname, " to ").concat(client.name));
            }
        }
        if (this.serverinfo.request.pts) {
            var job = this.jobs.find(function (x) { return x.pts == 0 && x.finish == 0 && x.equirect == 2; });
            var client = this.clients.find((function (x) { return x.idle && x.pts; }));
            if (job && client) {
                client.idle = false;
                client.job = job;
                client.jobname = job.name;
                client.time = 0;
                job.start = new Date().getTime();
                job.pts = 1;
                job.finish = 1;
                client.socket.write((0, EnumSocket_js_1.CreateMSG)(EnumSocket_js_1.OPPCODE.CLIENT_PANO, JSON.stringify(job)));
                this.sendlog('server', "request convert ".concat(client.jobname, " to ").concat(client.name));
            }
        }
        if (this.serverinfo.request.equirect) {
            var job = this.jobs.find(function (x) { return x.equirect == 0 && x.finish == 0 && x.capture == 2; });
            var client = this.clients.find((function (x) { return x.idle && x.equirect; }));
            if (job && client) {
                client.idle = false;
                client.job = job;
                client.jobname = job.name;
                client.time = 0;
                job.start = new Date().getTime();
                job.equirect = 1;
                job.finish = 1;
                client.socket.write((0, EnumSocket_js_1.CreateMSG)(EnumSocket_js_1.OPPCODE.CLIENT_PANO, JSON.stringify(job)));
                this.sendlog('server', "request convert ".concat(client.jobname, " to ").concat(client.name));
            }
        }
        if (this.serverinfo.request.racube) {
            var job = this.jobs.find(function (x) { return x.racube == 0 && x.finish == 0 && (x.pts == 2 || (x.equirect && !config_js_1.default.photoshop)); });
            var client = this.clients.find((function (x) { return x.idle && x.racube; }));
            if (job && client) {
                client.idle = false;
                client.job = job;
                client.jobname = job.name;
                client.time = 0;
                job.start = new Date().getTime();
                job.racube = 1;
                job.finish = 1;
                client.socket.write((0, EnumSocket_js_1.CreateMSG)(EnumSocket_js_1.OPPCODE.CLIENT_PANO, JSON.stringify(job)));
                this.sendlog('server', "request convert ".concat(client.jobname, " to ").concat(client.name));
            }
        }
        if (!this.game && !this.requestClose && this.serverinfo.finish.total != 0 && this.serverinfo.request.total == 0 && this.serverinfo.run.total == 0) {
            this.requestClose = true;
            this.sendlog('server', 'FINISH');
            for (var _i = 0, _a = this.clients; _i < _a.length; _i++) {
                var client = _a[_i];
                if (client.socket) {
                    client.socket.write((0, EnumSocket_js_1.CreateMSG)(EnumSocket_js_1.OPPCODE.CLIENT_FINISH, ''));
                }
            }
        }
        for (var _b = 0, _c = this.clients; _b < _c.length; _b++) {
            var client = _c[_b];
            if (!client.idle) {
                client.time += dt;
            }
            if (client.time > config_js_1.default.timeout) {
                //todo stop convert 
            }
        }
        this.updateinfo();
        _super.prototype.update.call(this, dt);
    };
    PanoServer.prototype.init = function () {
        var _this = this;
        this.server = (0, net_1.createServer)();
        this.server.listen(config_js_1.default.socketport);
        this.server.on('connection', function (socket) {
            var client = new client_js_1.default(socket);
            socket.write((0, EnumSocket_js_1.CreateMSG)(EnumSocket_js_1.OPPCODE.CLIENT_CONFIG, JSON.stringify(config_js_1.default)));
            socket.on('data', function (chunk) {
                var data = (0, EnumSocket_js_1.ParseMSG)(chunk);
                if (!data) {
                    _this.sendlog('server', "wrong: ".concat(chunk));
                    return;
                }
                switch (data.code) {
                    case EnumSocket_js_1.OPPCODE.CLIENT_PANO_FINISH:
                        if (!client.job) {
                            client.job = new job_js_1.default('default');
                            _this.jobs.push(client.job);
                        }
                        Object.assign(client.job, JSON.parse(data.payload));
                        client.job.checkfinish();
                        _this.sendlog(client.name, "finish job ".concat(client.job.name, " after ").concat(client.job.end - client.job.start, " ms"));
                        client.jobname = "";
                        client.idle = true;
                        break;
                    case EnumSocket_js_1.OPPCODE.CLIENT_READY:
                        console.log(data.payload.length);
                        console.log(data.payload);
                        Object.assign(client, JSON.parse(data.payload));
                        _this.sendlog(client.name, "ready");
                        _this.clients.push(client);
                        client.idle = true;
                        break;
                    // case OPPCODE.GAME_READY:
                    //     client.capture = true
                    //     client.name = data.payload
                    //     this.requestClose = false
                    //     break;
                    // case OPPCODE.GAME_CAPTURE_ALL:
                    //     this.sendlog(client.name,'send GAME_CAPTURE_ALL')
                    //     if(this.game)
                    //         this.game.socket.write(CreateMSG(OPPCODE.GAME_CAPTURE_ALL,''))
                    //     break;
                    // case OPPCODE.GAME_FINISH:
                    //     this.sendlog(client.name,'GAME_FINISH ------')
                    //     this.requestClose = true
                    //     break;
                    // case OPPCODE.GAME_PANO:
                    //     this.sendlog(client.name,'GAME_Capture ------'+data.payload)
                    //     break;
                    default:
                        break;
                }
            });
            // ends the connection.
            socket.on('end', function () {
                _this.clients = _this.clients.filter(function (x) { return x.socket != socket; });
                _this.sendlog(client.name, 'closed');
            });
            socket.on('error', function (err) {
                _this.clients = _this.clients.filter(function (x) { return x.socket != socket; });
                if (client.job && client.job.finish != 2) {
                    client.job.finish = 0;
                    if (client.job.capture == 1)
                        client.job.capture = 0;
                    if (client.job.equirect == 1)
                        client.job.equirect = 0;
                    if (client.job.pts == 1)
                        client.job.pts = 0;
                    if (client.job.racube == 1)
                        client.job.racube = 0;
                    _this.sendlog(client.name, "Break job: ".concat(client.job.name));
                }
                _this.sendlog(client.name, "error : ".concat(err));
            });
        });
        //load data
        // if(existsSync(`${config.outputdir}/lastjob.json`)){
        //     this.jobs = JSON.parse(readFileSync(`${config.outputdir}/lastjob.json`,{encoding:'utf8'})).jobs
        // }else
        {
            var data = JSON.parse((0, fs_1.readFileSync)(config_js_1.default.outputdir + '/requestcapture.json', { encoding: 'utf8' }));
            data.reject = data.reject || { data: [] };
            data.pending = data.pending || { data: [] };
            var ls = __spreadArray(__spreadArray([], data.reject.data, true), data.pending.data, true);
            for (var _i = 0, ls_1 = ls; _i < ls_1.length; _i++) {
                var item = ls_1[_i];
                var j = this.addjob(item.name);
            }
        }
        this.sendlog('server', 'load data done');
    };
    return PanoServer;
}(crenderer_js_1.default));
exports.default = PanoServer;
