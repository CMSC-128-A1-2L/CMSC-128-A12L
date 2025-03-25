import mongoose, { Mongoose } from "mongoose";

import  dotenv  from "dotenv";
import { error } from "console";

dotenv.config();


const MONGODB_URI = process.env.MONGODB_URI ?? (() => {
  throw new Error("Invalid MONGODB URI in .env file");
})();


// Instantiates a global cache so that we can reuse the connection for each function call we do to the database
let cached = (global as any).mongoose || { conn: null, promise: null };

export async function connectDB(){
  // console.log("Accessing database.");
  if (cached.conn) return cached.conn; // Return cached connection

  if (!cached.promise) {
    cached.promise = await mongoose.connect(MONGODB_URI as string, {
      dbName: "DEV_ARTMS",
      bufferCommands: true,
    }).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
