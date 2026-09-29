import React, { useRef, useState, useEffect } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  FileText,
  X,
  Trash2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Eye,
} from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'application/pdf',
];
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.pdf'];

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const isPdfFile = (fileOrUrl) => {
  if (!fileOrUrl) return false;
  if (typeof fileOrUrl === 'string') {
    return fileOrUrl.toLowerCase().endsWith('.pdf');
  }
  return (
    fileOrUrl.type === 'application/pdf' ||
    fileOrUrl.name?.toLowerCase().endsWith('.pdf')
  );
};

const ReceiptUploader = ({
  file,
  onFileSelect,
  onFileRemove,
  currentReceiptUrl,
  onRemoveCurrentReceipt,
}) => {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [validationError, setValidationError] = useState('');

  // Generate object URL for image preview
  useEffect(() => {
    if (file) {
      if (!isPdfFile(file) && file.type?.startsWith('image/')) {
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
      } else {
        setPreviewUrl(null);
      }
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const validateAndProcessFile = (selectedFile) => {
    setValidationError('');

    if (!selectedFile) return;

    // 1. Validate File Size
    if (selectedFile.size > MAX_FILE_SIZE) {
      setValidationError('File size exceeds the 5MB limit. Please upload a smaller file.');
      return;
    }

    // 2. Validate File Type / Extension
    const fileExt = '.' + selectedFile.name.split('.').pop().toLowerCase();
    const isValidType =
      ALLOWED_TYPES.includes(selectedFile.type) ||
      ALLOWED_EXTENSIONS.includes(fileExt);

    if (!isValidType) {
      setValidationError(
        'Unsupported file type. Please upload a PNG, JPG, JPEG, WebP, or PDF file.'
      );
      return;
    }

    // Passed validation
    onFileSelect(selectedFile);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      validateAndProcessFile(selected);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndProcessFile(droppedFile);
    }
  };

  const handleOpenPicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setValidationError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onFileRemove();
  };

  const handleRemoveExisting = (e) => {
    e.stopPropagation();
    if (onRemoveCurrentReceipt) {
      onRemoveCurrentReceipt();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label
          htmlFor="receipt-file-input"
          className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider cursor-pointer"
        >
          Receipt Document (Optional)
        </label>
        {(file || currentReceiptUrl) && (
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Receipt Attached
          </span>
        )}
      </div>

      {/* Validation Error Message */}
      {validationError && (
        <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 flex items-start gap-2 animate-fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
          <span>{validationError}</span>
        </div>
      )}

      {/* 1. Newly Selected File State */}
      {file ? (
        <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xs flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3 min-w-0">
            {/* Thumbnail / Icon */}
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Receipt preview"
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-slate-100 dark:bg-slate-900"
              />
            ) : isPdfFile(file) ? (
              <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex flex-col items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                <FileText className="w-5 h-5" />
                <span className="text-[9px] font-bold uppercase tracking-tighter">
                  PDF
                </span>
              </div>
            ) : (
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-slate-600 dark:text-slate-300 shrink-0">
                <ImageIcon className="w-6 h-6" />
              </div>
            )}

            {/* File Meta */}
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[220px] sm:max-w-[260px]">
                {file.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  {formatFileSize(file.size)}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 uppercase">
                  {isPdfFile(file) ? 'PDF' : file.type.split('/')[1] || 'IMAGE'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleOpenPicker}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              title="Replace file"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
              title="Remove file"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : currentReceiptUrl ? (
        /* 2. Existing Attached Receipt (Edit Mode) */
        <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-2xl flex items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3 min-w-0">
            {isPdfFile(currentReceiptUrl) ? (
              <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex flex-col items-center justify-center text-rose-600 dark:text-rose-400 shrink-0">
                <FileText className="w-5 h-5" />
                <span className="text-[9px] font-bold uppercase tracking-tighter">
                  PDF
                </span>
              </div>
            ) : (
              <img
                src={currentReceiptUrl}
                alt="Current receipt"
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 shrink-0 bg-white dark:bg-slate-900"
              />
            )}
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate max-w-[220px]">
                Attached Receipt Document
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {isPdfFile(currentReceiptUrl) ? 'PDF Document' : 'Image Receipt'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleOpenPicker}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs"
            >
              Replace
            </button>
            {onRemoveCurrentReceipt && (
              <button
                type="button"
                onClick={handleRemoveExisting}
                className="p-1.5 text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition-colors"
                title="Remove attached receipt"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* 3. Empty Upload Dropzone */
        <div
          role="button"
          tabIndex={0}
          onClick={handleOpenPicker}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleOpenPicker();
            }
          }}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all outline-none ${
            isDragging
              ? 'border-slate-900 dark:border-emerald-500 bg-slate-100/90 dark:bg-slate-800/90 ring-4 ring-slate-900/5 dark:ring-emerald-500/10 scale-[1.01]'
              : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/60'
          }`}
        >
          {/* Cloud Icon Badge */}
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 flex items-center justify-center mx-auto mb-2.5 text-slate-600 dark:text-slate-300 shadow-xs transition-transform group-hover:scale-105">
            <UploadCloud className="w-5 h-5" />
          </div>

          <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
            <span className="underline decoration-slate-300 dark:decoration-slate-600 underline-offset-2 hover:decoration-slate-900 dark:hover:decoration-white">
              Click to upload
            </span>{' '}
            <span className="font-normal text-slate-500 dark:text-slate-400">or drag and drop</span>
          </p>

          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium mt-1">
            PNG, JPG, JPEG, WebP or PDF up to 5MB
          </p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        id="receipt-file-input"
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, application/pdf, .png, .jpg, .jpeg, .webp, .pdf"
        onChange={handleFileChange}
        onClick={(e) => {
          e.target.value = null; // Allows re-selecting same file
        }}
        className="sr-only hidden"
        tabIndex={-1}
      />
    </div>
  );
};

export default ReceiptUploader;
