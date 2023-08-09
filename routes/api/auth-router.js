import express from "express";

import authController from "../../controllers/auth-controller.js";

import { validateBody } from "../../decorators/index.js";

import { usersSchemas } from "../../models/user.js";

import {
  authenticate,
  isEmptyBody,
  isEmptyBodySubscription,
  upload,
} from "../../middlewares/index.js";

const authRouter = express.Router();

// signup
authRouter.post(
  "/register",
  isEmptyBody,
  validateBody(usersSchemas.userRegisterSchema),
  authController.register
);

// verification-request
authRouter.get("/verify/:verificationToken", authController.verifyEmail);

// verify
authRouter.post(
  "/verify",
  validateBody(usersSchemas.userEmailSchema),
  authController.resendVerifyEmail
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

// update avatar
authRouter.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"), // Використання middleware upload, де "avatar" - поле в form-data (Body), в якому очікуємо один прикріплений файл (single)
  authController.updateAvatar
);

export default authRouter;
