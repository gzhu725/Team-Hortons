const { MongoClient } = require('mongodb');

// Connection string
const uri = "mongodb+srv://jw8392:beans@hacknyu.nrsb4.mongodb.net/parkinsons?retryWrites=true&w=majority";

const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    const database = client.db("parkinsons");
    const collection = database.collection("tremor_data");

    // Fetch a sample document
    const sampleData = await collection.findOne();
    console.log("Sample document:", sampleData);
  } catch (error) {
    console.error("Connection failed:", error.message);
  } finally {
    await client.close();
  }
}

run();
