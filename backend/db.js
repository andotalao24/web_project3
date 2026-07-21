// One shared MongoDB connection for the whole app (native driver).
// ADD MORE COMMENTS for each function
import { MongoClient } from 'mongodb';

const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017';
const dbName = process.env.DB_NAME || 'pantrypal';

const client = new MongoClient(uri);
let db = null;

export async function connect() {
  if (!db) {
    await client.connect();
    db = client.db(dbName);
    console.log(`Connected to MongoDB database "${dbName}"`);
  }
  return db;
}

export function getDb() {
  if (!db) throw new Error('Call connect() first');
  return db;
}

export { client };
