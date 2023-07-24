import mongoose from "mongoose";
import dotenv from "dotenv";

import app from "./app.js";

dotenv.config();
// метод config() - додає дані з текстового файлу (.env) в глобальний об'єкт (process.env)
// console.log(process.env); // process.env - зберігає змінні оточення

const { DB_HOST, PORT } = process.env;

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(PORT, () => {
      console.log("Database connection successful");
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1); // Закриває всі процеси (1 - невизначена помилка)
  });
