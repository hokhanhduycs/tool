"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Job = /** @class */ (function () {
    function Job(n) {
        this.name = '';
        this.start = 0;
        this.end = 0;
        this.capture = 0;
        this.equirect = 0;
        this.pts = 0;
        this.racube = 0;
        this.finish = 0;
        this.name = n;
    }
    Job.prototype.checkfinish = function () {
        this.end = new Date().getTime();
        if (this.capture == 2
            && this.equirect == 2
            && this.pts == 2
            && this.racube == 2)
            this.finish = 2;
        else
            this.finish = 0;
    };
    return Job;
}());
exports.default = Job;
