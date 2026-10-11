import React, { useRef, useState } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Film,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  Link2,
} from 'lucide-react';
import { uploadMediaToSupabase } from '../../lib/supabase';

interface MediaUploadFieldProps {
  label: string;
  description?: string;
  currentValue?: string;
  onChange: (newUrl: string) => void;
  mediaType?: 'image' | 'video';
  folder?: string;
  accept?: string;
  maxSizeMB?: number;
  recommendation?: string;
  required?: boolean;
}

export const MediaUploadField: React.FC<MediaUploadFieldProps> = ({
  label,
  description,
  currentValue = '',
  onChange,
  mediaType = 'image',
  folder = 'general',
  accept = mediaType === 'video'
    ? '.mp4,.webm,.mov,video/mp4,video/webm,video/quicktime'
    : '.png,.jpg,.jpeg,.svg,.webp,.ico,.gif,image/*',
  maxSizeMB = mediaType === 'video' ? 50 : 20,
  recommendation,
  required = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    'idle' | 'uploading' | 'success' | 'error'
  >('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [showManualUrl, setShowManualUrl] = useState(false);
  const [manualUrlInput, setManualUrlInput] = useState(currentValue);

  const handleFileSelected = async (file: File) => {
    // 1. Validate file size
    const sizeInMB = file.size / (1024 * 1024);
    if (sizeInMB > maxSizeMB) {
      setUploadStatus('error');
      setStatusMessage(
        `File is too large (${sizeInMB.toFixed(1)}MB). Maximum allowed size is ${maxSizeMB}MB.`
      );
      return;
    }

    // 2. Validate MIME type
    if (mediaType === 'image' && !file.type.startsWith('image/') && !file.name.endsWith('.svg')) {
      setUploadStatus('error');
      setStatusMessage('Please select a valid image file (PNG, JPG, SVG, WebP, GIF).');
      return;
    }
    if (mediaType === 'video' && !file.type.startsWith('video/') && !/\.(mp4|webm|mov)$/i.test(file.name)) {
      setUploadStatus('error');
      setStatusMessage('Please select a valid video file (MP4, WebM, MOV).');
      return;
    }

    // 3. Begin upload to persistent Supabase Storage
    setUploadStatus('uploading');
    setStatusMessage(`Uploading ${file.name} (${(file.size / 1024).toFixed(1)} KB) to cloud storage...`);

    try {
      const result = await uploadMediaToSupabase(file, folder);

      if (result.url && !result.error) {
        setUploadStatus('success');
        setStatusMessage(`Successfully uploaded "${file.name}"!`);
        onChange(result.url);
        setManualUrlInput(result.url);
      } else {
        setUploadStatus('error');
        setStatusMessage(result.error || 'Upload failed. Please check network and retry.');
      }
    } catch (err: any) {
      setUploadStatus('error');
      setStatusMessage(err?.message || 'Upload exception encountered.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleRemove = () => {
    onChange('');
    setManualUrlInput('');
    setUploadStatus('idle');
    setStatusMessage('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleApplyManualUrl = () => {
    onChange(manualUrlInput.trim());
    setUploadStatus('idle');
    setStatusMessage('URL updated.');
  };

  const hasCurrentMedia = Boolean(currentValue && currentValue.trim() !== '');

  return (
    <div className="space-y-2 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
      {/* Label and description */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
            {mediaType === 'video' ? (
              <Film className="w-4 h-4 text-blue-600" />
            ) : (
              <ImageIcon className="w-4 h-4 text-blue-600" />
            )}
            <span>{label}</span>
            {required && <span className="text-rose-500">*</span>}
          </label>
          {description && (
            <p className="text-xs text-slate-500 mt-0.5">{description}</p>
          )}
        </div>

        {/* Toggle manual URL input */}
        <button
          type="button"
          onClick={() => setShowManualUrl(!showManualUrl)}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1"
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>{showManualUrl ? 'Hide URL input' : 'Enter URL manually'}</span>
        </button>
      </div>

      {/* Manual URL Input drawer */}
      {showManualUrl && (
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2 animate-in fade-in duration-150">
          <label className="text-xs font-medium text-slate-600 block">
            Direct File or External URL:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualUrlInput}
              onChange={(e) => setManualUrlInput(e.target.value)}
              placeholder={mediaType === 'video' ? 'https://.../video.mp4' : 'https://.../image.png'}
              className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
            <button
              type="button"
              onClick={handleApplyManualUrl}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-900 text-white rounded-lg transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* Current Media Preview Card */}
      {hasCurrentMedia && (
        <div className="relative p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-4">
          {/* Media thumbnail */}
          <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-200 border border-slate-300 flex items-center justify-center shrink-0 relative">
            {mediaType === 'video' ? (
              <video
                src={currentValue}
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={currentValue}
                alt={label}
                className="w-full h-full object-contain p-1"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/assets/nova-logo.jpg';
                }}
              />
            )}
          </div>

          {/* Details & Actions */}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Active File</span>
              </span>
              <span className="text-xs text-slate-500 truncate font-mono">
                {currentValue.startsWith('data:')
                  ? 'Embedded Media (Base64)'
                  : currentValue.split('/').pop() || 'media-file'}
              </span>
            </div>

            <p className="text-xs text-slate-500 truncate" title={currentValue}>
              {currentValue}
            </p>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Replace File</span>
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="text-xs font-medium text-rose-600 hover:text-rose-800 flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-xl p-4 sm:p-6 text-center transition-all ${
          isDragging
            ? 'border-blue-500 bg-blue-50/70'
            : 'border-slate-300 hover:border-blue-400 bg-slate-50/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFileSelected(e.target.files[0]);
            }
          }}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>

          <div>
            <p className="text-xs sm:text-sm font-semibold text-slate-700">
              Drag and drop your {mediaType === 'video' ? 'video' : 'image'} here, or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-600 hover:underline font-bold"
              >
                Browse Computer
              </button>
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Supports{' '}
              {mediaType === 'video'
                ? 'MP4, WebM (Max 50MB)'
                : 'PNG, JPG, SVG, WebP, GIF, ICO (Max 20MB)'}
            </p>
          </div>

          {recommendation && (
            <p className="text-[11px] text-blue-600 font-medium">
              Tip: {recommendation}
            </p>
          )}
        </div>
      </div>

      {/* Status Alert Banner */}
      {uploadStatus === 'uploading' && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center gap-2.5 text-xs text-blue-800">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0" />
          <span className="font-medium">{statusMessage}</span>
        </div>
      )}

      {uploadStatus === 'success' && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{statusMessage}</span>
        </div>
      )}

      {uploadStatus === 'error' && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="font-medium">{statusMessage}</span>
        </div>
      )}
    </div>
  );
};
