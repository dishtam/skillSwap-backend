import express from "express";
import { createUser } from "../controller/userController";
import { validateBody } from "./../middlewares/validateBody";
import { userSchema } from "../validators/userValidator"

const router = express.Router();

router.post("/register", validateBody(userSchema), createUser);

export default router;