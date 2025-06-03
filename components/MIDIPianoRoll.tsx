import React, { useEffect, useRef } from 'react';
import * as mm from '@magenta/music';

export default function MIDIPianoRoll({ midiUrl }: { midiUrl: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let visualizer: mm.PianoRollSVGVisualizer | null = null;
    let svg: SVGSVGElement | null = null;
    async function draw() {
      if (!containerRef.current) return;
      // Eski SVG'yi temizle
      containerRef.current.innerHTML = '';
      // MIDI dosyasını çek
      const midi = await fetch(midiUrl).then(res => res.arrayBuffer());
      const seq = mm.midiToSequenceProto(new Uint8Array(midi));
      // Visualizer oluştur
      visualizer = new mm.PianoRollSVGVisualizer(seq, containerRef.current, {
        noteHeight: 6,
        pixelsPerTimeStep: 24,
        noteSpacing: 1,
        activeNoteRGB: '0, 200, 255',
      });
      // SVG'yi responsive yap
      svg = containerRef.current.querySelector('svg');
      if (svg) {
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '120');
        svg.style.maxWidth = '600px';
      }
    }
    draw();
    return () => {
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [midiUrl]);

  return (
    <div className="w-full flex flex-col items-center mt-4">
      <div ref={containerRef} className="overflow-x-auto w-full bg-[#232a34] rounded shadow p-2" style={{ minHeight: 130 }} />
      <div className="text-xs text-gray-400 mt-1">Piyano Roll Görselleştirme</div>
    </div>
  );
} 