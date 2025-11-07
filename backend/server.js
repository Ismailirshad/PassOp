import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import { MongoClient, ObjectId } from "mongodb";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const port = process.env.PORT;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("json spaces", 2);

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "dist")));

const uri = process.env.MONGO_URI;
const dbName = "passop";
const collectionName = "passwords";

let collection;

async function startServer() {
  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db(dbName);
    collection = db.collection(collectionName);

    // API ROUTES
    app.get("/passwords", async (req, res) => {
      try {
        const passwords = await collection.find({}).toArray();
        res.json(passwords);
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    });

    app.post("/passwords", async (req, res) => {
      try {
        const result = await collection.insertOne(req.body);
        res.json({ success: true, result });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    });

    app.delete("/passwords", async (req, res) => {
      try {
        const result = await collection.deleteOne({
          _id: new ObjectId(req.body._id),
        });
        res.json({ success: result.deletedCount > 0 });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    });

    app.put("/passwords", async (req, res) => {
      try {
        const { _id, site, username, password } = req.body;

        const result = await collection.updateOne(
          { _id: new ObjectId(_id) },
          { $set: { site, username, password } }
        );

        res.json({ success: result.modifiedCount > 0 });
      } catch (err) {
        res.status(500).json({ success: false, error: err.message });
      }
    });

   app.get("(.*)", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});


    app.listen(port, () => {
      console.log(` Server is running on port ${port}`);
    });
  } catch (err) {
    console.error(" Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

startServer();
