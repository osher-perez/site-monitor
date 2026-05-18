import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("נא להוסיף את המשתנה MONGODB_URI לקובץ ה- .env");
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // במצב פיתוח (dev), נשתמש במשתנה גלובלי כדי שהחיבור לא ייפתח מחדש בכל ריענון קוד (HMR)
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // במצב פרודקשן (Production), עדיף לא להשתמש במשתנה גלובלי
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// מייצאים את ההבטחה לחיבור (Promise)
export default clientPromise;