import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleMongooseError, validateAtUpdate } from "./hooks.js";

// constants
const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const subscriptionList = ["starter", "pro", "business"];

// Mongoose-Schema
const userSchema = new Schema(
  {
    password: {
      type: String,
      minlength: 6,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      match: emailRegexp,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: subscriptionList,
      default: "starter",
    },
    token: { type: String, default: "" },
    avatarURL: { type: String, required: true },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      // required: [true, "Verify token is required"],
    },
  },
  // Поле з версією - не створювати, поле з датою створення та оновлення - створювати
  { versionKey: false, timestamps: true }
);

userSchema.pre("findOneAndUpdate", validateAtUpdate);

userSchema.post("save", handleMongooseError);
userSchema.post("findOneAndUpdate", handleMongooseError);

// Joi-schema - register
const userRegisterSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    "any.required": "missing required password field",
    "string.empty": "password cannot be empty",
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "missing required email field",
    "string.empty": "email cannot be empty",
  }),
  subscription: Joi.string().valid(...subscriptionList),
});

// Joi-schema - verify
const userEmailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "missing required email field",
    "string.empty": "email cannot be empty",
  }),
});

// Joi-schema - login
const userLoginSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    "any.required": "missing required password field",
    "string.empty": "password cannot be empty",
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "missing required email field",
    "string.empty": "email cannot be empty",
  }),
});

// Joi-schema - subscription
const userUpdateSubscriptionSchema = Joi.object({
  subscription: Joi.string()
    .valid(...subscriptionList)
    .required(),
});

const usersSchemas = {
  userRegisterSchema,
  userEmailSchema,
  userLoginSchema,
  userUpdateSubscriptionSchema,
};

// Mongoose-model
const User = model("user", userSchema);

export { usersSchemas, User };
