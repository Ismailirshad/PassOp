require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT;
app.set('json spaces', 2);

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
const dbName = 'passop';
const collectionName = 'passwords';

let db, collection;

async function startServer() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB");

    db = client.db(dbName);
    collection = db.collection(collectionName);

    // Routes defined AFTER connection is successful

    app.get('/', async (req, res) => {
      try {
        const passwords = await collection.find({}).toArray();
        res.json(passwords);
      } catch (err) {
        console.error('Error in GET /passwords:', err);
        res.status(500).json({ success: false, error: err.message });
      }
    });

    app.post('/', async (req, res) => {
      try {
        const result = await collection.insertOne(req.body);
        res.json({ success: true, result });
      } catch (err) {
        console.error('Error in POST /passwords:', err);
        res.status(500).json({ success: false, error: err.message });
      }
    });

    app.delete('/', async (req, res) => {
      try {
        const { _id } = req.body;
        const result = await collection.deleteOne({ _id: new ObjectId(_id) });
        res.json({ success: result.deletedCount > 0 });
      } catch (err) {
        console.error('Error in DELETE /passwords:', err);
        res.status(500).json({ success: false, error: err.message });
      }
    });

    app.put('/', async (req, res) => {
      try {
        const { _id, site, username, password } = req.body;
        const result = await collection.updateOne(
          { _id: new ObjectId(_id) },
          { $set: { site, username, password } }
        );
        res.json({ success: result.modifiedCount > 0 });
      } catch (err) {
        console.error('Error in PUT /passwords:', err);
        res.status(500).json({ success: false, error: err.message });
      }
    });

    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });

  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1); // Exit if DB connection fails
  }
}

startServer();
