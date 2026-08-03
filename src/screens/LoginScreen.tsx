import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { signIn, isSignedIn } from '../auth/dropboxAuth';
import { DiscIcon, DropboxLogoIcon } from '../components/Icons';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [checking, setChecking] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (isSignedIn()) {
      navigation.replace('Library');
    } else {
      setChecking(false);
    }
  }, [navigation]);

  async function handleSignIn() {
    setSigningIn(true);
    try {
      await signIn();
      navigation.replace('Library');
    } catch (err: any) {
      Alert.alert('Sign-in failed', err?.message ?? 'Please try again.');
    } finally {
      setSigningIn(false);
    }
  }

  if (checking) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#7C3AED" size="large" />
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }]}>
      <View style={styles.content}>
        <View style={styles.heroSection}>
          <View style={styles.discGlow}>
            <DiscIcon size={96} color="#18181B" />
          </View>
          <Text style={styles.brandTitle}>GPlayer</Text>
          <Text style={styles.brandSubtitle}>Your Cloud Music, Streamed Effortlessly</Text>
        </View>

        <View style={styles.featuresRow}>
          <View style={styles.featurePill}>
            <Text style={styles.featureText}>⚡ Instant Stream</Text>
          </View>
          <View style={styles.featurePill}>
            <Text style={styles.featureText}>📁 App Folder Sync</Text>
          </View>
          <View style={styles.featurePill}>
            <Text style={styles.featureText}>🎵 Lossless Audio</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.signInButton}
          onPress={handleSignIn}
          disabled={signingIn}
          activeOpacity={0.85}
        >
          {signingIn ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <View style={styles.buttonContent}>
              <DropboxLogoIcon size={20} color="#FFFFFF" />
              <Text style={styles.signInText}>Connect to Dropbox</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.footnote}>Your audio files remain safely in your Dropbox. GPlayer streams on demand without taking up local phone storage.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#09090B',
    paddingHorizontal: 28,
    justifyContent: 'space-between',
  },
  center: {
    flex: 1,
    backgroundColor: '#09090B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 36,
  },
  discGlow: {
    marginBottom: 24,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  brandTitle: {
    color: '#F4F4F5',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  brandSubtitle: {
    color: '#A1A1AA',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  featurePill: {
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  featureText: {
    color: '#D4D4D8',
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
  },
  signInButton: {
    backgroundColor: '#7C3AED',
    paddingVertical: 16,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  signInText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  footnote: {
    color: '#52525B',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 18,
    lineHeight: 18,
    paddingHorizontal: 8,
  },
});