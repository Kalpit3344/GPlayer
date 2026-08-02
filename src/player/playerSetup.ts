import TrackPlayer, { PlayerCommand } from '@rntp/player';
import { getTemporaryLink } from '../api/dropboxApi';
import { DropboxFile } from '../types';

export async function setupPlayer(): Promise<void> {
  await TrackPlayer.setupPlayer({
    contentType: 'music',
    handleAudioBecomingNoisy: true,
    android: { wakeMode: 'network' },
  });

  // handling: 'native' means the lock screen / notification controls
  // work automatically — no JS needed for basic play/pause/skip.
  TrackPlayer.setCommands({
    capabilities: [PlayerCommand.PlayPause, PlayerCommand.Next, PlayerCommand.Previous],
    handling: 'native',
  });
}

// In-memory cache for temporary links to avoid redundant API calls
const linkCache = new Map<string, { url: string; expiresAt: number }>();

async function getCachedOrFetchLink(file: DropboxFile): Promise<string> {
  const cached = linkCache.get(file.id);
  const now = Date.now();
  // Links are valid for 4 hours; refresh if older than 3 hours
  if (cached && cached.expiresAt > now) {
    return cached.url;
  }
  const url = await getTemporaryLink(file.path_lower);
  const expiresAt = now + 3 * 60 * 60 * 1000;
  linkCache.set(file.id, { url, expiresAt });
  return url;
}

async function toMediaItem(file: DropboxFile) {
  const url = await getCachedOrFetchLink(file);
  return {
    mediaId: file.id,
    url,
    title: file.name.replace(/\.[^/.]+$/, ''), // strip file extension for display
    artist: 'GPlayer',
  };
}

export async function playQueue(files: DropboxFile[], startIndex: number) {
  if (!files || files.length === 0) return;

  // 1. Resolve selected track first for immediate playback (0 delay)
  const currentItem = await toMediaItem(files[startIndex]);
  
  // Create placeholders for other items so track counts and titles exist
  const initialMediaItems = files.map((file, idx) => {
    if (idx === startIndex) return currentItem;
    return {
      mediaId: file.id,
      url: currentItem.url, // temporary fallback URL until resolved
      title: file.name.replace(/\.[^/.]+$/, ''),
      artist: 'GPlayer',
    };
  });

  TrackPlayer.setMediaItems(initialMediaItems, startIndex);
  TrackPlayer.play();

  // 2. Asynchronously resolve remaining links in small batches in background
  (async () => {
    try {
      const resolvedItems = [...initialMediaItems];
      // Resolve nearby items first (startIndex + 1, startIndex + 2, etc.)
      const indicesToLoad = files.map((_, i) => i).sort((a, b) => Math.abs(a - startIndex) - Math.abs(b - startIndex));
      
      for (const idx of indicesToLoad) {
        if (idx === startIndex) continue;
        try {
          resolvedItems[idx] = await toMediaItem(files[idx]);
        } catch (e) {
          console.warn(`Failed to prefetch link for track ${files[idx].name}:`, e);
        }
      }
      // Update queue with fully resolved links
      TrackPlayer.setMediaItems(resolvedItems, startIndex);
    } catch (err) {
      console.warn('Error loading queue links:', err);
    }
  })();
}