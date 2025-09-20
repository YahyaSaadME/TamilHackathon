import { NextRequest, NextResponse } from 'next/server';
import { translate } from '@vitalets/google-translate-api';

export async function POST(request: NextRequest) {
  try {
    const { text, from, to } = await request.json();
    if (!text || !to) {
      return NextResponse.json({ error: 'Missing text or target language' }, { status: 400 });
    }
    const result = await translate(text, { from: from || 'en', to });
    return NextResponse.json({ translated: result.text });
  } catch  {
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 });
  }
}
