import axios from 'axios';
import { getValidAccessToken } from '../auth/dropboxAuth';
import { DropboxFile } from '../types';

const AUDIO_EXTENSIONS = ['.mp3', '.m4a', '.wav', '.flac', '.aac', '.ogg'];

export async function listAudioFiles(): Promise<DropboxFile[]> {
  const token = await getValidAccessToken();

  const res = await axios.post(
    'https://api.dropboxapi.com/2/files/list_folder',
    {
      path: '', // '' = root of the app folder (if you chose "App folder" access)
      recursive: true,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const allFiles = res.data.entries as DropboxFile[];

  return allFiles.filter((file) =>
    AUDIO_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext))
  );
}

// Gets a temporary streaming link — valid for a few hours, good for TrackPlayer
export async function getTemporaryLink(path: string): Promise<string> {
  const token = await getValidAccessToken();

  const res = await axios.post(
    'https://api.dropboxapi.com/2/files/get_temporary_link',
    { path },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return res.data.link;
}