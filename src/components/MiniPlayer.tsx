import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TrackPlayer, { useActiveMediaItem, useIsPlaying } from '@rntp/player';

export default function MiniPlayer() {
  const navigation = useNavigation<any>();
  const activeItem = useActiveMediaItem();
  const isPlaying = useIsPlaying();

  if (!activeItem) return null;

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.85}
      onPress={() => navigation.navigate('Player')}
    >
      <View style={styles.artPlaceholder}>
        <Text style={styles.artIcon}>♪</Text>
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.title} numberOfLines={1}>{activeItem.title ?? 'Unknown title'}</Text>
        <Text style={styles.artist} numberOfLines={1}>{activeItem.artist ?? ''}</Text>
      </View>
      <TouchableOpacity
        style={styles.playButton}
        onPress={() => (isPlaying ? TrackPlayer.pause() : TrackPlayer.play())}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Text style={styles.playIcon}>{isPlaying ? '⏸' : '▶'}</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1F2937', paddingVertical: 8, paddingHorizontal: 12, borderTopWidth: 1, borderTopColor: '#2D3748' },
  artPlaceholder: { width: 40, height: 40, borderRadius: 6, backgroundColor: '#374151', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  artIcon: { color: '#9CA3AF', fontSize: 16 },
  textBlock: { flex: 1 },
  title: { color: '#fff', fontSize: 14, fontWeight: '600' },
  artist: { color: '#9CA3AF', fontSize: 12, marginTop: 2 },
  playButton: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  playIcon: { color: '#fff', fontSize: 18 },
});