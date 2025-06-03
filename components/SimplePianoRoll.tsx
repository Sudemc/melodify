'use client';
import React, { useEffect, useRef } from 'react';
import { Midi } from '@tonejs/midi';

// Piano roll için temel parametreler
const NOTE_HEIGHT = 8;
const PIXELS_PER_TICK = 0.15;
const PADDING = 20;
const COLORS = ["#00c8ff", "#FFD700", "#FF69B4", "#7CFC00"];

export default function SimplePianoRoll({ midiUrl }: { midiUrl: string }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    async function draw() {
      if (!svgRef.current) return;
      svgRef.current.innerHTML = '';
      const midiData = await fetch(midiUrl).then(res => res.arrayBuffer());
      const midi = new Midi(midiData);
      // Yükseklik ve genişlik hesapla
      const maxTicks = Math.max(...midi.tracks.flatMap(track => track.notes.map(n => n.ticks + n.durationTicks)));
      const maxNote = Math.max(...midi.tracks.flatMap(track => track.notes.map(n => n.midi)));
      const minNote = Math.min(...midi.tracks.flatMap(track => track.notes.map(n => n.midi)));
      const width = maxTicks * PIXELS_PER_TICK + PADDING * 2;
      const height = (maxNote - minNote + 1) * NOTE_HEIGHT + PADDING * 2;
      // SVG boyutunu ayarla
      svgRef.current.setAttribute('width', width.toString());
      svgRef.current.setAttribute('height', height.toString());
      // Her notayı çiz
      midi.tracks.forEach((track, tIdx) => {
        track.notes.forEach(note => {
          const x = note.ticks * PIXELS_PER_TICK + PADDING;
          const y = (maxNote - note.midi) * NOTE_HEIGHT + PADDING;
          const w = note.durationTicks * PIXELS_PER_TICK;
          const h = NOTE_HEIGHT - 1;
          const color = COLORS[tIdx % COLORS.length];
          const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          rect.setAttribute('x', x.toString());
          rect.setAttribute('y', y.toString());
          rect.setAttribute('width', w.toString());
          rect.setAttribute('height', h.toString());
          rect.setAttribute('fill', color);
          rect.setAttribute('rx', '2');
          svgRef.current!.appendChild(rect);
        });
      });
    }
    draw();
    return () => {
      if (svgRef.current) svgRef.current.innerHTML = '';
    };
  }, [midiUrl]);

  return (
    <div className="w-full flex flex-col items-center mt-4">
      <svg ref={svgRef} className="overflow-x-auto w-full bg-[#232a34] rounded shadow" style={{ minHeight: 130, maxWidth: 600 }} />
      <div className="text-xs text-gray-400 mt-1">Basit Piano Roll Görselleştirme</div>
    </div>
  );
} 