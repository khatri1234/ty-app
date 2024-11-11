const { MongoClient } = require('mongodb');
const fs = require('fs');

// Connection URL
const url = 'mongodb+srv://durgesh:test%401234@cluster0.6wnzb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const client = new MongoClient(url);

// Database Name
const dbName = 'application';

async function insertTestCenters() {
  try {
    await client.connect();
    console.log('Connected successfully to server');
    
    const db = client.db(dbName);
    const collection = db.collection('TestCenter');

    // Read JSON file
    const data = fs.readFileSync('testCenters.json', 'utf8');
    const testCenters = JSON.parse(data); // No need for .testCenters

    // Insert documents
    const result = await collection.insertMany(testCenters);
    console.log(`${result.insertedCount} documents were inserted`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

insertTestCenters();
