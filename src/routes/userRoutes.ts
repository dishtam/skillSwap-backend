import express from "express";
import { createUser, getProfile } from "../controller/userController";
import { validateBody } from "../middlewares/userValidator";
import {isLoggedIn} from "../middlewares/isLoggedIn";
import { userSchema } from "../validators/userValidator"

const router = express.Router();

router.post("/register", validateBody(userSchema), createUser);
router.get("/:username", isLoggedIn, getProfile);


export default router;