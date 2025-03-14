const Contact = require("../models/contact");

const submit= async (req, res) => {

        try {
          const { userId, name, email, message } = req.body;
          const newContact = new Contact({ userId, name, email, message });
          await newContact.save();
          res.status(201).json({ message: "Contact form submitted successfully!" });
        } catch (error) {
          res.status(500).json({ message: "Error submitting contact form", error });
        }
      };

const all = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 }); 
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching contact data", error });
  }
};

module.exports = {
    submit,
    all
    
}