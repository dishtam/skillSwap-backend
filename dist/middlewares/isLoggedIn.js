"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedIn = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma = new client_1.PrismaClient();
const isLoggedIn = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            res.status(401).json({ error: "UnauthorizedL no token found" });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log("Decoded JWT:", decoded);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
        });
        if (!user) {
            res.status(401).json({ error: "Unauthorized: wrong user" });
            return;
        }
        const routeUserName = req.params.username;
        if (routeUserName != user.username) {
            res.status(403).json({ error: "Forbidden" });
            return;
        }
        next();
    }
    catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({ error: "Authentication failed" });
    }
};
exports.isLoggedIn = isLoggedIn;
