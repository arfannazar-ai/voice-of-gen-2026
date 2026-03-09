import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { passphrase } = await req.json();
  const expected = process.env.ACCESS_PASSPHRASE;

  if (!expected) {
    return new Response(JSON.stringify({ error: 'ACCESS_PASSPHRASE not configured' }), { status: 500 });
  }

  if (passphrase === expected) {
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  }

  return new Response(JSON.stringify({ error: 'Invalid passphrase' }), { status: 401 });
}
