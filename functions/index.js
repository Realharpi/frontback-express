const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

// Set the correct path for contacts.json in the public directory
const contactsFilePath = path.join(__dirname, '..', 'public', 'contacts.json');

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.post('/update_contacts', (req, res) => {
  const updatedContacts = req.body;

  fs.writeFile(contactsFilePath, JSON.stringify(updatedContacts, null, 2), (err) => {
    if (err) {
      console.error("Error updating contacts:", err);
      return res.status(500).send('Error updating contacts');
    }
    res.send('Contacts updated successfully');
  });
});

app.get('/contacts.json', (req, res) => {
  fs.readFile(contactsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error("Error reading contacts file:", err);
      return res.status(500).send('Error fetching contacts');
    }
    res.setHeader('Cache-Control', 'no-store'); // Add this line to prevent caching
    res.json(JSON.parse(data));
  });
});

exports.api = functions.https.onRequest(app);
