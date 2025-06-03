'use client';
import React, { useEffect, useRef } from 'react';
import * as mm from '@magenta/music';

// Piano roll için temel parametreler
const NOTE_HEIGHT = 8;
const PIXELS_PER_TICK = 0.15;
const PADDING = 20;
const COLORS = ["#00c8ff", "#FFD700", "#FF69B4", "#7CFC00"];

export default function SimplePianoRoll({ midiUrl }: { midiUrl: string }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    async function draw() {
      // MIDI dosyasını çek
      const midi = await fetch(midiUrl).then(res => res.arrayBuffer());
      const seq = mm.midiToSequenceProto(new Uint8Array(midi));
      
      // Visualizer oluştur
      new mm.PianoRollSVGVisualizer(seq, svg, {
        noteHeight: 6,
        pixelsPerTimeStep: 24,
        noteSpacing: 1,
        activeNoteRGB: '0, 200, 255',
      });

      // SVG'yi responsive yap
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '120');
      svg.style.maxWidth = '600px';
    }

    draw();
    return () => {
      if (svg) svg.innerHTML = '';
    };
  }, [midiUrl]);

  return (
    <div className="w-full flex flex-col items-center mt-4">
      <svg ref={svgRef} className="overflow-x-auto w-full bg-[#232a34] rounded shadow p-2" style={{ minHeight: 130 }} />
      <div className="text-xs text-gray-400 mt-1">Piyano Roll Görselleştirme</div>
    </div>
  );
} 