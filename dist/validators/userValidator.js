"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userUpdateSchema = exports.userSchema = void 0;
const zod_1 = require("zod");
exports.userSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, "Name is required").trim(),
    email: zod_1.z.string().email("Invalid email").trim(),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
    bio: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
});
exports.userUpdateSchema = zod_1.z.object({
    username: zod_1.z
        .string()
        .min(3, "Name must be at least 3 characters")
        .trim()
        .optional(),
    email: zod_1.z.string().email("Invalid email").trim().optional(),
    password: zod_1.z
        .string()
        .min(6, "Password must be at least 6 characters")
        .optional(),
    bio: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
});
