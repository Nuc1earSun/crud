
const { MongoClient, ServerApiVersion } = require('mongodb');

if (!process.env.CONNECTION_STRING) { 
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.CONNECTION_STRING;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const getDatabase = async () => {
  if (!client.isConnected) await client.connect();
  return client.db("crud");
}

export const getCollection = async (collectionName) => { 
  const db = await getDatabase();
  return db.collection(collectionName);
}
