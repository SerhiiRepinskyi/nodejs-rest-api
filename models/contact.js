import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleMongooseError, validateAtUpdate } from "./hooks.js";

// Mongoose-Schema
const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  // Поле з версією - не створювати, поле з датою створення та оновлення - створювати
  { versionKey: false, timestamps: true }
);

// pre-hook - ПЕРЕД (pre) операцією (findOneAndUpdate) викликати функцію (validateAtUpdate)
// За замовчуванням, при update Mongoose не проводить валідацію
contactSchema.pre("findOneAndUpdate", validateAtUpdate);

// post-hooks - Якщо валідація ПІСЛЯ (post) спроби виконання операціі ("save", "findOneAndUpdate") пройшла з помилкою (error),
// то викликається функція (handleMongooseError), яка присвоїть помилці статус (400)
// Інакше помилка при при update викидається Mongoose без статусу
contactSchema.post("save", handleMongooseError);
contactSchema.post("findOneAndUpdate", handleMongooseError);

// Joi-schema - опис вимог до тіла запиту (об'єкт req.body)
// Joi-schema - contacts
const contactsAddSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "missing required name field",
    "string.empty": "name cannot be empty",
  }),
  email: Joi.string().required().messages({
    "any.required": "missing required email field",
    "string.empty": "email cannot be empty",
  }),
  phone: Joi.string().required().messages({
    "any.required": "missing required phone field",
    "string.empty": "phone cannot be empty",
  }),
  favorite: Joi.boolean(),
});

// Joi-schema - contacts-favorite
const contactUpdateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

const contactsSchemas = {
  contactsAddSchema,
  contactUpdateFavoriteSchema,
};

// Mongoose-model
const Contact = model("contact", contactSchema);

export { contactsSchemas, Contact };
