import axios from 'axios';
import { getValidAccessToken, signOut } from '../auth/dropboxAuth';
import { DropboxFile } from '../types';

const AUDIO_EXTENSIONS = ['.mp3', '.m4a', '.wav', '.flac', '.aac', '.ogg'];

export async function listAudioFiles(): Promise<DropboxFile[]> {
  const token = await getValidAccessToken();

  let res;
  try {
    res = await axios.post(
      'https://api.dropboxapi.com/2/files/list_folder',
      {
        path: '', // '' = root of the app folder or user root
        recursive: true,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err: any) {
    const errorSummary = err?.response?.data?.error_summary || '';
    const status = err?.response?.status;

    // 1. Handle 409 Conflict: path/not_found (e.g. empty/uncreated Dropbox App folder)
    if (status === 409 || errorSummary.includes('path/not_found')) {
      console.log('Dropbox folder not found or empty, returning empty list.');
      return [];
    }

    // 2. Handle 401 Unauthorized / 403 Forbidden (old token / missing scope)
    if (status === 401 || status === 403 || errorSummary.includes('missing_scope') || errorSummary.includes('invalid_access_token')) {
      signOut();
      throw new Error('Your Dropbox session has expired or requires re-authentication. Please sign out and sign in again.');
    }

    throw err;
  }

  let allEntries: DropboxFile[] = res.data.entries || [];
  let hasMore = res.data.has_more;
  let cursor = res.data.cursor;

  while (hasMore && cursor) {
    const continueRes = await axios.post(
      'https://api.dropboxapi.com/2/files/list_folder/continue',
      { cursor },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    allEntries = allEntries.concat(continueRes.data.entries || []);
    hasMore = continueRes.data.has_more;
    cursor = continueRes.data.cursor;
  }

  return allEntries.filter((file) =>
    file.name && AUDIO_EXTENSIONS.some((ext) => file.name.toLowerCase().endsWith(ext))
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