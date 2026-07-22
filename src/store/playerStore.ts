import { create } from 'zustand';
import { DropboxFile } from '../types';

interface PlayerState {
  library: DropboxFile[];
  isLoadingLibrary: boolean;
  setLibrary: (files: DropboxFile[]) => void;
  setIsLoadingLibrary: (loading: boolean) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  library: [],
  isLoadingLibrary: false,
  setLibrary: (files) => set({ library: files }),
  setIsLoadingLibrary: (loading) => set({ isLoadingLibrary: loading }),
}));