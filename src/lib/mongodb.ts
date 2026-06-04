import { MongoClient } from "mongodb";

if (!process.env.MONGO_URI) {
  throw new Error("❌ שגיאה: נא להוסיף את המשתנה MONGO_URI לקובץ ה- .env");
}

const uri = process.env.MONGO_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// הרחבת הטיפוס הגלובלי של Node.js בצורה תקנית עבור TypeScript
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  // במצב פיתוח (dev), נשתמש במשתנה גלובלי כדי שהחיבור לא ייפתח מחדש בכל ריענון קוד (Fast Refresh / HMR)
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // במצב פרודקשן (Production), יוצרים חיבור ישיר ללא משתנה גלובלי
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// מייצאים את הבטחת החיבור (Promise)
export default clientPromise;
