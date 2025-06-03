import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  // İstekten ses dosyası linkini al
  const { audioUrl } = await req.json();

  // Burada gerçek model entegrasyonu yapılacak (şimdilik mock)
  // Örnek bir MIDI dosyası linki dönüyoruz
  const midiUrl = 'https://bitmidi.com/uploads/43849.mid';

  return NextResponse.json({ midiUrl });
} 