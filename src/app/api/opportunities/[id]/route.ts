import { type NextRequest } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

async function GetOpportunityById(id: string) { // connect to db and find opportunity using a specific id
  await client.connect();
  const db = client.db("DEV_ARTMS"); // db name
  const collection = db.collection("opportunities"); //collection name

  try {
    const opportunity = await collection.findOne({ _id: new ObjectId(id) });
    return opportunity;
  } finally {
    await client.close();
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {   // get function to return the specific opportunity
  try {
    const { id } = params;

    if (!ObjectId.isValid(id)) {
      return new Response(JSON.stringify({ error: "Invalid ID format" }), { status: 400 });
    }

    const opportunity = await GetOpportunityById(id);

    if (!opportunity) {
      return new Response(JSON.stringify({ error: " Opportunity not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(opportunity), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
