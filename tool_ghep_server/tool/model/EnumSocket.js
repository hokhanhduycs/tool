"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateMSG = exports.ParseMSG = exports.OPPCODE = void 0;
var OPPCODE = {
    CLIENT_READY: 101,
    CLIENT_PANO: 102,
    CLIENT_PANO_FINISH: 105,
    CLIENT_CONFIG: 103,
    CLIENT_CLOSE: 108,
    CLIENT_FINISH: 109,
    CLIENT_ERR: 106,
    GAME_READY: 201,
    GAME_PANO: 202,
    GAME_CAPTURE_ALL: 203,
    GAME_GOTO: 204,
    GAME_LOAD_DATA: 205,
    GAME_CAPTURE_Pano: 206,
    GAME_STOP_CAPTURE: 208,
    GAME_FINISH: 209,
    GAME_CVAR: 210,
    GAME_START: 220,
};
exports.OPPCODE = OPPCODE;
var SB = Buffer.from('RA');
var ParseMSG = function (chunk) {
    if (chunk.length < 6 || !SB.equals(chunk.slice(0, 2)))
        return null;
    return {
        code: chunk.slice(2, 6).readUInt8(3),
        payload: "".concat(chunk.slice(6))
    };
};
exports.ParseMSG = ParseMSG;
var CreateMSG = function (code, msg) {
    return Buffer.concat([SB, Buffer.from([0, 0, 0, code]), Buffer.from(msg)]);
};
exports.CreateMSG = CreateMSG;
