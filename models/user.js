import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleMongooseError } from "./hooks.js";

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
    token: String,
  },
  // Поле з версією - не створювати, поле з датою створення та оновлення - створювати
  { versionKey: false, timestamps: true }
);

userSchema.post("save", handleMongooseError);

// Joi-schema - register
const registerSchema = Joi.object({
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

// Joi-schema - login
const loginSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    "any.required": "missing required password field",
    "string.empty": "password cannot be empty",
  }),
  email: Joi.string().pattern(emailRegexp).required().messages({
    "any.required": "missing required email field",
    "string.empty": "email cannot be empty",
  }),
});

const schemas = {
  registerSchema,
  loginSchema,
};

// Mongoose-model
const User = model("user", userSchema);

export { schemas, User };
