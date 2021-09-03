import { MongoClient } from 'mongodb';
import { config } from '../../config.js';

const client = new MongoClient(config.MONGO_CONNECTION_STRING);

export default client;

export async function connectMongo() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    await client.db('admin').command({ ping: 1 });
    console.log('Connected successfully to server');
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
