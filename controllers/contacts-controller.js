import { Contact } from "../models/contact.js";

import { ctrlWrapper } from "../decorators/index.js";

import { HttpError } from "../helpers/index.js";

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20 } = req.query; // req.query - об'єкт зі всіма параметрами пошуку (запиту)
  const skip = (page - 1) * limit;

  const pageInt = Number.parseInt(page); // Конвертація значень з стрічки у числа
  const limitInt = Number.parseInt(limit);
  const totalContacts = await Contact.countDocuments({ owner }); // countDocuments - загальна кількість документів в колекції за певним фільтром

  // Якщо задані параметри запиту по favorite: (GET /contacts?favorite=true),
  // то повертаються відфільтровані за полем favorite контакти
  if (req.query.favorite) {
    const favorite = req.query.favorite; // true
    const totalContactsFavorite = await Contact.countDocuments({
      owner,
      favorite,
    });
    const contactsFavorite = await Contact.find(
      { owner, favorite },
      "-createdAt -updatedAt",
      {
        skip,
        limit,
      }
    ).populate("owner", "email subscription");
    return res.json({
      page: pageInt,
      limit: limitInt,
      totalContacts,
      totalContactsFavorite,
      contactsFavorite,
    });
  }

  const result = await Contact.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email subscription");
  // знак "-" означає, що ці поля не брати з БД;
  // для пагінаці (вбудовані інструменти): skip - скільки пропустити, limit - скільки повернути (в об'єкті налаштувань);
  // populate (розширення запиту) - замість id у полі owner поверне детальну інформацію (об'єкт), а саме email та subscription

  res.json({
    page: pageInt,
    limit: limitInt,
    totalContacts,
    contacts: result,
  });
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findById(contactId);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const add = async (req, res) => {
  const { _id: owner } = req.user; // деструктуризація з перейменуванням
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const deleteById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndDelete(contactId);
  if (!result) {
    throw HttpError(404, "Not found"); // throw - генерування помилки
  }
  res.json({ message: "contact deleted" }); // 1 варіант
  // res.status(204).send(); // 2 варіант - при 204 - No Content, тіло не відправляється
  // res.json(result); // 3 варіант
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true, // поверне нову версію дукументу
  });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.json(result);
};

export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  deleteById: ctrlWrapper(deleteById),
  updateById: ctrlWrapper(updateById),
  updateStatusContact: ctrlWrapper(updateStatusContact),
};
