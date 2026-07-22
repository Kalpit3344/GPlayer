import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signIn, isSignedIn } from '../auth/dropboxAuth';

export default function LoginScreen() {
  const navigation = useNavigation<any>();
  const [checking, setChecking] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    if (isSignedIn()) {
      navigation.replace('Library');
    } else {
      setChecking(false);
    }
  }, []);

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
        <ActivityIndicator color="#8B5CF6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.brand}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>G</Text>
        </View>
        <Text style={styles.title}>GPlayer</Text>
        <Text style={styles.subtitle}>Your music, streamed from Dropbox</Text>
      </View>

      <TouchableOpacity style={styles.signInButton} onPress={handleSignIn} disabled={signingIn}>
        {signingIn ? <ActivityIndicator color="#fff" /> : <Text style={styles.signInText}>Connect Dropbox</Text>}
      </TouchableOpacity>

      <Text style={styles.footnote}>Your music stays in your own Dropbox. GPlayer only streams it.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  center: { flex: 1, backgroundColor: '#121212', justifyContent: 'center', alignItems: 'center' },
  brand: { alignItems: 'center', marginBottom: 64 },
  logoCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#8B5CF6', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  logoText: { color: '#fff', fontSize: 32, fontWeight: '700' },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: '#9CA3AF', fontSize: 14, textAlign: 'center' },
  signInButton: { backgroundColor: '#8B5CF6', paddingVertical: 16, paddingHorizontal: 32, borderRadius: 28, width: '100%', alignItems: 'center' },
  signInText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  footnote: { color: '#6B7280', fontSize: 12, textAlign: 'center', marginTop: 24, paddingHorizontal: 16 },
});