import { MongoClient } from 'mongodb';
import { config } from '../../config.js';

export const client = new MongoClient(config.MONGO_CONNECTION_STRING);
export const db = client.db(config.DB_NAME);

export async function connectMongo() {
  try {
    // Connect the client to the server
    await client.connect();
    // Establish and verify connection
    await client.db('admin').command({ ping: 1 });
    console.log('Connected successfully to server');
  } catch (err) {
    throw err;
  }
}
