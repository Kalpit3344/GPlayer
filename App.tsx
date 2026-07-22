import React, { useEffect } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import { setupPlayer } from './src/player/playerSetup';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    try {
      setupPlayer();
    } catch (err) {
      // Fast Refresh can re-invoke this effect; setupPlayer() throws if
      // called twice, which is safe to ignore here.
      console.log('Player setup skipped:', err);
    }
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <AppNavigator />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 0 },
});

export default App;