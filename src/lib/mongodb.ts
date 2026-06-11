import { MongoClient, MongoClientOptions } from "mongodb";

if (!process.env.MONGO_URI) {
  throw new Error("❌ שגיאה: נא להוסיף את המשתנה MONGO_URI לקובץ ה- .env");
}

const uri = process.env.MONGO_URI;

const options: MongoClientOptions = {
  maxPoolSize: 10,
  minPoolSize: 2,
  maxIdleTimeMS: 30000,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// 🛡️ הרחבה קלאסית ונכונה של המאגר הגלובלי המונעת שגיאות קומפילציה ב-TypeScript
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  // במצב פיתוח, נשמור על ה-Promise על גבי המשתנה הגלובלי החופשי
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch((err) => {
      console.error("❌ MongoDB Connection Error in Development:", err);
      throw err;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // במצב פרודקשן, מייצרים מאגר חיבורים ישיר ומבודד
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch((err) => {
    console.error("❌ MongoDB Connection Error in Production:", err);
    throw err;
  });
}

export default clientPromise;