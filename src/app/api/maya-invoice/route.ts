import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://pg-sandbox.paymaya.com/invoice/v2/invoices', {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from('sk-KfmfLJXFdV5t1inYN8lIOwSrueC1G27SCAklBqYCdrU').toString('base64')
      }
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
} 
