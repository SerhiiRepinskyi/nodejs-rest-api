const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const contactsRouter = require("./routes/api/contacts");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json()); // Парсить тіло запиту (req.body) формату json в об'єкт

app.use("/api/contacts", contactsRouter);

// Обробка запиту на адресу, що не існує
app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// Обробник помилок
app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
