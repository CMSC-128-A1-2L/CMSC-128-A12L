import dotenv from "dotenv";
import mongoose, { Connection } from "mongoose";

dotenv.config();

let cachedConnection: Connection | undefined;

export function connectDB(): Connection {
  if (cachedConnection) {
    return cachedConnection;
  }

  const globalWithMongoConnection = global as typeof globalThis & {
    mongoConnection: Connection | undefined;
  };

  // Check if we have a connection cached in the global namespace
  if (globalWithMongoConnection.mongoConnection) {
    return globalWithMongoConnection.mongoConnection;
  }

  const mongoDbUri = process.env.MONGODB_URI;

  if (!mongoDbUri) {
    throw new Error("Missing MongoDB URI in environment variables.");
  }

  // Create new connection
  const connection = mongoose.createConnection(mongoDbUri, {
    dbName: process.env.NODE_ENV === 'development' ? "DEV_ARTMS" : "ARTMS",
    bufferCommands: true,
    maxPoolSize: process.env.NODE_ENV === 'development' ? 10 : undefined
  });

  // Cache the connection in the global namespace for hot-reloading in development
  if (process.env.NODE_ENV === 'development') {
    globalWithMongoConnection.mongoConnection = connection;
  }
  cachedConnection = connection;

  return connection;
}
