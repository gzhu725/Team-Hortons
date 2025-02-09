// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("tremor_data");

// Find a document in a collection.
db.getCollection("users").findOne({

});

// Find all users and return only the email field
db.getCollection('users').find(
    {}, 
    { email: 1, _id: 0 }
  );
  
