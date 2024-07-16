const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.post('/update_contacts', async (req, res) => {
  const updatedContacts = req.body;

  try {
    const contactsRef = db.collection('contacts');
    // Clear existing contacts
    const snapshot = await contactsRef.get();
    snapshot.forEach(doc => {
      doc.ref.delete();
    });

    // Add updated contacts
    updatedContacts.forEach(contact => {
      contactsRef.add(contact);
    });

    res.send('Contacts updated successfully');
  } catch (err) {
    console.error("Error with POST - index.js (ERROR)", err);
    res.status(500).send('Error with index.js status 500');
  }
});

app.get('/contacts.json', async (req, res) => {
  try {
    const contactsRef = db.collection('contacts');
    const snapshot = await contactsRef.get();

    const contacts = snapshot.docs.map(doc => doc.data());
    res.setHeader('Cache-Control', 'no-store'); // Prevent caching
    res.json(contacts);
  } catch (err) {
    console.error("Error GET reading contacts:", err);
    res.status(500).send('Error fetching GET contacts');
  }
});

exports.api = functions.https.onRequest(app);