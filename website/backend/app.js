const app = require('express')();
const http = require('http').Server(app);

const fs = require('fs');
require('dotenv').config();
const { MongoClient } = require('mongodb');


const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://jw8392:<db_password>@hacknyu.nrsb4.mongodb.net/?retryWrites=true&w=majority&appName=hacknyu")

const User = require('./user/userModel');

async function insert() {       // LMAO THIS DOESN'T WORK
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);

    try {
        // Connect to MongoDB Atlas
        await client.connect();
        console.log('Connected to MongoDB Atlas.');

        // Read data from the JSON file
        const data = JSON.parse(fs.readFileSync('updated_fake_user_profiles.json', 'utf-8'));

        // Select database and collection
        const database = client.db('medical-tracker');
        const collection = database.collection('users');

        // Insert data
        const result = await collection.insertMany(data);
        console.log(`${result.insertedCount} users inserted successfully!`);
    } catch (error) {
        console.error('Error inserting users:', error);
    } finally {
        await client.close();
        console.log('Connection closed.');
    }
}
insert();

http.listen(3000, function(){
    console.log('Server is running')
});
