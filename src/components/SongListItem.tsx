import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { DropboxFile } from '../types';

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

export default function SongListItem({ file, isActive, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconBox, isActive && styles.iconBoxActive]}>
        <Text style={styles.iconText}>♪</Text>
      </View>
      <View style={styles.textBlock}>
        <Text style={[styles.title, isActive && styles.titleActive]} numberOfLines={1}>
          {displayTitle(file.name)}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {formatSize(file.size)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 20 },
  iconBox: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#1F2937', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  iconBoxActive: { backgroundColor: '#8B5CF6' },
  iconText: { color: '#9CA3AF', fontSize: 18 },
  textBlock: { flex: 1 },
  title: { color: '#fff', fontSize: 15, fontWeight: '500' },
  titleActive: { color: '#8B5CF6' },
  meta: { color: '#6B7280', fontSize: 12, marginTop: 2 },
});