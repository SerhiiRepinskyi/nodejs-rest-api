const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.join(__dirname, "contacts.json");

// Повертає масив контактів
const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

// Повертає об'єкт контакту з таким id
// Повертає null, якщо контакт з таким id не знайдений
const getContactById = async (contactId) => {
  const allContacts = await listContacts();
  const result = allContacts.find((item) => item.id === contactId);
  return result || null;
};

// Повертає об'єкт видаленого контакту
// Повертає null, якщо контакт з таким id не знайдений
const removeContact = async (contactId) => {
  const allContacts = await listContacts();
  const index = allContacts.findIndex((item) => item.id === contactId);
  if (index === -1) {
    return null;
  }
  const [result] = allContacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
  return result;
};

// Повертає об'єкт доданого контакту
const addContact = async (body) => {
  const allContacts = await listContacts();
  const newContact = {
    id: nanoid(),
    ...body,
  };
  allContacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
  return newContact;
};

// Повертає об'єкт оновленого контакту
// Повертає null, якщо контакт з таким id не знайдений
const updateContact = async (contactId, body) => {
  const allContacts = await listContacts();
  const index = allContacts.findIndex((item) => item.id === contactId);
  if (index === -1) {
    return null;
  }
  allContacts[index] = { id: contactId, ...body };
  await fs.writeFile(contactsPath, JSON.stringify(allContacts, null, 2));
  return allContacts[index];
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
