"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
const prisma = new client_1.PrismaClient();
const createUser = async (req, res) => {
    try {
        const { name, email, password, bio, location } = req.body;
        const existingUser = await prisma.user.findUnique({
            where: { email: email },
        });
        if (existingUser) {
            res
                .status(409)
                .json({ error: "User with this email already exists" });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                bio: bio || null,
                location: location || null,
            },
        });
        const token = (0, jwt_1.generateToken)(newUser.id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        const { password: _, ...userWithoutPassword } = newUser;
        res
            .status(201)
            .json({ user: userWithoutPassword, message: "User created" });
    }
    catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.createUser = createUser;
