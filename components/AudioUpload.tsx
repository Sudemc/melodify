'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import SimplePianoRoll from './SimplePianoRoll';

export default function AudioUpload({ onUpload }: { onUpload: (fileUrl: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  const [midiUrl, setMidiUrl] = useState<string | null>(null);
  const [transcribeError, setTranscribeError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMidiUrl(null);
    setTranscribeError(null);

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const { data, error } = await supabase.storage
      .from('audio-files')
      .upload(fileName, file);

    setUploading(false);

    if (error) {
      alert('Yükleme hatası: ' + error.message);
    } else {
      const url = supabase.storage.from('audio-files').getPublicUrl(fileName).data.publicUrl;
      setFileUrl(url);
      onUpload(url);
    }
  };

  const handleTranscribe = async () => {
    if (!fileUrl) return;
    setTranscribing(true);
    setTranscribeError(null);
    setMidiUrl(null);
    try {
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ audioUrl: fileUrl }),
      });
      const data = await res.json();
      if (data.midiUrl) {
        setMidiUrl(data.midiUrl);
        const user = await supabase.auth.getUser();
        if (user.data.user) {
          const { error: insertError } = await supabase.from('transcriptions').insert([
            {
              user_id: user.data.user.id,
              audio_url: fileUrl,
              midi_url: data.midiUrl,
              created_at: new Date().toISOString(),
            },
          ]);
          if (insertError) {
            alert('Kayıt eklenemedi: ' + insertError.message);
          }
        }
      } else {
        setTranscribeError('Transkripsiyon başarısız.');
      }
    } catch (err) {
      setTranscribeError('Transkripsiyon sırasında hata oluştu.');
    }
    setTranscribing(false);
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <input type="file" accept=".mp3,.wav" onChange={handleFileChange} disabled={uploading} />
      {uploading && <span>Yükleniyor...</span>}
      {fileUrl && (
        <>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-green-400 underline break-all text-sm"
          >
            Yüklenen dosyayı görüntüle
          </a>
          <button
            onClick={handleTranscribe}
            disabled={transcribing}
            className="mt-3 px-4 py-2 rounded bg-[#FFD700] text-black font-semibold hover:bg-[#e6c200] transition-all disabled:opacity-60"
          >
            {transcribing ? 'Transkribe Ediliyor...' : 'Transkribe Et'}
          </button>
        </>
      )}
      {midiUrl && (
        <>
          <a
            href={midiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 text-blue-400 underline break-all text-sm"
          >
            MIDI dosyasını indir / görüntüle
          </a>
          <SimplePianoRoll midiUrl={midiUrl} />
        </>
      )}
      {transcribeError && <div className="text-red-400 text-sm mt-2">{transcribeError}</div>}
    </div>
  );
} 