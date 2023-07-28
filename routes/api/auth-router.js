import express from "express";

import authController from "../../controllers/auth-controller.js";

import { validateBody } from "../../decorators/index.js";

import { usersSchemas } from "../../models/user.js";

import { isEmptyBody, authenticate } from "../../middlewares/index.js";

const authRouter = express.Router();

// signup
authRouter.post(
  "/register",
  isEmptyBody,
  validateBody(usersSchemas.userRegisterSchema),
  authController.register
);

// signin
authRouter.post(
  "/login",
  isEmptyBody,
  validateBody(usersSchemas.userLoginSchema),
  authController.login
);

authRouter.get("/current", authenticate, authController.getCurrent);

authRouter.post("/logout", authenticate, authController.logout);

export default authRouter;
