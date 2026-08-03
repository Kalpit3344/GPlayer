/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';

jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@react-navigation/native-stack', () => ({
  createNativeStackNavigator: () => ({
    Navigator: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    Screen: () => null,
  }),
}));

jest.mock('react-native-app-auth', () => ({
  authorize: jest.fn(),
  refresh: jest.fn(),
  AuthConfiguration: {},
}));

jest.mock('react-native-mmkv', () => ({
  createMMKV: () => ({
    set: jest.fn(),
    getString: jest.fn(),
    remove: jest.fn(),
  }),
}));

jest.mock('../src/player/playerSetup', () => ({
  setupPlayer: jest.fn().mockResolvedValue(undefined),
}));

jest.mock('../src/auth/dropboxAuth', () => ({
  signIn: jest.fn(),
  isSignedIn: jest.fn(() => false),
  signOut: jest.fn(),
}));

jest.mock('@rntp/player', () => ({
  __esModule: true,
  default: {
    setupPlayer: jest.fn(),
    setCommands: jest.fn(),
    setMediaItems: jest.fn(),
    play: jest.fn(),
    clear: jest.fn(),
    stop: jest.fn(),
  },
  useActiveMediaItem: jest.fn(() => null),
}));

import App from '../App';

test('renders correctly', async () => {
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<App />);
  });
});
