import TrackPlayer, { PlayerCommand } from '@rntp/player';
import { getTemporaryLink } from '../api/dropboxApi';
import { DropboxFile } from '../types';

export function setupPlayer() {
  TrackPlayer.setupPlayer({
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

async function toMediaItem(file: DropboxFile) {
  const url = await getTemporaryLink(file.path_lower);
  return {
    mediaId: file.id,
    url,
    title: file.name.replace(/\.[^/.]+$/, ''), // strip file extension for display
    artist: 'GPlayer',
  };
}

export async function playQueue(files: DropboxFile[], startIndex: number) {
  const mediaItems = await Promise.all(files.map(toMediaItem));
  TrackPlayer.setMediaItems(mediaItems, startIndex);
  TrackPlayer.play();
}