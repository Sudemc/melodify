'use client';
import React, { useEffect, useState } from 'react';
import AuthButton from '@/components/AuthButton';
import Image from "next/image";
import AudioUpload from '@/components/AudioUpload';
import AuthForm from '@/components/AuthForm';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="text-white text-center mt-20">Yükleniyor...</div>;
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#181c24] via-[#232a34] to-[#0e1013]">
        <AuthForm />
      </div>
    );
  }

  // Kullanıcı giriş yaptıysa ana içerik:
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#181c24] via-[#232a34] to-[#0e1013] flex flex-col items-center justify-center px-4 py-8 font-sans">
      {/* Üst Menü */}
      <header className="w-full max-w-7xl flex justify-between items-center py-6 px-2">
        <div className="text-3xl font-bold tracking-widest text-white drop-shadow-lg select-none">Melodify</div>
        <button
          onClick={async () => { await supabase.auth.signOut(); window.location.reload(); }}
          className="bg-[#232a34] text-gray-200 px-6 py-2 rounded-full border border-gray-700 hover:bg-[#181c24] transition"
        >
          Çıkış Yap
        </button>
      </header>

      {/* Ana İçerik */}
      <main className="flex flex-col md:flex-row items-center justify-center gap-16 w-full max-w-6xl mt-8">
        {/* Sol: Başlık ve Açıklama */}
        <div className="flex-1 flex flex-col gap-8 items-start">
          <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-xl animate-fade-in-up">
            Müzik Dosyanı <span className="text-[#FFD700]">Yükle</span>,
            <br />
            <span className="text-[#C0C0C0]">Notalara Dönüştür!</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-xl animate-fade-in-up delay-100">
            Melodify ile .wav/.mp3 dosyalarını yükle, otomatik olarak piyano notalarına ve MIDI'ye dönüştür. Sonuçları görsel olarak incele, arşivle ve paylaş.
          </p>
          <div className="flex gap-4 mt-2 animate-fade-in-up delay-200">
            <button className="bg-[#FFD700] text-black font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-[#e6c200] transition-all text-lg">
              Hemen Başla
            </button>
            <button className="bg-transparent border border-gray-500 text-gray-200 font-semibold px-8 py-3 rounded-full hover:bg-gray-800 transition-all text-lg">
              Demo İzle
            </button>
          </div>
        </div>

        {/* Sağ: Görsel/Kart Alanı */}
        <div className="flex-1 flex flex-col items-center gap-8 animate-fade-in-up delay-300">
          <div className="relative w-[340px] h-[340px] md:w-[400px] md:h-[400px] rounded-3xl bg-gradient-to-tr from-[#232a34] via-[#181c24] to-[#232a34] shadow-2xl flex items-center justify-center border border-[#FFD700]/10 overflow-hidden group transition-all">
            {/* Buraya ileride bir görsel veya animasyon eklenebilir */}
            <span className="text-6xl text-[#FFD700] font-black opacity-20 absolute left-6 top-6 select-none">♪</span>
            <span className="text-6xl text-[#C0C0C0] font-black opacity-10 absolute right-8 bottom-8 select-none">♬</span>
            <span className="text-2xl text-white font-bold z-10">Müzik Yükle</span>
          </div>
          {/* Kart temelli dosya yükleme alanı */}
          <div className="w-full max-w-xs bg-[#181c24] rounded-2xl shadow-lg p-6 border border-[#232a34] animate-fade-in-up delay-400">
            <AudioUpload onUpload={(url: string) => {
              console.log('Yüklenen dosya:', url);
            }} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl flex justify-between items-center py-6 px-2 mt-16 text-gray-500 text-sm animate-fade-in-up delay-500">
        <span>© 2024 Melodify</span>
        <span className="hidden md:block">Lüks, minimal ve modern müzik deneyimi</span>
        <a href="#" className="hover:underline">İletişim</a>
      </footer>

      {/* Basit fade-in animasyonları için stil */}
      <style jsx global>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1s cubic-bezier(0.23, 1, 0.32, 1) both;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
      `}</style>
    </div>
  );
}
