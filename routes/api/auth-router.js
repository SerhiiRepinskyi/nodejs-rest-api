import express from "express";

import ctrl from "../../controllers/auth-controller.js";

import { validateBody } from "../../decorators/index.js";

import { schemas } from "../../models/user.js";

import { isEmptyBody } from "../../middlewares/index.js";

const authRouter = express.Router();

// signup
authRouter.post(
  "/register",
  isEmptyBody,
  validateBody(schemas.registerSchema),
  ctrl.register
);

// signin
authRouter.post(
  "/login",
  isEmptyBody,
  validateBody(schemas.registerSchema),
  ctrl.login
);

export default authRouter;
