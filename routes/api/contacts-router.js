const express = require("express");

const contactsController = require("../../controllers/contacts-controller");

const contactsSchema = require("../../schemes/contacts-schema");

const { validateBody } = require("../../decorators");

const { isEmptyBody } = require("../../middlewares");

const contactsRouter = express.Router();

contactsRouter.get("/", contactsController.getAll);

contactsRouter.get("/:contactId", contactsController.getById);

contactsRouter.post(
  "/",
  isEmptyBody,
  validateBody(contactsSchema.contactsAddSchema),
  contactsController.add
);

contactsRouter.delete("/:contactId", contactsController.deleteById);

contactsRouter.put(
  "/:contactId",
  isEmptyBody,
  validateBody(contactsSchema.contactsAddSchema),
  contactsController.updateById
);

module.exports = contactsRouter;
