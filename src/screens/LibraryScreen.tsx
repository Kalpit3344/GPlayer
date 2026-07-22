import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useActiveMediaItem } from '@rntp/player';
import { listAudioFiles } from '../api/dropboxApi';
import { playQueue } from '../player/playerSetup';
import { signOut } from '../auth/dropboxAuth';
import { usePlayerStore } from '../store/playerStore';
import SongListItem from '../components/SongListItem';
import MiniPlayer from '../components/MiniPlayer';
import { DropboxFile } from '../types';

export default function LibraryScreen() {
  const navigation = useNavigation<any>();
  const { library, isLoadingLibrary, setLibrary, setIsLoadingLibrary } = usePlayerStore();
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const activeItem = useActiveMediaItem();

  const fetchLibrary = useCallback(async () => {
    setError(null);
    try {
      const files = await listAudioFiles();
      setLibrary(files);
    } catch (err) {
      setError('Could not load your library. Pull down to try again.');
    }
  }, [setLibrary]);

  useEffect(() => {
    setIsLoadingLibrary(true);
    fetchLibrary().finally(() => setIsLoadingLibrary(false));
  }, [fetchLibrary, setIsLoadingLibrary]);

  async function handleRefresh() {
    setRefreshing(true);
    await fetchLibrary();
    setRefreshing(false);
  }

  async function handlePlay(index: number) {
    await playQueue(library, index);
  }

  function handleSignOut() {
    signOut();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Library</Text>
        <TouchableOpacity onPress={handleSignOut}>
          <Text style={styles.signOut}>Sign out</Text>
        </TouchableOpacity>
      </View>

      {isLoadingLibrary ? (
        <View style={styles.center}><ActivityIndicator color="#8B5CF6" /></View>
      ) : error ? (
        <View style={styles.center}><Text style={styles.errorText}>{error}</Text></View>
      ) : library.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No audio files found. Add some songs to your Dropbox app folder and pull down to refresh.</Text>
        </View>
      ) : (
        <FlatList
          data={library}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#8B5CF6" />}
          renderItem={({ item, index }) => (
            <SongListItem
              file={item}
              isActive={activeItem?.mediaId === item.id}
              onPress={() => handlePlay(index)}
            />
          )}
        />
      )}

      <MiniPlayer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '700' },
  signOut: { color: '#8B5CF6', fontSize: 13 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  errorText: { color: '#F87171', textAlign: 'center' },
  emptyText: { color: '#9CA3AF', textAlign: 'center', lineHeight: 20 },
});