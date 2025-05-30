"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const validateBody_1 = require("./../middlewares/validateBody");
const userValidator_1 = require("../validators/userValidator");
const router = express_1.default.Router();
router.post("/register", (0, validateBody_1.validateBody)(userValidator_1.userSchema), userController_1.createUser);
exports.default = router;
