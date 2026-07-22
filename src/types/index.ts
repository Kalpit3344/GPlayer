export interface DropboxFile {
  id: string;
  name: string;
  path_lower: string;
  size: number;
}

export interface Track {
  id: string;
  title: string;
  url: string;
  artwork?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  accessTokenExpirationDate: string;
}