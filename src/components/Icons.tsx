import React from 'react';
import { View, StyleSheet } from 'react-native';

interface IconProps {
  size?: number;
  color?: string;
}

export function PlayIcon({ size = 24, color = '#FFFFFF' }: IconProps) {
  const width = size;
  const height = size;
  return (
    <View style={{ width, height, justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={{
          width: 0,
          height: 0,
          borderStyle: 'solid',
          borderLeftWidth: size * 0.55,
          borderTopWidth: size * 0.35,
          borderBottomWidth: size * 0.35,
          borderLeftColor: color,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          marginLeft: size * 0.1,
        }}
      />
    </View>
  );
}

export function PauseIcon({ size = 24, color = '#FFFFFF' }: IconProps) {
  const barWidth = Math.max(3, Math.floor(size * 0.22));
  const barHeight = Math.floor(size * 0.65);
  const gap = Math.max(3, Math.floor(size * 0.18));
  return (
    <View style={{ width: size, height: size, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: barWidth, height: barHeight, backgroundColor: color, borderRadius: 1.5 }} />
      <View style={{ width: gap }} />
      <View style={{ width: barWidth, height: barHeight, backgroundColor: color, borderRadius: 1.5 }} />
    </View>
  );
}

export function SkipNextIcon({ size = 24, color = '#FFFFFF' }: IconProps) {
  const triWidth = size * 0.38;
  const triHeight = size * 0.3;
  const barWidth = 3;
  const barHeight = size * 0.55;
  return (
    <View style={{ width: size, height: size, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={{
          width: 0,
          height: 0,
          borderStyle: 'solid',
          borderLeftWidth: triWidth,
          borderTopWidth: triHeight,
          borderBottomWidth: triHeight,
          borderLeftColor: color,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
        }}
      />
      <View
        style={{
          width: 0,
          height: 0,
          borderStyle: 'solid',
          borderLeftWidth: triWidth,
          borderTopWidth: triHeight,
          borderBottomWidth: triHeight,
          borderLeftColor: color,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          marginLeft: -size * 0.1,
        }}
      />
      <View style={{ width: barWidth, height: barHeight, backgroundColor: color, borderRadius: 1, marginLeft: 2 }} />
    </View>
  );
}

export function SkipPrevIcon({ size = 24, color = '#FFFFFF' }: IconProps) {
  const triWidth = size * 0.38;
  const triHeight = size * 0.3;
  const barWidth = 3;
  const barHeight = size * 0.55;
  return (
    <View style={{ width: size, height: size, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: barWidth, height: barHeight, backgroundColor: color, borderRadius: 1, marginRight: 2 }} />
      <View
        style={{
          width: 0,
          height: 0,
          borderStyle: 'solid',
          borderRightWidth: triWidth,
          borderTopWidth: triHeight,
          borderBottomWidth: triHeight,
          borderRightColor: color,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
        }}
      />
      <View
        style={{
          width: 0,
          height: 0,
          borderStyle: 'solid',
          borderRightWidth: triWidth,
          borderTopWidth: triHeight,
          borderBottomWidth: triHeight,
          borderRightColor: color,
          borderTopColor: 'transparent',
          borderBottomColor: 'transparent',
          marginLeft: -size * 0.1,
        }}
      />
    </View>
  );
}

export function ChevronDownIcon({ size = 24, color = '#FFFFFF' }: IconProps) {
  const armSize = size * 0.35;
  const thickness = 2.5;
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={{
          width: armSize,
          height: armSize,
          borderBottomWidth: thickness,
          borderRightWidth: thickness,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
          marginTop: -size * 0.15,
        }}
      />
    </View>
  );
}

export function SearchIcon({ size = 20, color = '#A1A1AA' }: IconProps) {
  const circleSize = size * 0.55;
  const handleLength = size * 0.35;
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={{
          width: circleSize,
          height: circleSize,
          borderRadius: circleSize / 2,
          borderWidth: 2,
          borderColor: color,
          marginTop: -2,
          marginLeft: -2,
        }}
      />
      <View
        style={{
          position: 'absolute',
          width: handleLength,
          height: 2,
          backgroundColor: color,
          transform: [{ rotate: '45deg' }],
          bottom: 2,
          right: 2,
          borderRadius: 1,
        }}
      />
    </View>
  );
}

export function MusicNoteIcon({ size = 24, color = '#7C3AED' }: IconProps) {
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <View
        style={{
          width: size * 0.3,
          height: size * 0.25,
          borderRadius: (size * 0.25) / 2,
          backgroundColor: color,
          position: 'absolute',
          bottom: size * 0.15,
          left: size * 0.15,
        }}
      />
      <View
        style={{
          width: size * 0.3,
          height: size * 0.25,
          borderRadius: (size * 0.25) / 2,
          backgroundColor: color,
          position: 'absolute',
          bottom: size * 0.25,
          right: size * 0.15,
        }}
      />
      <View
        style={{
          width: 2.5,
          height: size * 0.5,
          backgroundColor: color,
          position: 'absolute',
          left: size * 0.38,
          bottom: size * 0.25,
        }}
      />
      <View
        style={{
          width: 2.5,
          height: size * 0.5,
          backgroundColor: color,
          position: 'absolute',
          right: size * 0.2,
          bottom: size * 0.35,
        }}
      />
      <View
        style={{
          height: 3,
          width: size * 0.45,
          backgroundColor: color,
          position: 'absolute',
          top: size * 0.2,
          left: size * 0.38,
          borderRadius: 1.5,
        }}
      />
    </View>
  );
}

export function DropboxLogoIcon({ size = 24, color = '#0061FE' }: IconProps) {
  const box = size * 0.32;
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', marginBottom: -box * 0.3 }}>
        <View style={[styles.box, { width: box, height: box, backgroundColor: color, transform: [{ rotate: '45deg' }], marginRight: 1 }]} />
        <View style={[styles.box, { width: box, height: box, backgroundColor: color, transform: [{ rotate: '45deg' }], marginLeft: 1 }]} />
      </View>
      <View style={{ flexDirection: 'row' }}>
        <View style={[styles.box, { width: box, height: box, backgroundColor: color, transform: [{ rotate: '45deg' }], marginRight: 1 }]} />
        <View style={[styles.box, { width: box, height: box, backgroundColor: color, transform: [{ rotate: '45deg' }], marginLeft: 1 }]} />
      </View>
    </View>
  );
}

export function DiscIcon({ size = 48, color = '#27272A' }: IconProps) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color,
        borderWidth: 3,
        borderColor: '#3F3F46',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <View
        style={{
          width: size * 0.35,
          height: size * 0.35,
          borderRadius: (size * 0.35) / 2,
          backgroundColor: '#18181B',
          borderWidth: 2,
          borderColor: '#7C3AED',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View style={{ width: size * 0.1, height: size * 0.1, borderRadius: (size * 0.1) / 2, backgroundColor: '#09090B' }} />
      </View>
    </View>
  );
}

export function SignOutIcon({ size = 18, color = '#7C3AED' }: IconProps) {
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ width: size * 0.5, height: size * 0.6, borderWidth: 2, borderColor: color, borderRightWidth: 0, borderRadius: 2 }} />
      <View style={{ position: 'absolute', right: 1, width: size * 0.45, height: 2, backgroundColor: color }} />
      <View
        style={{
          position: 'absolute',
          right: 1,
          width: 6,
          height: 6,
          borderTopWidth: 2,
          borderRightWidth: 2,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: 2,
  },
});
