import React, { useRef, useState } from 'react';
import * as mm from '@magenta/music';

export default function MIDIPlayer({ midiUrl }: { midiUrl: string }) {
  const playerRef = useRef<mm.Player | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePlay = async () => {
    setLoading(true);
    if (playerRef.current) {
      playerRef.current.stop();
    }
    const midi = await fetch(midiUrl).then(res => res.arrayBuffer());
    const seq = mm.midiToSequenceProto(new Uint8Array(midi));
    const player = new mm.Player();
    playerRef.current = player;
    player.start(seq).then(() => setIsPlaying(false));
    setIsPlaying(true);
    setLoading(false);
  };

  const handleStop = () => {
    if (playerRef.current) {
      playerRef.current.stop();
      setIsPlaying(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 mt-4">
      <div className="flex gap-2">
        <button
          onClick={handlePlay}
          disabled={isPlaying || loading}
          className="px-4 py-2 rounded bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:opacity-60"
        >
          {loading ? 'Yükleniyor...' : isPlaying ? 'Çalıyor...' : 'MIDI Çal'}
        </button>
        <button
          onClick={handleStop}
          disabled={!isPlaying}
          className="px-4 py-2 rounded bg-gray-500 text-white font-semibold hover:bg-gray-600 disabled:opacity-60"
        >
          Durdur
        </button>
      </div>
      <div className="text-xs text-gray-400 mt-2">(Not: Basit MIDI çalma, görsel piano roll için ek modül eklenebilir)</div>
    </div>
  );
} 