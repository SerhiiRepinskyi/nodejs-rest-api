const express = require("express");
const Joi = require("joi");

const contacts = require("../../models/contacts");

const { HttpError } = require("../../helpers");

const router = express.Router();

// Joi-schema - опис вимог до об'єкту
const addSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Missing required name field",
    "string.empty": "Name cannot be empty",
  }),
  email: Joi.string().required().messages({
    "any.required": "Missing required email field",
    "string.empty": "Email cannot be empty",
  }),
  phone: Joi.string().required().messages({
    "any.required": "Missing required phone field",
    "string.empty": "Phone cannot be empty",
  }), // Додати регулярний вираз
});

router.get("/", async (req, res, next) => {
  try {
    const result = await contacts.listContacts();
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.getContactById(contactId);
    if (!result) {
      throw HttpError(404, "Not found"); // throw - генерування помилки, перехід одразу на catch
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body); // Метод validate перевіряє, чи об'єкт відповідає Joi-schema
    if (error) {
      throw HttpError(400, error.message);
    }
    const result = await contacts.addContact(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.removeContact(contactId);
    if (!result) {
      throw HttpError(404, "Not found"); // throw - генерування помилки, перехід одразу на catch
    }
    res.json({ message: "Сontact deleted" }); // 1 варіант
    // res.status(204).send(); // 2 варіант - при 204 - No Content, тіло не відправляється
    // res.json(result); // 3 варіант
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    if (!req.body) {
      throw HttpError(400, "Missing fields");
    }
    const { error } = addSchema.validate(req.body); // Метод validate перевіряє, чи об'єкт відповідає Joi-schema
    if (error) {
      throw HttpError(400, error.message);
    }
    const { contactId } = req.params;
    const result = await contacts.updateContact(contactId, req.body);
    if (!result) {
      throw HttpError(404, "Not found"); // throw - генерування помилки, перехід одразу на catch
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
