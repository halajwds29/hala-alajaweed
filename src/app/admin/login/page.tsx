'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Lock,
  User,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  ArrowRight,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';
import Logo from '@/components/Logo';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  // Handle ambient glow tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  // Check Caps Lock
  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState('CapsLock'));
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsShaking(false);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'اسم المستخدم أو كلمة المرور غير صحيحة');
      }

      // Success transition
      router.push('/admin');
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'خطأ غير متوقع';
      setError(msg);
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);
      setLoading(false);
    }
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden bg-[#2D121C] text-[#F7F1E9] font-sans selection:bg-[#C99BA4] selection:text-[#4A1D2E]"
      dir="rtl"
    >
      {/* Interactive Dynamic Ambient Light Background */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 opacity-60"
        style={{
          background: `radial-gradient(650px circle at ${mousePos.x}% ${mousePos.y}%, rgba(197, 160, 89, 0.18), transparent 70%)`,
        }}
      />

      {/* Decorative Luxury Atmospheric Shapes */}
      <div className="pointer-events-none absolute top-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-[#682D43]/40 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-[-10%] left-[-5%] w-[450px] h-[450px] rounded-full bg-[#C5A059]/15 blur-[130px]" />

      {/* Main Login Card */}
      <div
        className={`w-full max-w-md relative z-10 bg-[#FAF6F0] text-[#231E20] rounded-3xl p-8 sm:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.45)] border border-[#C5A059]/40 backdrop-blur-md transition-all duration-300 ${
          isShaking ? 'animate-[shake_0.5s_ease-in-out]' : ''
        }`}
      >
        {/* Subtle Top Luxury Gold Accent Bar */}
        <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-[#C5A059] to-transparent rounded-t-3xl" />

        {/* Brand & Emblem Header */}
        <div className="text-center space-y-3 pb-2">
          <div className="inline-block transform transition-transform hover:scale-105 duration-300">
            <Logo variant="burgundy" size="lg" className="justify-center" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EFE6D8] border border-[#E7DCD0] text-[11px] font-bold text-[#682D43]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>بوابة الإدارة المعتمدة الآمنة</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-[#4A1D2E] tracking-tight font-serif pt-1">
            تسجيل دخول المشرف
          </h1>
          <p className="text-xs text-[#6E6468] leading-relaxed">
            أدخل بيانات حسابك المعتمدة للوصول إلى لوحة إدارة متجر حلا الأجاويد
          </p>
        </div>

        {/* Error Notification Alert */}
        {error && (
          <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-800 flex items-start gap-2.5 animate-fadeIn shadow-2xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block">تعذر تسجيل الدخول</span>
              <span className="text-[11px] text-rose-700">{error}</span>
            </div>
          </div>
        )}

        {/* Caps Lock Active Warning */}
        {capsLockActive && (
          <div className="mt-2 p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-800 flex items-center gap-2">
            <span className="font-bold">تنبيه:</span> زر الحروف الكبيرة (Caps Lock) مفعّل حالياً.
          </div>
        )}

        {/* Interactive Form */}
        <form onSubmit={handleLogin} onKeyUp={handleKeyUp} className="mt-6 space-y-4">
          {/* Username Input */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#4A1D2E]">
              اسم المستخدم <span className="text-rose-600">*</span>
            </label>
            <div className="relative group">
              <input
                type="text"
                required
                autoComplete="username"
                placeholder="أدخل اسم المستخدم (مثل: admin)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-3 pr-10 py-3 rounded-xl border border-[#E7DCD0] focus:border-[#682D43] focus:ring-2 focus:ring-[#C5A059]/40 text-xs bg-white text-[#231E20] transition-all shadow-2xs placeholder:text-gray-400 font-medium"
              />
              <User className="w-4 h-4 text-[#9F6A76] absolute right-3.5 top-3.5 transition-colors group-focus-within:text-[#682D43]" />
            </div>
          </div>

          {/* Password Input with Show/Hide Toggle */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-[#4A1D2E]">
              كلمة المرور <span className="text-rose-600">*</span>
            </label>
            <div className="relative group">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                placeholder="أدخل كلمة المرور"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#E7DCD0] focus:border-[#682D43] focus:ring-2 focus:ring-[#C5A059]/40 text-xs bg-white text-[#231E20] transition-all shadow-2xs font-mono placeholder:font-sans placeholder:text-gray-400"
              />
              <Lock className="w-4 h-4 text-[#9F6A76] absolute right-3.5 top-3.5 transition-colors group-focus-within:text-[#682D43]" />

              {/* Password visibility toggle button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute left-3 top-3 text-gray-400 hover:text-[#682D43] p-0.5 rounded transition-colors"
                title={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-[#682D43]" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Remember me & Quick hint */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none text-[#6E6468] hover:text-[#4A1D2E]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#E7DCD0] text-[#682D43] focus:ring-[#682D43] accent-[#682D43]"
              />
              <span className="text-[11px]">تذكر تسجيل الدخول</span>
            </label>

            <span className="text-[11px] text-[#C5A059] font-bold flex items-center gap-1">
              <KeyRound className="w-3 h-3" />
              <span>جلسة مشفرة (JWT)</span>
            </span>
          </div>

          {/* Interactive Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-6 rounded-full bg-[#682D43] hover:bg-[#522234] text-white text-xs font-bold tracking-wide flex items-center justify-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg active:scale-98 disabled:opacity-70 group"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" />
                <span>جاري التحقق والدخول...</span>
              </>
            ) : (
              <>
                <span>الدخول إلى لوحة التحكم</span>
                <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>

        {/* Back Link to Public Store */}
        <div className="mt-6 pt-5 border-t border-[#E7DCD0] text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6E6468] hover:text-[#682D43] transition-colors"
          >
            <span>العودة إلى متجر حلا الأجاويد</span>
            <span className="font-mono text-xs">←</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
