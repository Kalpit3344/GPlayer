import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { DropboxFile } from '../types';
import { MusicNoteIcon } from './Icons';

interface Props {
  file: DropboxFile;
  isActive: boolean;
  onPress: () => void;
}

function formatSize(bytes: number): string {
  if (!bytes) return '';
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
}

function displayTitle(name: string): string {
  return name.replace(/\.[^/.]+$/, '');
}

function getFormatExt(name: string): string {
  const match = name.match(/\.([^/.]+)$/);
  return match ? match[1].toUpperCase() : 'AUDIO';
}

export default function SongListItem({ file, isActive, onPress }: Props) {
  const format = getFormatExt(file.name);

  return (
    <TouchableOpacity
      style={[styles.row, isActive && styles.rowActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconBox, isActive && styles.iconBoxActive]}>
        {isActive ? (
          <View style={styles.equalizer}>
            <View style={[styles.eqBar, { height: 14 }]} />
            <View style={[styles.eqBar, { height: 8 }]} />
            <View style={[styles.eqBar, { height: 18 }]} />
          </View>
        ) : (
          <MusicNoteIcon size={20} color="#71717A" />
        )}
      </View>

      <View style={styles.textBlock}>
        <Text style={[styles.title, isActive && styles.titleActive]} numberOfLines={1}>
          {displayTitle(file.name)}
        </Text>
        <View style={styles.metaRow}>
          <View style={[styles.badge, isActive && styles.badgeActive]}>
            <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>{format}</Text>
          </View>
          <Text style={styles.metaText}>{formatSize(file.size)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 3,
    borderRadius: 12,
    backgroundColor: '#09090B',
  },
  rowActive: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#18181B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  iconBoxActive: {
    backgroundColor: '#7C3AED20',
    borderColor: '#7C3AED60',
  },
  equalizer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    height: 18,
  },
  eqBar: {
    width: 3,
    backgroundColor: '#A78BFA',
    borderRadius: 1.5,
  },
  textBlock: {
    flex: 1,
  },
  title: {
    color: '#F4F4F5',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  titleActive: {
    color: '#A78BFA',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: '#27272A',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeActive: {
    backgroundColor: '#7C3AED40',
  },
  badgeText: {
    color: '#A1A1AA',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  badgeTextActive: {
    color: '#C4B5FD',
  },
  metaText: {
    color: '#71717A',
    fontSize: 12,
  },
});