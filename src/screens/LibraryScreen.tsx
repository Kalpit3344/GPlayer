import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TrackPlayer, { useActiveMediaItem } from '@rntp/player';
import { listAudioFiles } from '../api/dropboxApi';
import { playQueue } from '../player/playerSetup';
import { signOut } from '../auth/dropboxAuth';
import { usePlayerStore } from '../store/playerStore';
import SongListItem from '../components/SongListItem';
import MiniPlayer from '../components/MiniPlayer';
import { SearchIcon, SignOutIcon, DropboxLogoIcon } from '../components/Icons';

export default function LibraryScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { library, isLoadingLibrary, setLibrary, setIsLoadingLibrary } = usePlayerStore();
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const activeItem = useActiveMediaItem();

  const fetchLibrary = useCallback(async () => {
    setError(null);
    try {
      const files = await listAudioFiles();
      setLibrary(files);
    } catch (err: any) {
      console.log('Error fetching Dropbox library:', err);
      const details = err?.response?.data?.error_summary || err?.message || 'Check your internet connection or sign in again.';
      setError(`Could not load your library.\n(${details})`);
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

  const filteredLibrary = useMemo(() => {
    if (!searchQuery.trim()) return library;
    const q = searchQuery.toLowerCase();
    return library.filter((file) => file.name.toLowerCase().includes(q));
  }, [library, searchQuery]);

  const totalSizeMb = useMemo(() => {
    const bytes = library.reduce((acc, f) => acc + (f.size || 0), 0);
    return (bytes / (1024 * 1024)).toFixed(1);
  }, [library]);

  async function handlePlay(file: typeof library[0]) {
    const realIndex = library.findIndex((f) => f.id === file.id);
    try {
      await playQueue(library, realIndex >= 0 ? realIndex : 0);
    } catch (err: any) {
      Alert.alert('Playback Failed', 'Could not start playback. Please check your internet connection.');
    }
  }

  async function handleSignOut() {
    try {
      TrackPlayer.clear();
      TrackPlayer.stop();
    } catch (e) {
      // Ignore if player reset encounters an issue
    }
    setLibrary([]);
    signOut();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }

  function renderEmptyOrError() {
    if (error) {
      return (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchLibrary} activeOpacity={0.8}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>No Music Found</Text>
        <Text style={styles.emptyText}>Add audio files (.mp3, .m4a, .flac) to your Dropbox App Folder and pull down to refresh.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top + 8, 16) }]}>
        <View style={styles.titleRow}>
          <Text style={styles.headerTitle}>Library</Text>
          <View style={styles.statusBadge}>
            <DropboxLogoIcon size={14} color="#0061FE" />
            <Text style={styles.statusText}>Connected</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} activeOpacity={0.7}>
          <SignOutIcon size={16} color="#A1A1AA" />
        </TouchableOpacity>
      </View>

      {/* Search & Stats Bar */}
      {library.length > 0 && (
        <View style={styles.controlsBar}>
          <View style={styles.searchBox}>
            <SearchIcon size={18} color="#71717A" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search tracks..."
              placeholderTextColor="#71717A"
              value={searchQuery}
              onChangeText={setSearchQuery}
              clearButtonMode="while-editing"
            />
          </View>
          <View style={styles.statsPill}>
            <Text style={styles.statsText}>{filteredLibrary.length} tracks • {totalSizeMb} MB</Text>
          </View>
        </View>
      )}

      {/* Track List */}
      {isLoadingLibrary ? (
        <View style={styles.center}>
          <ActivityIndicator color="#7C3AED" size="large" />
        </View>
      ) : (
        <FlatList
          data={filteredLibrary}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 88 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#7C3AED" />}
          ListEmptyComponent={renderEmptyOrError}
          renderItem={({ item }) => (
            <SongListItem
              file={item}
              isActive={activeItem?.mediaId === item.id}
              onPress={() => handlePlay(item)}
            />
          )}
        />
      )}

      <MiniPlayer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    color: '#F4F4F5',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#18181B',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  statusText: {
    color: '#A1A1AA',
    fontSize: 11,
    fontWeight: '600',
  },
  signOutBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  controlsBar: {
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 10,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18181B',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#27272A',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: '#F4F4F5',
    fontSize: 14,
    padding: 0,
  },
  statsPill: {
    alignSelf: 'flex-start',
  },
  statsText: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '600',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    color: '#F4F4F5',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  errorText: {
    color: '#F87171',
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 14,
  },
  retryButton: {
    marginTop: 16,
    backgroundColor: '#7C3AED',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyText: {
    color: '#71717A',
    textAlign: 'center',
    lineHeight: 20,
    fontSize: 13,
  },
});