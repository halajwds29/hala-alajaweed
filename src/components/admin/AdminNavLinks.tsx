'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Store,
  FileEdit,
  Settings,
  Image as ImageIcon,
} from 'lucide-react';

export default function AdminNavLinks() {
  const pathname = usePathname();

  const links = [
    { label: 'الرئيسية والإحصائيات', href: '/admin', icon: LayoutDashboard },
    { label: 'إدارة الطلبات', href: '/admin/orders', icon: ShoppingBag },
    { label: 'إدارة المنتجات', href: '/admin/products', icon: Package },
    { label: 'إدارة التصنيفات', href: '/admin/categories', icon: Layers },
    { label: 'مكتبة الصور والوسائط', href: '/admin/media', icon: ImageIcon },
    { label: 'إدارة الفروع', href: '/admin/branches', icon: Store },
    { label: 'إدارة المحتوى والصور', href: '/admin/content', icon: FileEdit },
    { label: 'الإعدادات والربط', href: '/admin/settings', icon: Settings },
  ];

  return (
    <nav className="space-y-1">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive =
          link.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              isActive
                ? 'bg-[#682D43] text-white shadow-md border-r-4 border-[#C5A059]'
                : 'text-[#F7F1E9]/80 hover:bg-white/5 hover:text-white'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-[#C5A059]' : 'text-[#C99BA4]'}`} />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

