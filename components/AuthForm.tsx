import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
      else window.location.reload();
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else {
        alert('Kayıt başarılı! Lütfen e-posta adresinizi doğrulayın.');
        setIsLogin(true);
      }
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-xs bg-[#181c24] rounded-2xl shadow-lg p-8 border border-[#232a34]">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="E-posta"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="px-4 py-3 rounded-lg bg-[#232a34] text-white border border-[#232a34] focus:outline-none focus:border-[#FFD700] transition"
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="px-4 py-3 rounded-lg bg-[#232a34] text-white border border-[#232a34] focus:outline-none focus:border-[#FFD700] transition"
        />
        {error && <div className="text-red-400 text-sm text-center">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="bg-[#FFD700] text-black font-semibold py-3 rounded-lg mt-2 hover:bg-[#e6c200] transition-all disabled:opacity-60"
        >
          {loading ? 'İşleniyor...' : isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
        </button>
      </form>
      <div className="text-center mt-4">
        <button
          className="text-gray-400 hover:underline text-sm"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? 'Hesabın yok mu? Kayıt ol' : 'Zaten hesabın var mı? Giriş yap'}
        </button>
      </div>
    </div>
  );
}