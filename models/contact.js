import { Schema, model } from "mongoose";

import { handleMongooseError } from "./hooks.js";

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

  // Поле з версією - не додавати
  // Поле з датою створення та оновлення - додавати
  { versionKey: false, timestamps: true }
);

// Якщо валідація після (post) спроби збереження ("save") в БД (метод create) пройшла з помилкою (error),
// то спрацює функція (handleMongooseError), яка присвоїть помилці статус (400)
contactSchema.post("save", handleMongooseError);

// Mongoose-model
const Contact = model("contact", contactSchema);

export default Contact;
