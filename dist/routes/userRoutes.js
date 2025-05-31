"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const userValidator_1 = require("../middlewares/userValidator");
const isLoggedIn_1 = require("../middlewares/isLoggedIn");
const userValidator_2 = require("../validators/userValidator");
const router = express_1.default.Router();
router.post("/register", (0, userValidator_1.validateBody)(userValidator_2.userSchema), userController_1.createUser);
router.get("/:username", isLoggedIn_1.isLoggedIn, userController_1.getProfile);
router.post("/login", userController_1.userLogin);
router.post("/logout/:username", isLoggedIn_1.isLoggedIn, userController_1.userLogout);
router.put("/update-user/:username", isLoggedIn_1.isLoggedIn, (0, userValidator_1.validateBody)(userValidator_2.userUpdateSchema), userController_1.userUpdate);
exports.default = router;
