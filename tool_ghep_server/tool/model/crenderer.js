"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var timeIntervalId;
var dt = 1;
var CRenderer = /** @class */ (function () {
    function CRenderer(opt) {
        var _this = this;
        this.requestClose = false;
        this.clients = new Array();
        this.serversetting = [
            {
                gamepath: 'gamepath',
                outputdir: 'datapath',
                capture: true,
                equirectangular: true,
                photoshop: true,
                racube: true,
                shutdown: true,
                timeout: 900
            }
        ];
        this.serverinfo = {
            request: {
                capture: 0,
                equirect: 0,
                pts: 0,
                racube: 0,
                total: 0
            },
            run: {
                capture: 0,
                equirect: 0,
                pts: 0,
                racube: 0,
                total: 0
            },
            finish: {
                capture: 0,
                equirect: 0,
                pts: 0,
                racube: 0,
                total: 0
            }
        };
        this.lastlog = [];
        Object.assign(this.serversetting[0], opt);
        if ((0, fs_1.existsSync)('tool.log'))
            (0, fs_1.unlinkSync)('tool.log');
        timeIntervalId = setInterval(function () {
            _this.update(dt);
        }, dt * 1000);
    }
    CRenderer.prototype.sendlog = function (catalog, msg) {
        var s = "<".concat(new Date().toLocaleTimeString(), "> [").concat(catalog, "] ").concat(msg);
        this.lastlog.push(s);
        if (this.lastlog.length > 5)
            this.lastlog.shift();
        (0, fs_1.appendFileSync)('tool.log', s + '\n');
    };
    CRenderer.prototype.update = function (t) {
        console.clear();
        console.log('Data: ', this.serversetting[0].outputdir);
        console.log('');
        console.log("================================Config================================");
        console.table(this.serversetting, ['capture', 'equirect', 'photoshop', 'racube', 'shutdown', 'timeout']);
        console.log('');
        console.log("================================Server================================");
        console.table(this.serverinfo, ['capture', 'equirect', 'pts', 'racube', 'total']);
        console.log('');
        console.log("================================Clients================================");
        console.table(this.clients, ['name', 'capture', 'equirect', 'pts', 'racube', 'jobname', 'idle', 'time']);
        console.log('');
        for (var _i = 0, _a = this.lastlog; _i < _a.length; _i++) {
            var item = _a[_i];
            console.log(item);
        }
        if (this.requestClose) {
            clearInterval(timeIntervalId);
        }
        else {
            process.stdout.cursorTo(0, 0);
        }
    };
    return CRenderer;
}());
exports.default = CRenderer;
