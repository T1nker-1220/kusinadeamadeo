import { createClient } from '@supabase/supabase-js';
import { create } from 'zustand';

interface StorageState {
  isUploading: boolean;
  isDeleting: boolean;
  error: string | null;
  uploadProgress: number;
  recentUploads: { path: string; url: string }[];
  recentDeletes: string[];
  setUploading: (isUploading: boolean) => void;
  setDeleting: (isDeleting: boolean) => void;
  setError: (error: string | null) => void;
  setUploadProgress: (progress: number) => void;
  addRecentUpload: (path: string, url: string) => void;
  addRecentDelete: (path: string) => void;
  clearRecentUploads: () => void;
  clearRecentDeletes: () => void;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const useStorageStore = create<StorageState>((set) => ({
  isUploading: false,
  isDeleting: false,
  error: null,
  uploadProgress: 0,
  recentUploads: [],
  recentDeletes: [],
  setUploading: (isUploading) => set({ isUploading }),
  setDeleting: (isDeleting) => set({ isDeleting }),
  setError: (error) => set({ error }),
  setUploadProgress: (progress) => set({ uploadProgress: progress }),
  addRecentUpload: (path, url) =>
    set((state) => ({
      recentUploads: [...state.recentUploads, { path, url }].slice(-10)
    })),
  addRecentDelete: (path) =>
    set((state) => ({
      recentDeletes: [...state.recentDeletes, path].slice(-10)
    })),
  clearRecentUploads: () => set({ recentUploads: [] }),
  clearRecentDeletes: () => set({ recentDeletes: [] }),
}));
