import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TrackPlayer, { useActiveMediaItem, useIsPlaying, useProgress } from '@rntp/player';
import { ChevronDownIcon, DiscIcon, PlayIcon, PauseIcon, SkipNextIcon, SkipPrevIcon } from '../components/Icons';

function formatTime(seconds: number): string {
  if (!seconds || Number.isNaN(seconds) || seconds < 0) return '0:00';
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

  const percent = progress.duration > 0 ? Math.min(100, Math.max(0, (progress.position / progress.duration) * 100)) : 0;

  function handleSeek(x: number) {
    if (barWidth === 0 || progress.duration === 0) return;
    const ratio = Math.max(0, Math.min(1, x / barWidth));
    TrackPlayer.seekTo(ratio * progress.duration);
  }

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top + 8, 16), paddingBottom: Math.max(insets.bottom + 16, 24) }]}>
      {/* Header Bar */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <ChevronDownIcon size={28} color="#F4F4F5" />
        </TouchableOpacity>
        <Text style={styles.headerLabel}>NOW PLAYING</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Album Artwork Card */}
      <View style={styles.artworkSection}>
        <View style={styles.artworkCard}>
          <DiscIcon size={120} color="#18181B" />
        </View>
      </View>

      {/* Track Info */}
      <View style={styles.infoSection}>
        <Text style={styles.title} numberOfLines={1}>{activeItem?.title ?? 'No Track Playing'}</Text>
        <Text style={styles.artist} numberOfLines={1}>{activeItem?.artist ?? 'GPlayer Stream'}</Text>
      </View>

      {/* Seek Progress Bar */}
      <View style={styles.progressSection}>
        <View style={styles.progressBarContainer} onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}>
          <Pressable style={styles.progressBarTrack} onPress={(e) => handleSeek(e.nativeEvent.locationX)}>
            <View pointerEvents="none" style={[styles.progressBarFill, { width: `${percent}%` }]} />
            <View pointerEvents="none" style={[styles.progressThumb, { left: `${percent}%` }]} />
          </Pressable>
        </View>

        <View style={styles.timeRow}>
          <Text style={styles.timeText}>{formatTime(progress.position)}</Text>
          <Text style={styles.timeText}>{formatTime(progress.duration)}</Text>
        </View>
      </View>

      {/* Control Deck */}
      <View style={styles.controlsSection}>
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => { try { TrackPlayer.skipToPrevious(); } catch { } }}
          activeOpacity={0.7}
        >
          <SkipPrevIcon size={28} color="#F4F4F5" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.playPauseBtn}
          onPress={() => (isPlaying ? TrackPlayer.pause() : TrackPlayer.play())}
          activeOpacity={0.85}
        >
          {isPlaying ? <PauseIcon size={32} color="#FFFFFF" /> : <PlayIcon size={32} color="#FFFFFF" />}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => { try { TrackPlayer.skipToNext(); } catch { } }}
          activeOpacity={0.7}
        >
          <SkipNextIcon size={28} color="#F4F4F5" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  headerLabel: {
    color: '#71717A',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  artworkSection: {
    alignItems: 'center',
    marginVertical: 16,
  },
  artworkCard: {
    width: '88%',
    aspectRatio: 1,
    borderRadius: 24,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.4,
    shadowRadius: 32,
    elevation: 16,
  },
  infoSection: {
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: '#F4F4F5',
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: -0.3,
    marginBottom: 6,
    textAlign: 'center',
  },
  artist: {
    color: '#A1A1AA',
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  progressSection: {
    width: '100%',
  },
  progressBarContainer: {
    width: '100%',
    height: 24,
    justifyContent: 'center',
  },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#27272A',
    position: 'relative',
  },
  progressBarFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#7C3AED',
  },
  progressThumb: {
    position: 'absolute',
    top: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FFFFFF',
    marginLeft: -7,
    borderWidth: 2,
    borderColor: '#7C3AED',
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  timeText: {
    color: '#71717A',
    fontSize: 12,
    fontWeight: '600',
  },
  controlsSection: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 12,
  },
  skipBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  playPauseBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
});