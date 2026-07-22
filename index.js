import { AppRegistry } from 'react-native';
import TrackPlayer from '@rntp/player';
import App from './App';
import { name as appName } from './app.json';
import backgroundEventHandler from './src/player/trackPlayerService';

TrackPlayer.registerBackgroundEventHandler(() => backgroundEventHandler);
AppRegistry.registerComponent(appName, () => App);