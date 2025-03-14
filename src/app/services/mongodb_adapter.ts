import { MongoClient, ServerApiVersion } from "mongodb";

// source: https://authjs.dev/getting-started/adapters/mongodb?framework=next-js

const uri = process.env.MONGODB_URI ?? (() => {
	throw new Error("Invalid MongoDB URI in .env file");
})();

/* define server options: */
const options = {
	serverApi: {
		version: ServerApiVersion.v1,
		strict: true,
		deprecationErrors: true,
	}
}

let client: MongoClient;

/* if we only run in local machine (development) */

if (process.env.NODE_ENV === "development") {
	let globalWithMongo = global as typeof globalThis & {
		_mongoClient?: MongoClient
	}

	if (!globalWithMongo._mongoClient) {
		globalWithMongo._mongoClient = new MongoClient(uri, options);
	}
	client = globalWithMongo._mongoClient;
} else { // handle if pushed to production (deployment)
	client = new MongoClient(uri, options);
}

export default client;
