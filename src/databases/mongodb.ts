import dotenv from "dotenv";
import mongoose, { Connection } from "mongoose";

dotenv.config();

declare global {
  var mongoConnection: Connection | undefined;
}

let cachedConnection: Connection | undefined;

export function connectDB(): Connection {
  if (cachedConnection) {
    return cachedConnection;
  }

  // Check if we have a connection cached in the global namespace
  if (global.mongoConnection) {
    return global.mongoConnection;
  }

  const mongoDbUri = process.env.MONGODB_URI;

  if (!mongoDbUri) {
    throw new Error("Missing MongoDB URI in environment variables.");
  }

  // Create new connection
  const connection = mongoose.createConnection(mongoDbUri, {
    dbName: "DEV_ARTMS",
    bufferCommands: true,
    maxPoolSize: 10
  });


  // Cache the connection
  if (process.env.NODE_ENV === 'development') {
    global.mongoConnection = connection;
  }
  cachedConnection = connection;

  // Handle connection events
  connection.on('connected', () => {
    console.log('MongoDB connected successfully');
  });

  connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
  });

  return connection;
}
