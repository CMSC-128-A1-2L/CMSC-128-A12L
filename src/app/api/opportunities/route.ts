import { type NextRequest } from "next/server";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);

async function GetAllOpportunities(query?: string) {
  await client.connect();
  const db = client.db("DEV_ARTMS");
  const collection = db.collection("opportunities");

  let opportunities;

  if (query) {
    opportunities = await collection
      .find({ title: { $regex: query, $options: "i" } })
      .toArray();
  } else {
    opportunities = await collection.find({}).toArray();
  }

  await client.close();
  return opportunities;
}


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("query") || undefined;

    const opportunities = await GetAllOpportunities(query);

    return new Response(JSON.stringify(opportunities), {
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
