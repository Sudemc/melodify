import React, { useEffect, useRef } from 'react';
import * as mm from '@magenta/music';

export default function MIDIPianoRoll({ midiUrl }: { midiUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    async function draw() {
      // Eski SVG'yi temizle
      container.innerHTML = '';
      // MIDI dosyasını çek
      const midi = await fetch(midiUrl).then(res => res.arrayBuffer());
      const seq = mm.midiToSequenceProto(new Uint8Array(midi));
      // Visualizer oluştur
      new mm.PianoRollSVGVisualizer(seq, container, {
        noteHeight: 6,
        pixelsPerTimeStep: 24,
        noteSpacing: 1,
        activeNoteRGB: '0, 200, 255',
      });
      // SVG'yi responsive yap
      const svg = container.querySelector('svg');
      if (svg) {
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '120');
        svg.style.maxWidth = '600px';
      }
    }

    draw();
    return () => {
      if (container) container.innerHTML = '';
    };
  }, [midiUrl]);

  return (
    <div className="w-full flex flex-col items-center mt-4">
      <div ref={containerRef} className="overflow-x-auto w-full bg-[#232a34] rounded shadow p-2" style={{ minHeight: 130 }} />
      <div className="text-xs text-gray-400 mt-1">Piyano Roll Görselleştirme</div>
    </div>
  );
} 