const Contact = require("../../models/contacts.js");

const listContacts = async () => {
  try {
    const result = await Contact.find();
    return result;
  } catch (error) {
    console.error("Error listing contacts:", error);
    throw error;
  }
};

const getContactById = async (contactId) => {
  try {
    const result = await Contact.findOne({ _id: contactId });
    return result;
  } catch (error) {
    console.error("Error getting contact by ID:", error);
    throw error;
  }
};

const removeContact = async (contactId) => {
  try {
    const result = await Contact.findByIdAndDelete(contactId);
    return result;
  } catch (error) {
    console.error("Error removing contact:", error);
    throw error;
  }
};

const addContact = async (body) => {
  try {
    const result = await Contact.create(body);
    return result;
  } catch (error) {
    console.error("Error adding contact:", error);
    throw error;
  }
};

const updateContact = async (contactId, body) => {
  try {
    const result = await Contact.findByIdAndUpdate(contactId, body, {
      new: true,
    });
    return result;
  } catch (error) {
    console.error("Error updating contact:", error);
    throw error;
  }
};

const updateStatusContact = async (contactId, favorite) => {
  try {
    const result = await Contact.findByIdAndUpdate(
      contactId,
      { favorite },
      { new: true }
    );
    return result;
  } catch (error) {
    console.error("Error updating contact status:", error);
    throw error;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};
