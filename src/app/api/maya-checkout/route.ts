import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch('https://pg-sandbox.paymaya.com/checkout/v1/checkouts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${process.env.MAYA_PRIMARYKEY}`).toString('base64')
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 });
  }
} 