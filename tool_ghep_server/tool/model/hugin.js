"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path = require("path");
var child_process_1 = require("child_process");
function runcommand(filepath, args) {
    (0, child_process_1.spawnSync)(filepath, args, { stdio: [process.stdin, process.stdout, process.stderr] });
}
function testcommand(filepath, args) {
    return new Promise(function (rel, rej) {
        (0, child_process_1.exec)("".concat(filepath, " ").concat(args.join(' ')), function (err, stdout, stderr) {
            if (err) {
                rej(err);
            }
            else if (stderr) {
                rej(stderr);
            }
            else {
                rel(stdout);
            }
        });
    });
}
var racuberot = [
    [0, 0, 0],
    [0, 45, 0],
    [0, 90, 0],
    [0, 135, 0],
    [0, 180, 0],
    [0, 225, 0],
    [0, 270, 0],
    [0, 315, 0],
    [315, 0, 0],
    [330, 54.7356, 324.7356],
    [0, 90, 315],
    [30, 125.2644, 324.7356],
    [45, 180, 0],
    [30, 234.7356, 35.26439],
    [0, 270, 45],
    [330, 305.2644, 35.2644],
    [270, 0, 0],
    [45, 0, 0],
    [30, 54.73562, 35.2644],
    [0, 90, 45],
    [330, 125.2644, 35.2644],
    [315, 180, 0],
    [330, 234.7356, 324.7356],
    [0, 270, 315],
    [30, 305.2644, 324.7356],
    [90, 0, 0]
];
var tmpcontent = [];
var HuginApp = /** @class */ (function () {
    function HuginApp() {
        this.tile = 512;
        this.outwidth = 16384;
        this.outheight = 8192;
        this.pts = {
            action: "TN_360_b_bambu",
            group: "TN_v13_duyen"
        };
        this.photoshop = false;
        this.rootdir = '';
        this.indir = 'pano';
        this.outdir = 'pano_out';
        this.tmpdir = 'tmp';
        this.panodata = {
            id: '',
            guid: '',
            name: '',
            profile: '',
            quality: 3
        };
        this.customdata = {
            fov: 68,
            width: 2640,
            height: 1760,
            faces: [8, 8, 8, 8, 2, 2],
            faceangle: [18, 50, -18, -50, -75, 75]
        };
        this.canpts = false;
    }
    HuginApp.prototype.init = function (config) {
        var _this = this;
        this.customdata = config.customdata;
        this.outwidth = config.quality * 1024 * 4;
        this.outheight = this.outwidth / 2;
        var d = this.outwidth / Math.PI;
        this.customdata.width = d * (Math.tan(this.customdata.fov / 360 * Math.PI));
        this.customdata.width = this.customdata.width - this.customdata.width % 3 + 3;
        this.customdata.height = this.customdata.width / 3 * 2;
        this.pts = config.pts;
        this.photoshop = config.photoshop;
        this.rootdir = config.outputdir;
        this.indir = path.join(config.outputdir, 'pano');
        this.outdir = path.join(config.outputdir, 'pano_out');
        if (!(0, fs_1.existsSync)(this.indir)) {
            (0, fs_1.mkdirSync)(this.indir);
        }
        if (!(0, fs_1.existsSync)(this.outdir)) {
            (0, fs_1.mkdirSync)(this.outdir);
        }
        if (!(0, fs_1.existsSync)(this.tmpdir)) {
            (0, fs_1.mkdirSync)(this.tmpdir);
        }
        //test pts
        if (!(0, fs_1.existsSync)('test.tif'))
            (0, fs_1.copyFileSync)('tool/lut.tif', 'test.tif');
        if ((0, fs_1.existsSync)('test_out.tif'))
            (0, fs_1.unlinkSync)('test_out.tif');
        return testcommand('powershell', ['-ExecutionPolicy', 'bypass', '-File', '.\\tool\\pts.ps1', '-test', '-group', this.pts.group, '-action', this.pts.action, '-show'])
            .then(function (s) {
            _this.canpts = true;
            console.log("Test pts action ".concat(_this.pts.action, " group ").concat(_this.pts.group, ": OK"));
        })
            .catch(function (err) {
            _this.canpts = false;
            console.log(err);
            console.log("Test pts action ".concat(_this.pts.action, " group ").concat(_this.pts.group, ": Error"));
        });
    };
    HuginApp.prototype.loadPano = function (id) {
        if ((0, fs_1.existsSync)(this.indir + "/".concat(id, ".json")))
            this.panodata = JSON.parse((0, fs_1.readFileSync)(this.indir + "/".concat(id, ".json"), { encoding: 'utf8' }));
        else if ((0, fs_1.existsSync)(this.outdir + "/".concat(id, ".json")))
            this.panodata = JSON.parse((0, fs_1.readFileSync)(this.outdir + "/".concat(id, ".json"), { encoding: 'utf8' }));
        else
            return false;
        return true;
    };
    HuginApp.prototype.genEquirec = function (job) {
        if (job.equirect == 2)
            return job;
        var id = this.panodata.name;
        var guid = this.panodata.guid;
        var iw = this.customdata.width;
        var ih = this.customdata.height;
        var fov = this.customdata.fov;
        var outwidth = this.outwidth;
        var outheight = this.outheight;
        tmpcontent.length = 0;
        tmpcontent.push("p f2 w".concat(outwidth, " h").concat(outheight, " v360  k0 E0 R0 n\"TIFF_m c:LZW r:CROP\""));
        tmpcontent.push("m i0");
        var i = 0;
        for (var ring = 0; ring < this.customdata.faces.length; ring++) {
            var a = 360 / this.customdata.faces[ring];
            var p = this.customdata.faceangle[ring];
            for (var face = 0; face < this.customdata.faces[ring]; face++) {
                var y = (360 - face * a) % 360;
                if (i == 0) {
                    tmpcontent.push("i w".concat(iw, " h").concat(ih, " f0 v").concat(fov, " Ra0 Rb0 Rc0 Rd0 Re0 Eev0 Er1 Eb1 r0 p").concat(p, " y").concat(y, " TrX0 TrY0 TrZ0 Tpy0 Tpp0 j0 a0 b0 c0 d0 e0 g0 t0 Va1 Vb0 Vc0 Vd0 Vx0 Vy0  Vm5 n\"").concat(this.indir, "\\").concat(guid, "\\").concat(i, ".png\""));
                }
                else {
                    tmpcontent.push("i w".concat(iw, " h").concat(ih, " f0 v=0 Ra=0 Rb=0 Rc=0 Rd=0 Re=0 Eev0 Er1 Eb1 r0 p").concat(p, " y").concat(y, " TrX0 TrY0 TrZ0 Tpy0 Tpp0 j0 a=0 b=0 c=0 d=0 e=0 g=0 t=0 Va=0 Vb=0 Vc=0 Vd=0 Vx=0 Vy=0  Vm5 n\"").concat(this.indir, "\\").concat(guid, "\\").concat(i, ".png\""));
                }
                i++;
            }
        }
        (0, fs_1.writeFileSync)('script.txt', tmpcontent.join('\n'));
        runcommand('tool\\hugin_executor', ['--stitching', 'script.txt', "--prefix=".concat(this.tmpdir, "\\").concat(id)]);
        (0, fs_1.copyFileSync)("".concat(this.tmpdir, "/").concat(id, ".tif"), "".concat(this.indir, "/").concat(id, ".tif"));
        job.equirect = 2;
        // copyFileSync(`${this.tmpdir}/${id}.tif`,`${this.outdir}/${id}.tif`)
        // copyFileSync(`${this.indir}/${id}.json`,`${this.outdir}/${id}.json`)
        return job;
    };
    HuginApp.prototype.genCube = function (x, y, z, oname, needcrop) {
        if (needcrop === void 0) { needcrop = true; }
        var id = this.panodata.name;
        var guid = this.panodata.guid;
        var w = this.outwidth / 4;
        var crop = w / 4;
        tmpcontent.length = 0;
        if (needcrop) {
            tmpcontent.push("p f0 w".concat(w, " h").concat(w, " v90 k0 E0 R0 S").concat(crop, ",").concat(crop * 3, ",").concat(crop, ",").concat(crop * 3));
        }
        else {
            tmpcontent.push("p f0 w".concat(w, " h").concat(w, " v90 k0 E0 R0 "));
        }
        tmpcontent.push("m g1 i2 f0 m0");
        if (this.photoshop)
            tmpcontent.push("o w".concat(this.outwidth, " h").concat(this.outheight, " f4 p").concat(x, " r").concat(z, " v360 y").concat(y, " u10 m0 n\"").concat(this.outdir, "/").concat(id, ".tif\""));
        else
            tmpcontent.push("o w".concat(this.outwidth, " h").concat(this.outheight, " f4 p").concat(x, " r").concat(z, " v360 y").concat(y, " u10 m0 n\"").concat(this.indir, "/").concat(id, ".tif\""));
        (0, fs_1.writeFileSync)('script.txt', tmpcontent.join('\n'));
        runcommand('tool/nona', ['-o', "".concat(this.tmpdir, "/").concat(oname), 'script.txt']);
    };
    HuginApp.prototype.runpts = function (job) {
        if (job.pts == 2)
            return job;
        var id = this.panodata.name;
        if (!(0, fs_1.existsSync)("".concat(this.indir, "/").concat(id, ".tif")) || !this.canpts) {
            return job;
        }
        runcommand('powershell', ['-ExecutionPolicy', 'bypass', '-File', '.\\tool\\pts.ps1', '-id', id, '-group', this.pts.group, '-action', this.pts.action, '-cwd', this.rootdir, '-show']);
        job.pts = 2;
        return job;
    };
    HuginApp.prototype.quitpts = function () {
        if (this.canpts) {
            runcommand('powershell', ['-ExecutionPolicy', 'bypass', '-File', '.\\tool\\pts.ps1', '-quit']);
        }
    };
    HuginApp.prototype.genRACube = function (job) {
        var id = this.panodata.name;
        console.log('Make RACube . . . .', id);
        console.log(job);
        if (job.racube == 2)
            return job;
        if (this.photoshop && !(0, fs_1.existsSync)("".concat(this.outdir, "/").concat(id, ".tif"))) {
            return job;
        }
        if (!this.photoshop && !(0, fs_1.existsSync)("".concat(this.indir, "/").concat(id, ".tif"))) {
            return job;
        }
        var guid = this.panodata.guid;
        if (!(0, fs_1.existsSync)("".concat(this.outdir, "/").concat(guid)))
            (0, fs_1.mkdirSync)("".concat(this.outdir, "/").concat(guid));
        for (var i = 0; i < 26; i++) {
            this.genCube(racuberot[i][0], racuberot[i][1], racuberot[i][2], 'cube_' + i);
            runcommand('tool/convert', [
                "".concat(this.tmpdir, "/cube_").concat(i, "0000.tif"),
                '-trim',
                '+repage',
                '-flatten',
                '-crop',
                "".concat(this.tile, "x").concat(this.tile),
                '-set',
                "filename:tile",
                "%[fx:page.y/".concat(this.tile, "]_%[fx:page.x/").concat(this.tile, "]"),
                '+repage',
                '+adjoin',
                '-quality', '90',
                "".concat(this.outdir, "/").concat(guid, "/").concat(this.panodata.quality, "_").concat(i, "_%[filename:tile].jpg")
            ]);
            (0, fs_1.unlinkSync)("".concat(this.tmpdir, "/cube_").concat(i, "0000.tif"));
        }
        if (this.photoshop)
            runcommand('tool/convert', ["".concat(this.outdir, "/").concat(id, ".tif"), '-flatten', '-quality', '90', '-resize', '1024x512', "".concat(this.outdir, "/").concat(guid, "/pano.jpg")]);
        else
            runcommand('tool/convert', ["".concat(this.indir, "/").concat(id, ".tif"), '-flatten', '-quality', '90', '-resize', '1024x512', "".concat(this.outdir, "/").concat(guid, "/pano.jpg")]);
        if ((0, fs_1.existsSync)("".concat(this.indir, "/").concat(guid, "/thumb.png")))
            runcommand('tool/convert', ["".concat(this.indir, "/").concat(guid, "/thumb.png"), '-flatten', '-quality', '90', '-resize', '1024x512', "".concat(this.outdir, "/").concat(guid, "/thumb.jpg")]);
        else
            (0, fs_1.copyFileSync)("".concat(this.outdir, "/").concat(guid, "/pano.jpg"), "".concat(this.outdir, "/").concat(guid, "/thumb.jpg"));
        (0, fs_1.copyFileSync)("".concat(this.indir, "/").concat(id, ".json"), "".concat(this.outdir, "/").concat(id, ".json"));
        job.racube = 2;
        return job;
    };
    return HuginApp;
}());
exports.default = HuginApp;
