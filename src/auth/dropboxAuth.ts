import { authorize, refresh, AuthConfiguration } from 'react-native-app-auth';
import { createMMKV } from 'react-native-mmkv';
import { AuthTokens } from '../types';

const storage = createMMKV();

const config: AuthConfiguration = {
  clientId: 'rzmzvxmicwqystw',
  redirectUrl: 'com.gplayer://oauthredirect',
  scopes: ['files.metadata.read', 'files.content.read'],
  additionalParameters: {
    token_access_type: 'offline',
  },
  serviceConfiguration: {
    authorizationEndpoint: 'https://www.dropbox.com/oauth2/authorize',
    tokenEndpoint: 'https://api.dropboxapi.com/oauth2/token',
  },
  usePKCE: true,
};

export async function signIn(): Promise<AuthTokens> {
  const result = await authorize(config);
  const tokens: AuthTokens = {
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
    accessTokenExpirationDate: result.accessTokenExpirationDate,
  };
  saveTokens(tokens);
  return tokens;
}

export function saveTokens(tokens: AuthTokens) {
  storage.set('dropbox_tokens', JSON.stringify(tokens));
}

export function getSavedTokens(): AuthTokens | null {
  const raw = storage.getString('dropbox_tokens');
  return raw ? JSON.parse(raw) : null;
}

export async function getValidAccessToken(): Promise<string> {
  const tokens = getSavedTokens();
  if (!tokens) throw new Error('Not signed in');

  const expTime = tokens.accessTokenExpirationDate ? new Date(tokens.accessTokenExpirationDate).getTime() : 0;
  const bufferMs = 60 * 1000;
  const isExpired = Number.isNaN(expTime) || (expTime - bufferMs <= Date.now());
  if (!isExpired) return tokens.accessToken;

  if (!tokens.refreshToken) {
    signOut();
    throw new Error('Session expired. Please sign in again.');
  }

  try {
    const refreshed = await refresh(config, { refreshToken: tokens.refreshToken });
    const newTokens: AuthTokens = {
      accessToken: refreshed.accessToken,
      refreshToken: refreshed.refreshToken ?? tokens.refreshToken,
      accessTokenExpirationDate: refreshed.accessTokenExpirationDate,
    };
    saveTokens(newTokens);
    return newTokens.accessToken;
  } catch (err) {
    signOut();
    throw new Error('Session expired. Please sign in again.');
  }
}

export function signOut() {
  storage.remove('dropbox_tokens');
}

export function isSignedIn(): boolean {
  return getSavedTokens() !== null;
}