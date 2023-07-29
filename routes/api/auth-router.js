import express from "express";

import authController from "../../controllers/auth-controller.js";

import { validateBody } from "../../decorators/index.js";

import { usersSchemas } from "../../models/user.js";

import {
  authenticate,
  isEmptyBody,
  isEmptyBodySubscription,
} from "../../middlewares/index.js";

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

// current
authRouter.get("/current", authenticate, authController.getCurrent);

// signout
authRouter.post("/logout", authenticate, authController.logout);

// update subscription: starter, pro, business
authRouter.patch(
  "/",
  authenticate,
  isEmptyBodySubscription,
  validateBody(usersSchemas.userUpdateSubscriptionSchema),
  authController.updateStatusSubscription
);

export default authRouter;
