const { MongoClient } = require("mongodb");
 
// my Atlas connection string                                                                                                                                        
const url = "mongodb+srv://jw8392:Dish2Bird!@hacknyu.nrsb4.mongodb.net/?retryWrites=true&w=majority&appName=hacknyu";

// my Atlas cluster
const client = new MongoClient(url);

async function run() {
    try {
        await client.connect();
        console.log("Successfully connected to Atlas");

    } catch (err) {
        console.log(err.stack);
    }
    finally {
        await client.close();
    }
}

run().catch(console.dir);
