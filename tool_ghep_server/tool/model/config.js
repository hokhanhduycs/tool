"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    port: 3000,
    socketport: 27015,
    quality: 3,
    skipframe: 40,
    skipframecapture: 40,
    offscreendelay: 30,
    outputdir: "R:\\QTrung\\TestCapture\\pano",
    pts: {
        action: "TN_360_b_bambu",
        group: "TN_v13_duyen"
    },
    photoshop: false,
    capture: false,
    equirect: false,
    racube: false,
    shutdown: false,
    timeout: 900,
    customdata: {
        fov: 68,
        width: 2640,
        height: 1760,
        faces: [
            8,
            8,
            8,
            8,
            2,
            2
        ],
        faceangle: [
            18,
            50,
            -18,
            -50,
            -75,
            75
        ]
    },
    cvars: {
        "r.ForceLOD": "0",
        "r.HLOD": "0",
        "r.ViewDistanceScale": "30",
        "r.MipMapLODBias": "-1",
        "r.Shadow.MaxResolution": "4096",
        "r.LightShaftQuality": "0",
        "ra.PauseAutoAnimation": "1",
        "foliage.LODdistancescale": "3",
        "r.setRes": "2640x1760f"
    }
};
