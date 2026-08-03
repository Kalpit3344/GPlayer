/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('../src/navigation/AppNavigator', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('../src/player/playerSetup', () => ({
  setupPlayer: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../src/auth/dropboxAuth', () => ({
  signIn: jest.fn(),
  isSignedIn: jest.fn(() => false),
  signOut: jest.fn(),
}));

import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
