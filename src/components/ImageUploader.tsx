import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle, CheckCircle2, Trash2, RefreshCw } from 'lucide-react';
import { uploadImageToSupabase, deleteImageFromSupabase } from '../lib/supabase';
import { uploadImageToFirebaseStorage, isFirebaseConfigured } from '../lib/firebase';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  bucket?: string; // e.g. 'menu-images' or 'hero-banners'
  label?: string;
  className?: string;
}

export default function ImageUploader({
  value,
  onChange,
  bucket = 'menu-images',
  label = 'Dish Image',
  className = ''
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const MAX_INPUT_SIZE_BYTES = 10 * 1024 * 1024; // Allow up to 10MB input file

  // Compress image client-side to ensure small Data URL / fast upload
  const compressImageFile = async (file: File): Promise<File> => {
    // If already small (< 250KB), no compression needed
    if (file.size <= 250 * 1024) return file;

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxWidth = 1200;
          const maxHeight = 1200;
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(file);

          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
                  type: 'image/jpeg',
                  lastModified: Date.now()
                });
                resolve(compressedFile);
              } else {
                resolve(file);
              }
            },
            'image/jpeg',
            0.82
          );
        };
        img.onerror = () => resolve(file);
        img.src = e.target?.result as string;
      };
      reader.onerror = () => resolve(file);
      reader.readAsDataURL(file);
    });
  };

  const validateAndUpload = async (rawFile: File) => {
    setErrorMsg('');
    setSuccessMsg('');

    // Validate type
    if (!ALLOWED_TYPES.includes(rawFile.type.toLowerCase())) {
      setErrorMsg('Invalid file type. Please upload a JPG, JPEG, PNG, or WEBP image.');
      return;
    }

    // Validate raw size
    if (rawFile.size > MAX_INPUT_SIZE_BYTES) {
      setErrorMsg(`Image size is ${(rawFile.size / (1024 * 1024)).toFixed(1)}MB. Maximum allowed initial file size is 10MB.`);
      return;
    }

    const previousUrl = value;
    setIsUploading(true);

    try {
      const file = await compressImageFile(rawFile);
      let uploadedUrl = '';
      
      // 1. Try uploading to Firebase Firestore as Base64 if configured
      if (isFirebaseConfigured()) {
        const fbRes = await uploadImageToFirebaseStorage(file, bucket);
        if (fbRes.success && fbRes.url) {
          uploadedUrl = fbRes.url;
        }
      }

      // 2. Try Supabase Storage if configured
      if (!uploadedUrl) {
        const ext = file.name.split('.').pop() || 'jpg';
        const cleanBaseName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[^a-zA-Z0-9_-]/g, '')
          .slice(0, 30) || 'image';
        const filename = `${cleanBaseName}-${Date.now()}.${ext}`;

        const sbRes = await uploadImageToSupabase(file, filename, bucket);
        if (sbRes.success && sbRes.publicUrl && !sbRes.publicUrl.startsWith('data:')) {
          uploadedUrl = sbRes.publicUrl;
        }
      }

      // 3. Try Express server upload endpoint (/api/admin/upload-image)
      if (!uploadedUrl) {
        try {
          const base64Data = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const res = reader.result as string;
              resolve(res.split(',')[1] || res);
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
          });

          const apiRes = await fetch('/api/admin/upload-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              filename: file.name,
              contentType: file.type,
              base64Data,
              bucket
            })
          });

          if (apiRes.ok) {
            const apiData = await apiRes.json();
            if (apiData.success && apiData.publicUrl) {
              uploadedUrl = apiData.publicUrl;
            }
          }
        } catch {}
      }

      // 4. Final resilient client-side FileReader Data URL fallback
      if (!uploadedUrl) {
        uploadedUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read image file.'));
          reader.readAsDataURL(file);
        });
      }

      if (uploadedUrl) {
        // Delete previous image from Supabase if it was hosted there
        if (previousUrl && previousUrl !== uploadedUrl && previousUrl.includes('supabase')) {
          try {
            await deleteImageFromSupabase(previousUrl, bucket);
          } catch (delErr) {
            console.warn('Failed to delete old image from storage:', delErr);
          }
        }

        onChange(uploadedUrl);
        setSuccessMsg('Image uploaded and saved successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        throw new Error('Upload failed across all storage backends.');
      }
    } catch (err: any) {
      setErrorMsg('Error uploading image: ' + (err?.message || 'Network error'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndUpload(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndUpload(files[0]);
    }
  };

  const handleRemoveImage = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const oldUrl = value;
    setErrorMsg('');
    
    // Clear value immediately in UI
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Try deleting from storage
    if (oldUrl) {
      try {
        await deleteImageFromSupabase(oldUrl, bucket);
        setSuccessMsg('Image removed from storage');
        setTimeout(() => setSuccessMsg(''), 3000);
      } catch (err) {
        console.warn('Error removing image file from storage:', err);
      }
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase text-amber-300 block font-bold">
            {label}
          </label>
          <span className="text-[10px] font-mono text-amber-200/50">
            JPG, PNG, WEBP (Max 750KB)
          </span>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
      />

      {/* Dropzone or Preview */}
      {value ? (
        <div
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative group rounded-2xl overflow-hidden bg-[#0A0A0A] border-2 transition-all duration-200 h-52 w-full flex items-center justify-center shadow-xl ${
            isDragging ? 'border-amber-400 bg-amber-500/10' : 'border-amber-500/40 hover:border-amber-400'
          }`}
        >
          {/* Live Preview Image */}
          <img
            src={value}
            alt="Current Preview"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Top-Left Live Status Badge */}
          <div className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-emerald-500/40 text-[10px] font-mono font-semibold text-emerald-400 flex items-center gap-1.5 shadow-lg pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>CURRENTLY LIVE</span>
          </div>

          {/* Top-Right Action Buttons */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-3 py-1.5 rounded-xl bg-black/80 hover:bg-amber-500 hover:text-black border border-amber-500/40 text-amber-300 text-xs font-semibold backdrop-blur-md shadow-lg transition-all flex items-center gap-1.5"
              title="Replace current image"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace</span>
            </button>

            <button
              type="button"
              onClick={handleRemoveImage}
              className="px-3 py-1.5 rounded-xl bg-red-600/90 hover:bg-red-500 text-white text-xs font-bold border border-red-400/50 backdrop-blur-md shadow-lg transition-all flex items-center gap-1.5"
              title="Remove image from storage"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Remove Image</span>
            </button>
          </div>

          {/* Hover Overlay info */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer p-4 text-center z-10"
          >
            <Upload className="w-7 h-7 text-amber-300 mb-1.5 animate-bounce" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Click or Drag &amp; Drop to Replace</span>
            <span className="text-[10px] text-amber-200/70 mt-1 font-mono">
              Saves directly to Firebase Firestore
            </span>
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center h-48 ${
            isDragging
              ? 'border-amber-400 bg-amber-500/10 scale-[1.01]'
              : 'border-amber-500/30 bg-[#0C0C0C] hover:border-amber-500/60 hover:bg-[#121212]'
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-y-2 text-amber-300">
              <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
              <span className="text-xs font-bold">Saving image...</span>
              <span className="text-[10px] text-amber-200/60 font-mono">
                Converting to Base64 &amp; saving to Firestore
              </span>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2.5">
                <ImageIcon className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-[#F5EFE2]">
                Drag &amp; drop an image here, or{' '}
                <span className="text-amber-400 underline decoration-amber-500/40">
                  click to browse
                </span>
              </p>
              <p className="text-[10px] text-[#F5EFE2]/50 mt-1 font-mono">
                Supports JPG, PNG, WEBP — Max 750 KB
              </p>
            </>
          )}
        </div>
      )}

      {/* Error / Success Feedback */}
      {errorMsg && (
        <div className="p-2.5 rounded-xl bg-red-900/40 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-2.5 rounded-xl bg-emerald-900/40 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  );
}

