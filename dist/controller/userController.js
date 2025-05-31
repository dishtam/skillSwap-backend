"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdate = exports.userLogout = exports.userLogin = exports.getProfile = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
const prisma = new client_1.PrismaClient();
const createUser = async (req, res) => {
    try {
        const { username, email, password, bio, location } = req.body;
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
                username,
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
const getProfile = async (req, res) => {
    try {
        const username = req.params.username;
        const user = await prisma.user.findUnique({
            where: { username: username },
            select: {
                id: true,
                username: true,
                email: true,
                bio: true,
                location: true,
                createdAt: true,
            },
        });
        if (!user) {
            res.status(404).json({ error: "User not found" });
            return;
        }
        res.status(200).json({ user });
    }
    catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getProfile = getProfile;
const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await prisma.user.findUnique({
            where: { email: email }
        });
        if (!existingUser) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }
        const isPasswordValid = await bcrypt_1.default.compare(password, existingUser.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid email or password" });
            return;
        }
        const token = (0, jwt_1.generateToken)(existingUser.id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        const { password: _, ...userWithoutPassword } = existingUser;
        res.status(200).json({ user: userWithoutPassword, message: "Login successful" });
    }
    catch (error) {
        console.error("Error logging in user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.userLogin = userLogin;
const userLogout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
};
exports.userLogout = userLogout;
const userUpdate = async (req, res) => {
    try {
        const { username } = req.params;
        const updateData = { ...req.body };
        if (updateData.password) {
            updateData.password = await bcrypt_1.default.hash(updateData.password, 10);
        }
        const updatedUser = await prisma.user.update({
            where: { username: username },
            data: updateData,
        });
        const { password, ...userWithoutPassword } = updatedUser;
        res
            .status(200)
            .json({
            message: "User updated successfully",
            user: userWithoutPassword,
        });
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.userUpdate = userUpdate;
