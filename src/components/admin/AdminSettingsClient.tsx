'use client';

import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle2,
  RefreshCw,
  Database,
  Cloud,
  AlertTriangle,
  Lock,
  Phone,
  Mail,
  Truck,
  Loader2,
  Tag,
  KeyRound,
  ShieldCheck,
  Eye,
  EyeOff,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import { SiteSettings } from '@/types';

interface ConnectionStatusState {
  database: {
    connected: boolean;
    databaseName?: string;
    host?: string;
    error?: string;
  };
  cloudinary: {
    connected: boolean;
    cloudName?: string;
    error?: string;
  };
}

interface AdminSettingsClientProps {
  initialSettings: SiteSettings;
  initialStatus: ConnectionStatusState;
}

export default function AdminSettingsClient({
  initialSettings,
  initialStatus,
}: AdminSettingsClientProps) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [status, setStatus] = useState<ConnectionStatusState>(initialStatus);
  const [testingStatus, setTestingStatus] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Admin Account Credentials State
  const [currentAdminUsername, setCurrentAdminUsername] = useState('admin');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [savingCreds, setSavingCreds] = useState(false);
  const [credsSuccess, setCredsSuccess] = useState('');
  const [credsError, setCredsError] = useState('');

  // Fetch current admin account info
  useEffect(() => {
    fetch('/api/admin/auth/change-credentials')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.username) {
          setCurrentAdminUsername(data.username);
        }
      })
      .catch((err) => console.error('Error fetching admin account:', err));
  }, []);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, text: '', color: 'bg-gray-200' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) || /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, text: 'ضعيفة', color: 'bg-rose-500' };
    if (score <= 3) return { score, text: 'متوسطة', color: 'bg-amber-500' };
    return { score, text: 'قوية وممتازة', color: 'bg-emerald-600' };
  };

  const passStrength = getPasswordStrength(newPassword);

  const handleChangeCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setCredsError('');
    setCredsSuccess('');

    if (!currentPassword) {
      setCredsError('يرجى إدخال كلمة المرور الحالية لتأكيد التغيير.');
      return;
    }

    if (!newUsername.trim() && !newPassword.trim()) {
      setCredsError('يرجى إدخال اسم مستخدم جديد أو كلمة مرور جديدة.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setCredsError('كلمة المرور الجديدة غير متطابقة مع تأكيد كلمة المرور.');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setCredsError('يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل.');
      return;
    }

    setSavingCreds(true);
    try {
      const res = await fetch('/api/admin/auth/change-credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newUsername: newUsername.trim() || undefined,
          newPassword: newPassword.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل تحديث بيانات الدخول');
      }

      setCredsSuccess('تم تحديث بيانات الدخول بنجاح! بياناتك الجديدة مفعلة الآن.');
      if (data.username) {
        setCurrentAdminUsername(data.username);
      }
      setCurrentPassword('');
      setNewUsername('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setCredsSuccess(''), 5000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'خطأ في الخادم';
      setCredsError(msg);
    } finally {
      setSavingCreds(false);
    }
  };

  // Connection tester
  const handleTestConnection = async () => {
    setTestingStatus(true);
    try {
      const res = await fetch('/api/admin/status');
      const data = await res.json();
      setStatus(data);
    } catch (e) {
      console.error('Status check failed', e);
    } finally {
      setTestingStatus(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل حفظ الإعدادات');
      }

      setSettings(data.settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'خطأ في الحفظ';
      alert(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7DCD0]">
        <div>
          <h1 className="text-2xl font-black text-[#4A1D2E]">إعدادات النظام والربط التقني</h1>
          <p className="text-xs text-[#6E6468]">
            إعدادات الاتصال والتواصل، رسوم الشحن، واختبار اتصال MongoDB Atlas و Cloudinary
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-[#682D43] hover:bg-[#522234] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all self-start sm:self-auto"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>حفظ الإعدادات</span>
            </>
          )}
        </button>
      </div>

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>تم حفظ الإعدادات بنجاح.</span>
        </div>
      )}

      {/* Admin Security & Credentials Management */}
      <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E7DCD0]">
          <div>
            <div className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-[#C5A059]" />
              <h2 className="text-base font-bold text-[#4A1D2E]">
                أمان لوحة التحكم وتغيير بيانات الدخول
              </h2>
            </div>
            <p className="text-xs text-[#6E6468] mt-1">
              تغيير اسم مستخدم وكلمة مرور المشرف للدخول إلى لوحة التحكم بشكل آمن ومشفّر
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF6F0] border border-[#E7DCD0] text-xs font-bold text-[#682D43] self-start sm:self-auto">
            <UserCheck className="w-4 h-4 text-[#C5A059]" />
            <span>المشرف الحالي:</span>
            <span className="font-mono text-[#4A1D2E]">{currentAdminUsername}</span>
          </div>
        </div>

        {credsSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-bold">{credsSuccess}</span>
          </div>
        )}

        {credsError && (
          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{credsError}</span>
          </div>
        )}

        <form onSubmit={handleChangeCredentials} className="space-y-4 text-xs">
          {/* Current Password (Required) */}
          <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E7DCD0] space-y-2">
            <label className="block font-bold text-[#4A1D2E]">
              كلمة المرور الحالية <span className="text-rose-600">*</span>
              <span className="text-[11px] font-normal text-[#6E6468] block mt-0.5">
                مطلوبة للتحقق من هويتك وصلاحياتك قبل اعتماد أي تعديل
              </span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPass ? 'text' : 'password'}
                required
                placeholder="أدخل كلمة المرور الحالية"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E7DCD0] bg-white text-xs font-mono focus:outline-none focus:border-[#682D43] shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute left-3 top-2.5 text-gray-400 hover:text-[#682D43]"
              >
                {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* New Username */}
            <div>
              <label className="block font-bold text-[#4A1D2E] mb-1">
                اسم المستخدم الجديد (اختياري)
              </label>
              <input
                type="text"
                placeholder={`اتركه فارغاً للإبقاء على (${currentAdminUsername})`}
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] bg-[#FAF6F0] text-xs focus:outline-none focus:border-[#682D43]"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block font-bold text-[#4A1D2E] mb-1">
                كلمة المرور الجديدة (اختياري)
              </label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  placeholder="6 أحرف أو أكثر (اتركه فارغاً لعدم التغيير)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E7DCD0] bg-[#FAF6F0] text-xs font-mono focus:outline-none focus:border-[#682D43]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute left-3 top-2.5 text-gray-400 hover:text-[#682D43]"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Password strength meter */}
              {newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-[#6E6468]">قوة كلمة المرور:</span>
                    <span className="font-bold text-[#4A1D2E]">{passStrength.text}</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passStrength.color}`}
                      style={{ width: `${(passStrength.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Confirm New Password (Only if newPassword entered) */}
          {newPassword && (
            <div>
              <label className="block font-bold text-[#4A1D2E] mb-1">
                تأكيد كلمة المرور الجديدة <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPass ? 'text' : 'password'}
                  required
                  placeholder="أعد إدخال كلمة المرور الجديدة للتأكيد"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E7DCD0] bg-[#FAF6F0] text-xs font-mono focus:outline-none focus:border-[#682D43]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute left-3 top-2.5 text-gray-400 hover:text-[#682D43]"
                >
                  {showConfirmPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {confirmPassword && (
                <div className="mt-1 text-[11px]">
                  {newPassword === confirmPassword ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>كلمتا المرور متطابقتان ✓</span>
                    </span>
                  ) : (
                    <span className="text-rose-600 font-bold">
                      كلمتا المرور غير متطابقتين بعد
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={savingCreds || !currentPassword}
              className="px-6 py-2.5 rounded-xl bg-[#682D43] hover:bg-[#522234] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              {savingCreds ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#C5A059]" />
                  <span>جاري تحديث البيانات...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                  <span>تحديث بيانات الدخول وحفظ</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* 1. Infrastructure Connection Status Test (MongoDB Atlas & Cloudinary) */}
      <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-[#E7DCD0]">
          <div>
            <h2 className="text-base font-bold text-[#4A1D2E]">
              فحص واختبار الاتصال السحابي (Live Connection Test)
            </h2>
            <p className="text-xs text-[#9F6A76]">
              اختبار الاتصال الفعلي مع قاعدة بيانات MongoDB Atlas وسحابة تخزين الصور Cloudinary
            </p>
          </div>
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testingStatus}
            className="px-4 py-2 rounded-xl bg-[#FAF6F0] hover:bg-[#682D43] hover:text-white text-[#682D43] text-xs font-bold border border-[#E7DCD0] flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testingStatus ? 'animate-spin' : ''}`} />
            <span>إعادة فحص الاتصال</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* MongoDB Atlas Check Box */}
          <div
            className={`p-5 rounded-2xl border space-y-3 ${
              status.database.connected
                ? 'bg-emerald-50/60 border-emerald-300'
                : 'bg-amber-50/70 border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Database className="w-5 h-5 text-[#682D43]" />
                <span className="text-[#4A1D2E]">قاعدة بيانات MongoDB Atlas</span>
              </div>
              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                  status.database.connected
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-600 text-white'
                }`}
              >
                {status.database.connected ? 'متصل بنجاح ✓' : 'وضع التخزين المؤقت ⚠️'}
              </span>
            </div>

            <div className="text-xs space-y-1 text-[#6E6468]">
              {status.database.connected ? (
                <>
                  <p>
                    <strong>اسم القاعدة:</strong> {status.database.databaseName || 'hala_alajaweed'}
                  </p>
                  <p className="font-mono text-[11px] truncate">
                    <strong>المضيف:</strong> {status.database.host || 'MongoDB Atlas Cluster'}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-amber-900 font-semibold">{status.database.error}</p>
                  <p className="text-[11px]">
                    لربط قاعدة بيانات سحابية حقيقية، ضع رابط الاتصال{' '}
                    <code className="bg-white px-1 py-0.5 rounded font-mono">MONGODB_URI</code> داخل
                    ملف <code className="bg-white px-1 py-0.5 rounded font-mono">.env.local</code>.
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Cloudinary Check Box */}
          <div
            className={`p-5 rounded-2xl border space-y-3 ${
              status.cloudinary.connected
                ? 'bg-blue-50/60 border-blue-300'
                : 'bg-amber-50/70 border-amber-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm">
                <Cloud className="w-5 h-5 text-blue-700" />
                <span className="text-[#4A1D2E]">تخزين الصور Cloudinary</span>
              </div>
              <span
                className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${
                  status.cloudinary.connected
                    ? 'bg-blue-600 text-white'
                    : 'bg-amber-600 text-white'
                }`}
              >
                {status.cloudinary.connected ? 'متصل بنجاح ✓' : 'وضع التخزين المؤقت ⚠️'}
              </span>
            </div>

            <div className="text-xs space-y-1 text-[#6E6468]">
              {status.cloudinary.connected ? (
                <p>
                  <strong>اسم الحساب السحابي:</strong> {status.cloudinary.cloudName}
                </p>
              ) : (
                <>
                  <p className="text-amber-900 font-semibold">{status.cloudinary.error}</p>
                  <p className="text-[11px]">
                    لربط حساب Cloudinary الفعلي، أضف المفاتيح (
                    <code className="bg-white px-1 py-0.5 rounded font-mono">
                      CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
                    </code>
                    ) في ملف <code className="bg-white px-1 py-0.5 rounded font-mono">.env.local</code>.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Store Communication Settings */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#4A1D2E] pb-2 border-b border-[#E7DCD0]">
            أرقام وقنوات التواصل الرسمية
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
                رقم الواتساب المعتمد لتلقي الطلبات <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={settings.whatsapp}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] font-mono dir-ltr text-right focus:outline-none"
              />
              <span className="text-[10px] text-gray-400 mt-1 block">
                تُرسل إليه رسائل تأكيد الطلب المباشرة تلقائياً (+966546002435)
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
                رقم الاتصال الهاتفي الموحد
              </label>
              <input
                type="text"
                required
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] font-mono dir-ltr text-right focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
              البريد الإلكتروني الرسمي
            </label>
            <input
              type="email"
              required
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] font-mono dir-ltr text-right focus:outline-none"
            />
          </div>
        </div>

        {/* 3. Delivery & Ordering Settings */}
        <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 sm:p-8 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-[#4A1D2E] pb-2 border-b border-[#E7DCD0]">
            إعدادات التوصيل والطلبات
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
                رسوم التوصيل الافتراضية (ر.س)
              </label>
              <input
                type="number"
                min="0"
                value={settings.deliveryFee}
                onChange={(e) =>
                  setSettings({ ...settings, deliveryFee: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
                الحد الأدنى للتوصيل المجاني (ر.س)
              </label>
              <input
                type="number"
                min="0"
                value={settings.freeDeliveryThreshold}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    freeDeliveryThreshold: Number(e.target.value),
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] font-mono focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.isStoreOpen}
                onChange={(e) => setSettings({ ...settings, isStoreOpen: e.target.checked })}
                className="w-5 h-5 accent-[#682D43]"
              />
              <span className="text-xs font-bold text-[#4A1D2E]">
                المتجر متاح لاستقبال الطلبات الجديدة حالياً
              </span>
            </label>
          </div>
        </div>

        {/* 5. Promotional Coupon & Floating Popup Settings */}
        <div className="bg-white rounded-3xl border border-[#E7DCD0] p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-[#E7DCD0]">
            <Tag className="w-5 h-5 text-[#C5A059]" />
            <div>
              <h2 className="text-base font-bold text-[#4A1D2E]">
                كود الخصم والإشعار الجانبي (Floating Promo Popup)
              </h2>
              <p className="text-xs text-[#9F6A76]">
                التحكم في إظهار كود خصم للعميل في جانب الشاشة لثوانٍ مع زر نسخ فوري ونسبة الخصم
              </p>
            </div>
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E7DCD0] cursor-pointer">
              <input
                type="checkbox"
                checked={settings.promoPopup?.enabled ?? true}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    promoPopup: {
                      enabled: e.target.checked,
                      code: settings.promoPopup?.code || 'AJAWEED10',
                      discountPercent: settings.promoPopup?.discountPercent || 10,
                      title: settings.promoPopup?.title || 'كود خصم حصري للضيافة',
                      description:
                        settings.promoPopup?.description ||
                        'استخدم كود الخصم عند تأكيد الطلب واحصل على خصم 10% فوري على إجمالي طلبك',
                      minOrderAmount: settings.promoPopup?.minOrderAmount || 0,
                    },
                  })
                }
                className="w-5 h-5 accent-[#682D43] shrink-0"
              />
              <div>
                <span className="text-xs font-bold text-[#4A1D2E] block">
                  تفعيل إشعار كود الخصم الجانبي للعملاء (إظهار كود الخصم في جانب الموقع)
                </span>
                <span className="text-[11px] text-[#6E6468] block mt-0.5">
                  عند التفعيل يظهر إشعار كود الخصم في جانب الموقع مع زر نسخ فوري للعميل، وعند إيقافه يختفي تماماً.
                </span>
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
                كود الخصم (Coupon Code)
              </label>
              <input
                type="text"
                placeholder="AJAWEED10"
                value={settings.promoPopup?.code || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    promoPopup: {
                      enabled: settings.promoPopup?.enabled ?? true,
                      code: e.target.value.toUpperCase(),
                      discountPercent: settings.promoPopup?.discountPercent || 10,
                      title: settings.promoPopup?.title || 'كود خصم حصري للضيافة',
                      description: settings.promoPopup?.description || '',
                      minOrderAmount: settings.promoPopup?.minOrderAmount || 0,
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] font-mono font-bold uppercase focus:outline-none focus:border-[#682D43]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
                نسبة الخصم (%)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={settings.promoPopup?.discountPercent || 10}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    promoPopup: {
                      enabled: settings.promoPopup?.enabled ?? true,
                      code: settings.promoPopup?.code || 'AJAWEED10',
                      discountPercent: Number(e.target.value),
                      title: settings.promoPopup?.title || 'كود خصم حصري للضيافة',
                      description: settings.promoPopup?.description || '',
                      minOrderAmount: settings.promoPopup?.minOrderAmount || 0,
                    },
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] font-mono font-bold focus:outline-none focus:border-[#682D43]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
              عنوان الإشعار الترويجي
            </label>
            <input
              type="text"
              placeholder="مثال: كود خصم حصري للضيافة"
              value={settings.promoPopup?.title || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  promoPopup: {
                    enabled: settings.promoPopup?.enabled ?? true,
                    code: settings.promoPopup?.code || 'AJAWEED10',
                    discountPercent: settings.promoPopup?.discountPercent || 10,
                    title: e.target.value,
                    description: settings.promoPopup?.description || '',
                    minOrderAmount: settings.promoPopup?.minOrderAmount || 0,
                  },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] focus:outline-none focus:border-[#682D43]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#4A1D2E] mb-1">
              وصف العرض الترويجي
            </label>
            <textarea
              rows={2}
              placeholder="مثال: استخدم كود الخصم عند تأكيد الطلب واحصل على خصم 10% فوري على إجمالي طلبك"
              value={settings.promoPopup?.description || ''}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  promoPopup: {
                    enabled: settings.promoPopup?.enabled ?? true,
                    code: settings.promoPopup?.code || 'AJAWEED10',
                    discountPercent: settings.promoPopup?.discountPercent || 10,
                    title: settings.promoPopup?.title || 'كود خصم حصري للضيافة',
                    description: e.target.value,
                    minOrderAmount: settings.promoPopup?.minOrderAmount || 0,
                  },
                })
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7DCD0] text-xs bg-[#FAF6F0] focus:outline-none focus:border-[#682D43] resize-none"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

