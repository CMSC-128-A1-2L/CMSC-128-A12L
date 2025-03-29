import dotenv from "dotenv";
import mongoose, { Connection } from "mongoose";

dotenv.config();

let existingConnection: Connection | undefined = undefined;

export function connectDB(): Connection {
    if (existingConnection !== undefined) {
        return existingConnection;
    }

    const mongoDbUri = process.env.MONGODB_URI;

    if (mongoDbUri === undefined) {
        throw new Error("Missing MongoDB in environment variables.");
    }

    existingConnection = mongoose.createConnection(mongoDbUri, {
        dbName: "DEV_ARTMS",
        bufferCommands: true
    });

    return existingConnection;
}
