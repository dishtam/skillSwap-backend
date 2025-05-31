"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const JWT_SECRET = config_1.default.jwtSecret;
const generateToken = (userId) => {
    console.log("JWT_SECRET:", JWT_SECRET);
    return jsonwebtoken_1.default.sign({ userId }, JWT_SECRET, {
        expiresIn: "7d",
    });
};
exports.generateToken = generateToken;
