import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAdminSession } from '@/lib/auth';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Store,
  FileEdit,
  Settings,
  LogOut,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import Logo from '@/components/Logo';
import AdminNavLinks from '@/components/admin/AdminNavLinks';
import AdminLogoutButton from '@/components/admin/AdminLogoutButton';

export const metadata: Metadata = {
  title: 'لوحة التحكم | حلا الأجاويد',
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getAdminSession();

  return (
    <div className="min-h-screen bg-[#F7F1E9] flex flex-col lg:flex-row text-[#231E20] font-sans" dir="rtl">
      {/* Sidebar (Desktop) */}
      <aside className="w-full lg:w-64 bg-[#4A1D2E] text-white flex flex-col justify-between shrink-0 shadow-xl border-l border-[#682D43]">
        <div>
          {/* Top Brand */}
          <div className="p-6 border-b border-[#682D43]/60">
            <Logo variant="light" size="md" />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#682D43] text-[#C5A059] font-bold">
                لوحة الإدارة الشاملة
              </span>
              <span className="text-[11px] text-[#C99BA4] font-mono">v1.0</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="p-4">
            <AdminNavLinks />
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#682D43]/60 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-[#F7F1E9] flex items-center justify-between transition-colors"
          >
            <span>زيارة واجهة المتجر</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#C5A059]" />
          </Link>

          <AdminLogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        {/* Top Navbar */}
        <header className="bg-white border-b border-[#E7DCD0] px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
          <div className="flex items-center gap-3">
            <h1 className="text-base font-bold text-[#4A1D2E]">
              مؤسسة حلا الأجاويد للحلويات — لوحة الإدارة
            </h1>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF6F0] border border-[#E7DCD0]">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[#682D43] font-bold">المشرف: {session?.username || 'مدير المتجر'}</span>
            </div>
          </div>
        </header>

        {/* Child Pages */}
        <div className="p-4 sm:p-6 lg:p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}

