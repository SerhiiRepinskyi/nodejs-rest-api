import { Schema, model } from "mongoose";

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
contactSchema.pre("findOneAndUpdate", validateAtUpdate);

// post-hooks
// Якщо валідація ПІСЛЯ (post) спроби виконання операціі ("save", "findOneAndUpdate") пройшла з помилкою (error),
// то викликається функція (handleMongooseError), яка присвоїть помилці статус (400)
contactSchema.post("save", handleMongooseError);
contactSchema.post("findOneAndUpdate", handleMongooseError);

// Mongoose-model
const Contact = model("contact", contactSchema);

export default Contact;
