import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, Video as VideoIcon, X, Loader2, Play } from 'lucide-react';
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

    if (newFiles.length > remainingCount) {
      setUploadError(`You can only add ${remainingCount} more ${mediaType}. Limit is ${maxFiles}.`);
      return;
    }

    const isVideoType = mediaType === 'videos';
    for (const f of newFiles) {
      if (isVideoType && !f.type.startsWith('video/')) {
        setUploadError(`"${f.name}" is not a valid video.`);
        return;
      }
      if (!isVideoType && !f.type.startsWith('image/')) {
        setUploadError(`"${f.name}" is not a valid image.`);
        return;
      }
      if (f.size > maxFileSizeMb * 1024 * 1024) {
        setUploadError(`"${f.name}" exceeds the ${maxFileSizeMb}MB limit.`);
        return;
      }
    }

    setIsUploading(true);
    try {
      const uploaded = await uploadMediaFiles(newFiles);
      const formattedItems: UploadedMediaItem[] = uploaded.map((u) => ({
        ...u,
        field_key: fieldKey,
        media_type: isVideoType ? 'video' : 'photo',
      }));
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
        className={`relative border border-dashed rounded-2xl p-6 sm:p-8 transition-all text-center select-none ${
          remainingCount === 0
            ? 'opacity-60 bg-slate-50 border-black/[0.08] cursor-not-allowed'
            : dragActive
            ? 'border-emerald-600 bg-emerald-50/40 scale-[1.005] cursor-pointer'
            : error
            ? 'border-rose-300 bg-rose-50/30 hover:border-rose-400 cursor-pointer'
            : 'border-black/[0.12] bg-slate-50/60 hover:bg-slate-50 hover:border-black/[0.24] cursor-pointer'
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
          <div className="w-10 h-10 rounded-2xl bg-white shadow-2xs border border-black/[0.06] flex items-center justify-center text-slate-700">
            {isUploading ? (
              <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
            ) : isVideo ? (
              <VideoIcon className="w-5 h-5" />
            ) : (
              <UploadCloud className="w-5 h-5" />
            )}
          </div>

          <div>
            <div className="text-xs sm:text-sm font-semibold text-slate-800 tracking-tight">
              {isUploading
                ? `Uploading ${isVideo ? 'videos' : 'photos'}...`
                : remainingCount === 0
                ? `Maximum limit reached (${maxFiles})`
                : `Add ${isVideo ? 'Videos' : 'Photos'}`}
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {remainingCount > 0 && `Tap to select or drop files • Up to ${remainingCount} more`}
            </p>
          </div>
        </div>
      </div>

      {uploadError && (
        <p className="text-xs text-rose-500 font-medium">{uploadError}</p>
      )}

      {/* Apple Photos Media Grid */}
      {currentItems.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 sm:gap-3 pt-1">
          {currentItems.map((item, index) => (
            <div
              key={item.id || index}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-slate-100 border border-black/[0.08] shadow-2xs transition-all"
            >
              {item.media_type === 'video' ? (
                <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-2">
                  <Play className="w-6 h-6 text-white/80" />
                  <span className="text-[10px] text-white/60 truncate max-w-full mt-1 font-mono">
                    {item.original_name || 'Video'}
                  </span>
                </div>
              ) : (
                <img
                  src={item.public_url}
                  alt={item.original_name || 'Uploaded photo'}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              )}

              {/* Remove button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(index);
                }}
                className="absolute top-2 right-2 p-1 rounded-full bg-black/60 hover:bg-black text-white backdrop-blur-md opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity active:scale-90"
                title="Remove"
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
