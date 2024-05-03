const updateContact = require("./update");
const express = require("express");
const router = express.Router();
const validateObjectProperties = require("./update");
const path = require("path");
const contactsPath = path.resolve("models/contacts.json");

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const contact = await getById(req.params.id);
    if (!contact) {
      res.status(404).json({ message: "Not found" });
    } else {
      res.status(200).json(contact);
    }
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      res.status(400).json({ message: "missing required name field" });
    } else {
      const newContact = await addContact(req.body);
      res.status(201).json(newContact);
    }
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const result = await removeContact(req.params.id);
    if (!result) {
      res.status(404).json({ message: "Not found" });
    } else {
      res.status(200).json({ message: "contact deleted" });
    }
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const validProperties = ["name", "email", "phone"];
    validateObjectProperties(contactsPath, validProperties);
    // Si llegamos aquí, el objeto tiene las propiedades correctas
    console.log("Object is valid");
    if (Object.keys(contactsPath).length > 0) {
      res.status(400).json({ message: "invalid fields" });
    } else {
      const updatedContact = await updateContact(req.params.id, req.body);
      if (!updatedContact) {
        res.status(404).json({ message: "Not found" });
      } else {
        res.status(200).json(updatedContact);
      }
    }
  } catch (err) {
    next(err);
  }
});

module.exports = router;
