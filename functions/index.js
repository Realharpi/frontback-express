const functions = require('firebase-functions');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin');
const { Storage } = require('@google-cloud/storage');


admin.initializeApp();
const db = admin.firestore();
const storage = new Storage();
const bucket = storage.bucket('frontback-express.appspot.com'); // Replace with your bucket name


const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to the API');
});

app.post('/update_contacts', async (req, res) => {
  const updatedContacts = req.body;
  const contactsFile = bucket.file('contacts.json');

  try {
    await contactsFile.save(JSON.stringify(updatedContacts, null, 2), {
      contentType: 'application/json',
      public: true,
    });

    res.send('Contacts updated successfully');
  } catch (err) {
    console.error("Error with POST - index.js (ERROR)", err);
    res.status(500).send('Error with index.js status 500');
  }
});

app.get('/get_contacts', async (req, res) => {
  const contactsFile = bucket.file('contacts.json');

  try {
    const [fileExists] = await contactsFile.exists();
    if (!fileExists) {
      return res.status(404).send('Contacts file not found');
    }

    const [fileContent] = await contactsFile.download();
    res.setHeader('Cache-Control', 'no-store'); // Prevent caching
    res.send(fileContent.toString());
  } catch (err) {
    console.error("Error GET reading contacts:", err);
    res.status(500).send('Error fetching GET contacts');
  }
});

exports.api = functions.https.onRequest(app);