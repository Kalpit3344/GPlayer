import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TrackPlayer, { useActiveMediaItem, useIsPlaying, useProgress } from '@rntp/player';

function formatTime(seconds: number): string {
  if (!seconds || Number.isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function PlayerScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const activeItem = useActiveMediaItem();
  const isPlaying = useIsPlaying();
  const progress = useProgress();
  const [barWidth, setBarWidth] = useState(0);

  const percent = progress.duration > 0 ? (progress.position / progress.duration) * 100 : 0;

  function handleSeek(x: number) {
    if (barWidth === 0 || progress.duration === 0) return;
    const ratio = Math.max(0, Math.min(1, x / barWidth));
    TrackPlayer.seekTo(ratio * progress.duration);
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 16 }]}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backIcon}>⌄</Text>
      </TouchableOpacity>

      <View style={styles.artwork}>
        <Text style={styles.artworkIcon}>♪</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{activeItem?.title ?? 'Nothing playing'}</Text>
        <Text style={styles.artist} numberOfLines={1}>{activeItem?.artist ?? ''}</Text>
      </View>

      <View style={styles.progressBarContainer} onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}>
        <Pressable style={styles.progressBarTrack} onPress={(e) => handleSeek(e.nativeEvent.locationX)}>
          <View style={[styles.progressBarFill, { width: `${percent}%` }]} />
        </Pressable>
      </View>
      <View style={styles.timeRow}>
        <Text style={styles.timeText}>{formatTime(progress.position)}</Text>
        <Text style={styles.timeText}>{formatTime(progress.duration)}</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity onPress={() => TrackPlayer.skipToPrevious()}>
          <Text style={styles.controlIcon}>⏮</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.playButton} onPress={() => (isPlaying ? TrackPlayer.pause() : TrackPlayer.play())}>
          <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => TrackPlayer.skipToNext()}>
          <Text style={styles.controlIcon}>⏭</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingHorizontal: 28 },
  backButton: { alignSelf: 'flex-start', padding: 8, marginBottom: 12 },
  backIcon: { color: '#fff', fontSize: 28 },
  artwork: { width: '100%', aspectRatio: 1, borderRadius: 16, backgroundColor: '#1F2937', justifyContent: 'center', alignItems: 'center', marginBottom: 32 },
  artworkIcon: { color: '#4B5563', fontSize: 64 },
  info: { marginBottom: 24 },
  title: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 6 },
  artist: { color: '#9CA3AF', fontSize: 15 },
  progressBarContainer: { width: '100%', marginBottom: 6 },
  progressBarTrack: { height: 4, borderRadius: 2, backgroundColor: '#374151', overflow: 'hidden' },
  progressBarFill: { height: 4, backgroundColor: '#8B5CF6' },
  timeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 40 },
  timeText: { color: '#6B7280', fontSize: 12 },
  controls: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center' },
  controlIcon: { color: '#fff', fontSize: 28 },
  playButton: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#8B5CF6', justifyContent: 'center', alignItems: 'center' },
  playIcon: { color: '#fff', fontSize: 26 },
});