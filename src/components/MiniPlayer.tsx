import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TrackPlayer, { useActiveMediaItem, useIsPlaying, useProgress } from '@rntp/player';
import { MusicNoteIcon, PlayIcon, PauseIcon } from './Icons';

export default function MiniPlayer() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const activeItem = useActiveMediaItem();
  const isPlaying = useIsPlaying();
  const progress = useProgress();

  if (!activeItem) return null;

  const percent = progress.duration > 0 ? (progress.position / progress.duration) * 100 : 0;

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('Player')}
      >
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${percent}%` }]} />
        </View>

        <View style={styles.content}>
          <View style={styles.artPlaceholder}>
            <MusicNoteIcon size={20} color="#A78BFA" />
          </View>
          <View style={styles.textBlock}>
            <Text style={styles.title} numberOfLines={1}>{activeItem.title ?? 'Unknown title'}</Text>
            <Text style={styles.artist} numberOfLines={1}>{activeItem.artist ?? 'GPlayer'}</Text>
          </View>
          <TouchableOpacity
            style={styles.playButton}
            onPress={() => (isPlaying ? TrackPlayer.pause() : TrackPlayer.play())}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            {isPlaying ? <PauseIcon size={18} color="#F4F4F5" /> : <PlayIcon size={18} color="#F4F4F5" />}
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: '#18181BE6',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#27272A',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  progressTrack: {
    height: 2,
    backgroundColor: '#27272A',
    width: '100%',
  },
  progressFill: {
    height: 2,
    backgroundColor: '#7C3AED',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  artPlaceholder: {
    width: 42,
    height: 42,
    borderRadius: 8,
    backgroundColor: '#27272A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    color: '#F4F4F5',
    fontSize: 14,
    fontWeight: '600',
  },
  artist: {
    color: '#A1A1AA',
    fontSize: 12,
    marginTop: 2,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#27272A',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});