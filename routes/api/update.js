const fs = require("fs").promises;
const path = require("path");

const validProperties = ["name", "email", "phone"];
const contactsPath = path.resolve("models/contacts.json");

async function updateContact(contactId, body) {
  try {
    const contactsData = await fs.readFile(contactsPath);
    const contacts = JSON.parse(contactsData);
    const id = contacts.findIndex((contact) => contact.id === contactId);

    if (id === -1) {
      return null;
    }

    const updatedContact = { ...contacts[id], ...body };
    contacts[id] = updatedContact;

    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return updatedContact;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

function validateObjectProperties(obj, validProperties) {
  const objProperties = Object.keys(obj);

  if (objProperties.length !== validProperties.length) {
    throw new Error("Object does not have the correct number of properties");
  }

  for (let i = 0; i < objProperties.length; i++) {
    if (!validProperties.includes(objProperties[i])) {
      throw new Error("Invalid property ");
    }
  }
}

module.exports = (updateContact, validateObjectProperties);
