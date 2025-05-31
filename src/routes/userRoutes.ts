import express from "express";
import {
  createUser,
  getProfile,
  userLogin,
  userLogout,
  userUpdate
} from "../controller/userController";
import { validateBody } from "../middlewares/userValidator";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { userSchema, userUpdateSchema } from "../validators/userValidator";

const router = express.Router();

router.post("/register", validateBody(userSchema), createUser);
router.get("/:username", isLoggedIn, getProfile);
router.post("/login", userLogin);
router.post("/logout/:username", isLoggedIn, userLogout);
router.put("/update-user/:username", isLoggedIn, validateBody(userUpdateSchema),userUpdate)


export default router;
