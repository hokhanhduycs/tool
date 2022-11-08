"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var job_1 = require("./job");
var Client = /** @class */ (function () {
    function Client(s) {
        this.name = 'default';
        this.idle = false;
        this.capture = false;
        this.equirect = false;
        this.pts = false;
        this.racube = false;
        this.job = new job_1.default('none');
        this.jobname = '';
        this.time = 0;
        this.socket = s;
    }
    return Client;
}());
exports.default = Client;
