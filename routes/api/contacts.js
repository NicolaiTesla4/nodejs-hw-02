//  ---------------------------CONSTANTS---------------------------

const express = require("express");
const router = express.Router();
const fs = require("fs/promises");
const path = require("path");
const Joi = require("joi");
const contactsPath = path.resolve("./models/contacts.json");
const schema = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().min(1).required(),
});

// listContacts

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

// --------------------------METHODS---------------------------------

//  Update

const updateContact = async (id, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index !== -1) {
    contacts[index] = { ...contacts[index], ...body };
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return contacts[index];
  }
  return null;
};

//  getById

const getById = async (id) => {
  const contacts = await listContacts();
  return contacts.find((contact) => contact.id === id);
};

// addContact

const addContact = async (body) => {
  const contacts = await listContacts();
  const newContact = { id: contacts.length + 1, ...body };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return newContact;
};

// removeContact

const removeContact = async (id) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === id);
  if (index !== -1) {
    contacts.splice(index, 1);
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
    return true;
  }
  return false;
};

// -----------------------ROUTER (endpoints)----------------

// @ GET /api/contacts  not Id

router.get("/", async (req, res) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
});

// @ GET /api/contacts/:Id

router.get("/:contactId", async (req, res) => {
  const contact = await getById(req.params.contactId);
  if (contact) {
    res.status(200).json(contact);
  } else {
    res.status(404).json({ message: "No encontrado" });
  }
});

// @ POST /api/contacts not Id

router.post("/", async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res
      .status(400)
      .json({ message: "falta el campo de nombre requerido" });
  }
  const newContact = await addContact({ name, email, phone });
  res.status(201).json(newContact);
});

// @ DELETE /api/contacts/:Id

router.delete("/:contactId", async (req, res) => {
  const result = await removeContact(req.params.contactId);
  if (result) {
    res.status(200).json({ message: "contacto eliminado" });
  } else {
    res.status(404).json({ message: "No encontrado" });
  }
});

//  @ PUT /api/contacts/:Id

router.put("/:contactId", async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { name, email, phone } = req.body;
  const updatedContact = await updateContact(req.params.contactId, {
    name,
    email,
    phone,
  });
  if (updatedContact) {
    res.status(200).json(updatedContact);
  } else {
    res.status(404).json({ message: "No encontrado" });
  }
});

module.exports = router;
