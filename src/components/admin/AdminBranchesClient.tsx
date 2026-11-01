'use client';

import React, { useState } from 'react';
import { Store, Plus, MapPin, Phone, Clock, Eye, EyeOff, Edit2, Loader2, CheckCircle2 } from 'lucide-react';
import { Branch } from '@/types';

interface AdminBranchesClientProps {
  initialBranches: Branch[];
}

export default function AdminBranchesClient({ initialBranches }: AdminBranchesClientProps) {
  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [editingBranch, setEditingBranch] = useState<Partial<Branch> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const openAddModal = () => {
    setEditingBranch({
      name: '',
      city: 'حائل',
      district: '',
      address: '',
      mapUrl: '',
      phone: '+966546002435',
      workingHours: 'من 9:00 ص حتى 11:30 م',
      isActive: true,
      isHQ: false,
      serviceAreas: ['مدينة حائل'],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (b: Branch) => {
    setEditingBranch({ ...b });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBranch?.name || !editingBranch?.city) return;

    setSaving(true);
    try {
      const res = await fetch('/api/admin/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingBranch),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل حفظ الفرع');
      }

      const savedBranch: Branch = data.branch;
      setBranches((prev) => {
        const idx = prev.findIndex((b) => b._id === savedBranch._id);
        if (idx !== -1) {
          const copy = [...prev];
          copy[idx] = savedBranch;
          return copy;
        }
        return [...prev, savedBranch];
      });

      setIsModalOpen(false);
      setEditingBranch(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'خطأ في الحفظ';
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const toggleBranchVisibility = async (b: Branch) => {
    const updated = { ...b, isActive: !b.isActive };
    try {
      const res = await fetch('/api/admin/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success) {
        setBranches((prev) =>
          prev.map((item) => (item._id === b._id ? { ...item, isActive: !item.isActive } : item))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#4A1D2E]">إدارة الفروع ومناطق الخدمة</h1>
          <p className="text-xs text-[#6E6468]">
            إجمالي الفروع المسجلة ({branches.length}) — فرع حائل الرئيسي المعتمد، وموقع توزيع الرياض
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-5 py-2.5 rounded-xl bg-[#682D43] hover:bg-[#522234] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة فرع أو نقطة توزيع</span>
        </button>
      </div>

      {/* Branches List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {branches.map((b) => (
          <div
            key={b._id}
            className={`bg-white rounded-3xl border p-6 shadow-2xs flex flex-col justify-between space-y-4 ${
              b.isActive ? 'border-[#E7DCD0]' : 'border-gray-300 opacity-60'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-[#682D43]" />
                  <h3 className="font-bold text-base text-[#4A1D2E]">{b.name}</h3>
                </div>
                <div className="flex items-center gap-1.5">
                  {b.isHQ && (
                    <span className="text-[10px] bg-[#682D43] text-white font-bold px-2 py-0.5 rounded-full">
                      المقر الرئيسي
                    </span>
                  )}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      b.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {b.isActive ? 'معتمد ومنشور' : 'غير منشور (قيد التجهيز)'}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-[#6E6468]">
                <p className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                  <span>{b.address || `${b.city} - ${b.district}`}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>أوقات العمل: {b.workingHours}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span className="font-mono dir-ltr">{b.phone}</span>
                </p>
              </div>

              <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#E7DCD0] text-[11px] text-[#6E6468]">
                <strong className="text-[#4A1D2E] block mb-0.5">مناطق الخدمة والتوصيل:</strong>
                <span>{b.serviceAreas?.join(' ، ') || 'كافة المناطق'}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E7DCD0] flex items-center justify-between">
              <button
                onClick={() => toggleBranchVisibility(b)}
                className="text-xs font-bold text-gray-600 hover:text-black flex items-center gap-1"
              >
                {b.isActive ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>إخفاء من الموقع</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>إظهار بالمتجر</span>
                  </>
                )}
              </button>

              <button
                onClick={() => openEditModal(b)}
                className="px-3 py-1.5 rounded-lg bg-[#FAF6F0] hover:bg-[#682D43] hover:text-white text-[#682D43] text-xs font-bold border border-[#E7DCD0] flex items-center gap-1 transition-colors"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>تعديل البيانات</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add/Edit Branch */}
      {isModalOpen && editingBranch && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#E7DCD0] space-y-4">
            <h2 className="text-base font-bold text-[#4A1D2E] pb-2 border-b border-[#E7DCD0]">
              {editingBranch._id ? 'تعديل بيانات الفرع' : 'إضافة فرع جديد'}
            </h2>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#4A1D2E] mb-1">
                  اسم الفرع <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: الفرع الرئيسي — حائل"
                  value={editingBranch.name || ''}
                  onChange={(e) => setEditingBranch({ ...editingBranch, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E7DCD0] bg-[#FAF6F0] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#4A1D2E] mb-1">
                    المدينة <span className="text-rose-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="حائل"
                    value={editingBranch.city || ''}
                    onChange={(e) => setEditingBranch({ ...editingBranch, city: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7DCD0] bg-[#FAF6F0] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#4A1D2E] mb-1">
                    الحي
                  </label>
                  <input
                    type="text"
                    placeholder="حي النقرة"
                    value={editingBranch.district || ''}
                    onChange={(e) =>
                      setEditingBranch({ ...editingBranch, district: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#E7DCD0] bg-[#FAF6F0] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#4A1D2E] mb-1">
                  العنوان التفصيلي
                </label>
                <input
                  type="text"
                  placeholder="شارع فهد العلي العريفي — حي النقرة — حائل"
                  value={editingBranch.address || ''}
                  onChange={(e) => setEditingBranch({ ...editingBranch, address: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E7DCD0] bg-[#FAF6F0] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#4A1D2E] mb-1">
                    رقم الهاتف
                  </label>
                  <input
                    type="text"
                    placeholder="+966546002435"
                    value={editingBranch.phone || ''}
                    onChange={(e) => setEditingBranch({ ...editingBranch, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-[#E7DCD0] bg-[#FAF6F0] focus:outline-none font-mono dir-ltr text-right"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#4A1D2E] mb-1">
                    أوقات العمل
                  </label>
                  <input
                    type="text"
                    placeholder="من 9:00 ص حتى 11:30 م"
                    value={editingBranch.workingHours || ''}
                    onChange={(e) =>
                      setEditingBranch({ ...editingBranch, workingHours: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-[#E7DCD0] bg-[#FAF6F0] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#4A1D2E] mb-1">
                  رابط خرائط Google Maps
                </label>
                <input
                  type="url"
                  placeholder="https://maps.google.com/..."
                  value={editingBranch.mapUrl || ''}
                  onChange={(e) => setEditingBranch({ ...editingBranch, mapUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E7DCD0] bg-[#FAF6F0] focus:outline-none font-mono dir-ltr text-right"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="branchActive"
                    checked={editingBranch.isActive ?? true}
                    onChange={(e) =>
                      setEditingBranch({ ...editingBranch, isActive: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#682D43]"
                  />
                  <label htmlFor="branchActive" className="font-bold text-[#4A1D2E] cursor-pointer">
                    نشر الفرع بالمتجر
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="branchHQ"
                    checked={editingBranch.isHQ ?? false}
                    onChange={(e) =>
                      setEditingBranch({ ...editingBranch, isHQ: e.target.checked })
                    }
                    className="w-4 h-4 accent-[#682D43]"
                  />
                  <label htmlFor="branchHQ" className="font-bold text-[#4A1D2E] cursor-pointer">
                    تعيين كمقر رئيسي
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E7DCD0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E7DCD0] text-gray-600 hover:bg-[#FAF6F0]"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-[#682D43] text-white font-bold hover:bg-[#522234] shadow"
                >
                  {saving ? 'جاري الحفظ...' : 'حفظ الفرع'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

