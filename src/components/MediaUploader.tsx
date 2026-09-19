import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Video as VideoIcon, X, Loader2, Play, AlertCircle } from 'lucide-react';
import { UploadedMediaItem } from '../types/form';
import { uploadMediaFiles } from '../services/api';

interface MediaUploaderProps {
  fieldKey: string;
  mediaType: 'photos' | 'videos';
  maxFiles?: number;
  maxFileSizeMb?: number;
  allowedTypes?: string[];
  uploadedMedia: UploadedMediaItem[];
  onChange: (items: UploadedMediaItem[]) => void;
  error?: string;
  required?: boolean;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  fieldKey,
  mediaType,
  maxFiles = mediaType === 'photos' ? 50 : 30,
  maxFileSizeMb = mediaType === 'photos' ? 25 : 50,
  uploadedMedia,
  onChange,
  error,
  required = false,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter items matching this field key
  const currentItems = uploadedMedia.filter((m) => m.field_key === fieldKey);
  const remainingCount = Math.max(0, maxFiles - currentItems.length);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    setUploadError(null);

    const newFiles: File[] = Array.from(fileList);

    // 1. Check count limit
    if (newFiles.length > remainingCount) {
      setUploadError(`You can only add ${remainingCount} more ${mediaType}. Limit is ${maxFiles}.`);
      return;
    }

    // 2. Validate types and size
    const isVideoType = mediaType === 'videos';
    for (const f of newFiles) {
      if (isVideoType && !f.type.startsWith('video/')) {
        setUploadError(`File "${f.name}" is not a valid video.`);
        return;
      }
      if (!isVideoType && !f.type.startsWith('image/')) {
        setUploadError(`File "${f.name}" is not a valid image.`);
        return;
      }
      if (f.size > maxFileSizeMb * 1024 * 1024) {
        setUploadError(`File "${f.name}" exceeds the ${maxFileSizeMb}MB size limit.`);
        return;
      }
    }

    // 3. Upload to backend
    setIsUploading(true);
    try {
      const uploaded = await uploadMediaFiles(newFiles);

      // Attach field_key & media_type
      const formattedItems: UploadedMediaItem[] = uploaded.map((u) => ({
        ...u,
        field_key: fieldKey,
        media_type: isVideoType ? 'video' : 'photo',
      }));

      // Merge with existing items
      onChange([...uploadedMedia, ...formattedItems]);
    } catch (err: any) {
      console.error('Upload error:', err);
      setUploadError(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = (indexToRemove: number) => {
    const matchingIndices: number[] = [];
    uploadedMedia.forEach((m, idx) => {
      if (m.field_key === fieldKey) {
        matchingIndices.push(idx);
      }
    });

    const targetGlobalIndex = matchingIndices[indexToRemove];
    if (targetGlobalIndex !== undefined) {
      const updated = [...uploadedMedia];
      updated.splice(targetGlobalIndex, 1);
      onChange(updated);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const isVideo = mediaType === 'videos';

  return (
    <div className="space-y-3">
      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isUploading && remainingCount > 0 && inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 transition-all text-center select-none ${
          remainingCount === 0
            ? 'opacity-60 bg-slate-50 border-slate-200 cursor-not-allowed'
            : dragActive
            ? 'border-brand-500 bg-brand-50/50 scale-[1.01] cursor-pointer'
            : error
            ? 'border-rose-300 bg-rose-50/30 hover:border-rose-400 cursor-pointer'
            : 'border-slate-300 bg-slate-50/60 hover:bg-slate-50 hover:border-brand-500/60 cursor-pointer'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={isVideo ? 'video/mp4,video/webm,video/quicktime' : 'image/jpeg,image/png,image/webp,image/heic'}
          onChange={(e) => handleFiles(e.target.files)}
          disabled={isUploading || remainingCount === 0}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-200/80 flex items-center justify-center text-brand-600">
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
            ) : isVideo ? (
              <VideoIcon className="w-6 h-6" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-800 tracking-tight">
              {isUploading
                ? `Uploading ${isVideo ? 'videos' : 'photos'}...`
                : remainingCount === 0
                ? `Maximum limit of ${maxFiles} reached`
                : `Click or drag & drop ${isVideo ? 'property videos' : 'property photos'}`}
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              {isVideo
                ? `MP4, WEBM or MOV • Max ${maxFileSizeMb}MB per video • Up to ${maxFiles} videos`
                : `JPEG, PNG, WEBP or HEIC • Max ${maxFileSizeMb}MB per photo • Up to ${maxFiles} photos`}
            </div>
          </div>

          {/* Limit Badge */}
          <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-700 shadow-2xs">
            <span>{currentItems.length}</span>
            <span className="text-slate-400">/</span>
            <span>{maxFiles} {isVideo ? 'Videos' : 'Photos'}</span>
          </div>
        </div>
      </div>

      {uploadError && (
        <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 px-3 py-2 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {error && <p className="text-xs text-rose-500 font-medium">{error}</p>}

      {/* Thumbnails Grid */}
      {currentItems.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
          {currentItems.map((item, idx) => (
            <div
              key={item.storage_path || idx}
              className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs transition-all hover:shadow-md"
            >
              {item.media_type === 'video' ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-2">
                  <Play className="w-6 h-6 fill-white text-white opacity-80 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] text-slate-400 truncate max-w-full mt-1">
                    {item.original_name || `Video #${idx + 1}`}
                  </span>
                </div>
              ) : (
                <img
                  src={item.public_url}
                  alt={`Upload ${idx + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              )}

              {/* Index badge */}
              <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-xs text-[10px] font-bold text-white">
                #{idx + 1}
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(idx);
                }}
                className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 hover:bg-rose-600 text-white transition-colors opacity-90 group-hover:opacity-100 shadow"
                title="Remove file"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
