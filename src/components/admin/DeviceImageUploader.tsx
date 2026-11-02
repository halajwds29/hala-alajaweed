'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, Trash2, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon, Link as LinkIcon, RefreshCw } from 'lucide-react';

interface DeviceImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label: string;
  description?: string;
  folder?: string;
  aspectRatio?: 'square' | 'wide' | 'banner';
  required?: boolean;
}

export default function DeviceImageUploader({
  value,
  onChange,
  label,
  description,
  folder = 'hala_alajaweed/content',
  aspectRatio = 'wide',
  required = false,
}: DeviceImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [manualUrlInput, setManualUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClass = {
    square: 'aspect-square max-w-[200px]',
    wide: 'aspect-[16/9] max-w-[360px]',
    banner: 'aspect-[21/9] w-full max-w-[480px]',
  }[aspectRatio];

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Validate type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP, AVIF)');
      return;
    }

    // Validate size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('حجم الصورة كبير جداً. الحد الأقصى المسموح به هو 8 ميجابايت.');
      return;
    }

    setUploading(true);
    setErrorMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل رفع الصورة من جهازك');
      }

      onChange(data.url);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'حدث خطأ أثناء رفع الصورة';
      setErrorMessage(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleApplyManualUrl = () => {
    const trimmed = manualUrlInput.trim();
    if (trimmed) {
      onChange(trimmed);
      setManualUrlInput('');
      setShowManualUrl(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-[#4A1D2E]">
          {label} {required && <span className="text-rose-600">*</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowManualUrl(!showManualUrl)}
          className="text-[11px] text-[#9F6A76] hover:text-[#682D43] transition-colors flex items-center gap-1"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showManualUrl ? 'إخفاء الرابط المباشر' : 'أو إدخال رابط يدوي'}</span>
        </button>
      </div>

      {description && <p className="text-[11px] text-[#6E6468] leading-relaxed">{description}</p>}

      {errorMessage && (
        <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Manual URL Bar (Optional toggle) */}
      {showManualUrl && (
        <div className="p-3 bg-[#FAF6F0] rounded-xl border border-[#E7DCD0] flex gap-2">
          <input
            type="url"
            placeholder="أدخل رابط الصورة (https://... أو /images/...)"
            value={manualUrlInput}
            onChange={(e) => setManualUrlInput(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[#E7DCD0] bg-white focus:outline-none dir-ltr text-right"
          />
          <button
            type="button"
            onClick={handleApplyManualUrl}
            className="px-3 py-1.5 bg-[#682D43] text-white text-xs font-bold rounded-lg hover:bg-[#522234]"
          >
            تطبيق
          </button>
        </div>
      )}

      {/* Preview Card or Drop Area */}
      {value ? (
        <div className="p-3 rounded-2xl border border-[#E7DCD0] bg-white shadow-2xs space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className={`relative ${aspectClass} w-full rounded-xl overflow-hidden bg-[#FAF6F0] border border-[#E7DCD0] shrink-0`}>
              <Image
                src={value}
                alt={label}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            </div>

            <div className="flex-1 space-y-2 text-right w-full">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>تم تعيين الصورة بنجاح</span>
              </div>
              <p className="text-[10px] text-[#6E6468] font-mono dir-ltr text-right truncate max-w-xs">
                {value}
              </p>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-3 py-1.5 rounded-lg bg-[#682D43] hover:bg-[#522234] text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
                >
                  {uploading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-3.5 h-3.5" />
                  )}
                  <span>تغيير الصورة من الجهاز</span>
                </button>

                <button
                  type="button"
                  onClick={() => onChange('')}
                  className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>إزالة</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
            dragOver
              ? 'border-[#682D43] bg-[#682D43]/5 scale-[0.99]'
              : 'border-[#E7DCD0] hover:border-[#682D43] bg-[#FAF6F0] hover:bg-[#F3ECE0]'
          }`}
        >
          {uploading ? (
            <div className="space-y-2">
              <Loader2 className="w-8 h-8 animate-spin text-[#682D43] mx-auto" />
              <p className="text-xs font-bold text-[#682D43]">جاري رفع الصورة من جهازك وحفظها...</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-full bg-white shadow-2xs text-[#682D43] flex items-center justify-center mx-auto border border-[#E7DCD0]">
                <Upload className="w-5 h-5 text-[#682D43]" />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-[#4A1D2E]">
                انقر هنا لاختيار صورة من جهازك
              </h4>
              <p className="text-[11px] text-[#6E6468]">
                أو اسحب الصورة وأفلتها هنا مباشرة (PNG, JPG, WebP)
              </p>
              <div className="pt-1">
                <span className="inline-block px-3 py-1 rounded-full bg-white text-[10px] font-bold text-[#682D43] border border-[#E7DCD0] shadow-2xs">
                  اختيار من الكمبيوتر أو الجوال
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden Native File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  );
}

