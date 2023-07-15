import express from "express";
import logger from "morgan";
import cors from "cors";

import contactsRouter from "./routes/api/contacts-router.js";

const app = express();

// Виводить в консоль детальну інформацію про запити
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json()); // Парсить тіло запиту (req.body) формату json в об'єкт

app.use("/api/contacts", contactsRouter);

// Обробка запиту на адресу, що не існує
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Обробник помилок Express з 4-ма параметрами
app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

export default app;
