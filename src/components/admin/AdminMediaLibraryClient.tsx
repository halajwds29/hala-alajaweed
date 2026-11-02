'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  Upload,
  Trash2,
  Copy,
  Check,
  Search,
  RefreshCw,
  Loader2,
  ImageIcon,
  FolderOpen,
  Info,
  ExternalLink,
} from 'lucide-react';
import { uploadMultipleFilesSafe } from '@/lib/client-image-compressor';

interface MediaFile {
  name: string;
  url: string;
  size: number;
  createdAt: string;
  modifiedAt: string;
}

export default function AdminMediaLibraryClient() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/media');
      const data = await res.json();
      if (data.success && Array.isArray(data.files)) {
        setFiles(data.files);
      }
    } catch (err) {
      console.error('Failed to load media files:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleUploadFiles = async (fileList: FileList | File[]) => {
    const fileArray = Array.from(fileList);
    if (fileArray.length === 0) return;

    setUploading(true);
    setUploadProgressText(`جاري تهيئة ${fileArray.length} صور للرفع...`);

    try {
      const result = await uploadMultipleFilesSafe(
        fileArray,
        'hala_alajaweed/media',
        (progress) => {
          setUploadProgressText(
            `جاري ضغط ورفع (${progress.current} من ${progress.total}) — ${progress.percentage}%`
          );
        }
      );

      await fetchFiles();

      if (result.failed.length > 0) {
        const errorList = result.failed.map((f) => `• ${f.fileName}: ${f.reason}`).join('\n');
        alert(
          `تم رفع ${result.succeeded.length} من أصل ${fileArray.length} صورة.\n\nالصور التي تعذر رفعها:\n${errorList}`
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'فشل رفع الصور';
      alert(msg);
      await fetchFiles();
    } finally {
      setUploading(false);
      setUploadProgressText('');
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm(`هل أنت متأكد من حذف الصورة «${fileName}» نهائياً من الخادم؟`)) return;

    try {
      const res = await fetch(`/api/admin/media?fileName=${encodeURIComponent(fileName)}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        setFiles((prev) => prev.filter((f) => f.name !== fileName));
      } else {
        alert(data.error || 'فشل حذف الملف');
      }
    } catch {
      alert('خطأ أثناء الحذف');
    }
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (isoString: string): string => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const filteredFiles = files.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E7DCD0]">
        <div>
          <h1 className="text-2xl font-black text-[#4A1D2E] flex items-center gap-2">
            <ImageIcon className="w-6 h-6 text-[#C5A059]" />
            <span>مكتبة الوسائط ورفع الصور من الجهاز</span>
          </h1>
          <p className="text-xs text-[#6E6468] mt-1">
            ارفع أي صور من جهازك (كمبيوتر أو جوال) واحصل على مسارها المباشر لاستخدامها في أي مكان بالمتجر
          </p>
        </div>

        <button
          onClick={fetchFiles}
          disabled={loading}
          className="px-4 py-2 rounded-xl bg-white border border-[#E7DCD0] text-xs font-bold text-[#682D43] hover:bg-[#FAF6F0] transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-2xs"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>تحديث المكتبة</span>
        </button>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleUploadFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-200 ${
          dragOver
            ? 'border-[#682D43] bg-[#682D43]/10 scale-[0.99]'
            : 'border-[#C5A059] bg-white hover:bg-[#FAF6F0]/80 shadow-xs'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleUploadFiles(e.target.files);
            }
            e.target.value = '';
          }}
          className="hidden"
        />

        {uploading ? (
          <div className="space-y-3">
            <Loader2 className="w-10 h-10 animate-spin text-[#682D43] mx-auto" />
            <p className="text-sm font-bold text-[#4A1D2E]">
              {uploadProgressText || 'جاري رفع الصور من جهازك وحفظها...'}
            </p>
            <p className="text-xs text-[#9F6A76]">يرجى الانتظار لحين اكتمال الرفع</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-3xl bg-[#FAF6F0] text-[#682D43] flex items-center justify-center mx-auto border border-[#E7DCD0] shadow-xs">
              <Upload className="w-7 h-7 text-[#682D43]" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#4A1D2E]">
                انقر هنا لاختيار صور من جهازك أو اسحبها وأفلتها هنا
              </h3>
              <p className="text-xs text-[#6E6468] mt-1">
                يدعم رفع عدة صور دفعة واحدة بدون حد أقصى للعدد بصيغ (JPG, PNG, WebP, AVIF, HEIC) حتى 20 ميجابايت لكل صورة
              </p>
            </div>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#682D43] text-white text-xs font-bold shadow-xs hover:bg-[#522234] transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>اختر ملفات من جهازك الآن</span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Search & Info Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#9F6A76] absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="ابحث عن صورة باسم الملف..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-[#E7DCD0] bg-white text-xs focus:outline-none focus:border-[#682D43] shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-[#6E6468]">
          <FolderOpen className="w-4 h-4 text-[#C5A059]" />
          <span>
            إجمالي الصور المرفوعة: <strong>{files.length}</strong> صورة
          </span>
        </div>
      </div>

      {/* Grid of Uploaded Images */}
      {loading ? (
        <div className="p-16 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#682D43] mx-auto mb-2" />
          <p className="text-xs text-[#6E6468]">جاري تحميل مكتبة الوسائط...</p>
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#E7DCD0] p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#FAF6F0] text-[#9F6A76] flex items-center justify-center mx-auto">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-sm text-[#4A1D2E]">لا توجد صور مطابقة</h3>
          <p className="text-xs text-[#6E6468]">
            {searchQuery
              ? 'لم يتم العثور على أي صورة تطابق كلمة البحث.'
              : 'لم تقم برفع أي صور بعد. استخدم المربع أعلاه لرفع أول صورة من جهازك.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredFiles.map((file) => {
            const isCopied = copiedUrl === file.url;

            return (
              <div
                key={file.name}
                className="bg-white rounded-2xl border border-[#E7DCD0] hover:border-[#682D43] p-2 space-y-2 shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between"
              >
                {/* Thumbnail Preview */}
                <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#FAF6F0] border border-[#E7DCD0]/60">
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 150px, 200px"
                  />
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-1.5 left-1.5 w-6 h-6 rounded-lg bg-black/60 hover:bg-black/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    title="معاينة بالحجم الكامل"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* File info */}
                <div className="text-right space-y-0.5">
                  <p className="text-[11px] font-bold text-[#4A1D2E] truncate font-mono dir-ltr" title={file.name}>
                    {file.name}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-[#9F6A76]">
                    <span>{formatFileSize(file.size)}</span>
                    <span>{formatDate(file.modifiedAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-2 border-t border-[#E7DCD0] flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCopy(file.url)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#FAF6F0] hover:bg-[#682D43] hover:text-white text-[#682D43]'
                    }`}
                    title="نسخ مسار الصورة"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>تم النسخ ✓</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>نسخ المسار</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(file.name)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 border border-rose-200 transition-colors"
                    title="حذف الصورة"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Helpful Hint */}
      <div className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#E7DCD0] text-xs text-[#6E6468] flex items-start gap-3">
        <Info className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <strong className="text-[#4A1D2E] block">كيف تستخدم هذه الصور في المتجر؟</strong>
          <p className="leading-relaxed">
            عند رفع أي صورة، يمكنك الضغط على زر «نسخ المسار» واستخدامه في أي صنف أو قسم أو بنر. كما يمكنك أيضاً رفع الصور مباشرة من جهازك بداخل صفحة أي منتج أو قسم أو من صفحة «إدارة المحتوى» لتحديث صور الهوية والشعار وبنرات المتجر فورياً.
          </p>
        </div>
      </div>
    </div>
  );
}

