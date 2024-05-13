/* const express = require("express");
const Joi = require("joi");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
} = require("../../models/contacts.js");
const router = express.Router();

const schema = Joi.object({
  name: Joi.string().min(3).max(30).required(),

  phone: Joi.number().integer().required(),

  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
});

router.get("/", async (req, res, next) => {
  const users = await listContacts();
  res.status(200).send(users);
});

router.get("/:contactId", async (req, res, next) => {
  const user = await getContactById(req.params.contactId);
  if (user) {
    res.status(200).send(user);
  } else {
    res.status(404);
    res.json({ message: "Not Found" });
  }
});

router.post("/", async (req, res, next) => {
  if (req.body.name && req.body.email && req.body.phone) {
    const { error, value } = schema.validate({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
    });
    if (error) {
      res.status(400).send({ message: error.message });
    } else {
      const contact = await addContact(req.body);
      res
        .status(201)
        .send({ message: "Contacto Creado exitosamente", contact: contact });
    }
  } else {
    res.status(400);
    res.json({ message: "missing required name field" });
  }
});

router.delete("/:contactId", async (req, res, next) => {
  const result = await removeContact(req.params.contactId);

  if (result != null) {
    res.status(200).send({ message: "contacto eliminado" });
  } else {
    res.status(404).send({ message: "Not Found" });
  }
});

router.put("/:contactId", async (req, res, next) => {
  if (req.body.name && req.body.email && req.body.phone) {
    const { error, value } = schema.validate({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
    });
    if (error) {
      res.status(404).send({ message: error.message });
    } else {
      const result = await updateContact(req.params.contactId, req.body);
      if (result != null) {
        res.status(200).send({
          messege: "Update Conctact Completed",
          contact: {
            id: req.params.contactId,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
          },
        });
      } else {
        res.status(404).send({ message: "Id not found" });
      }
    }
  } else {
    res.status(404).send({ message: "missing fields" });
  }
});

router.patch("/:contactId", async (req, res, next) => {
  if (req.body.favorite) {
    const result = await updateStatusContact(
      req.params.contactId,
      req.body.favorite
    );
    if (result != null) {
      res.status(200).send({ messege: "Update Conctact Completed" });
    } else {
      res.status(404).send({ message: "Not found" });
    }
  } else {
    res.status(404).send({ message: "missing field favorite" });
  }
});

module.exports = router;
 */

const express = require("express");
const Joi = require("joi");
const Contact = require("../../models/contact.js");

const router = express.Router();

const contactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  phone: Joi.number().integer().required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
});

router.get("/", async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.contactId);
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const contact = new Contact(req.body);
    await contact.save();
    res.status(201).json(contact);
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const contact = await Contact.findByIdAndUpdate(
      req.params.contactId,
      req.body,
      { new: true }
    );
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.contactId);
    if (contact) {
      res.status(200).json({ message: "Contact deleted successfully" });
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId", async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.contactId,
      { favorite: req.body.favorite },
      { new: true }
    );
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
