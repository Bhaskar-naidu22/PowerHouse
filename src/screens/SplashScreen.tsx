import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../components/AppText';
import ArrowRightIcon from '../components/icons/ArrowRightIcon';
import GradientText from '../components/GradientText';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BUTTON_WIDTH = Math.min(SCREEN_WIDTH - 48, 340);

export default function SplashScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();

  const goToLogin = () => {
    navigation.replace('LoginScreen');
  };

  return (
    <LinearGradient
      colors={['#3B5BDB', '#FFFFFF', '#FFFFFF']}
      locations={[0, 0.58, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.root}
    >
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + 40,
            paddingBottom: insets.bottom + 28,
          },
        ]}
      >
        <View style={styles.topSection}>
          <Image
            source={require('../assets/images/fieldlink-splash.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />
          <GradientText fontSize={35} colors={['#3B5BDB', '#93C5FD']}>
            FieldLink
          </GradientText>
          <Text style={styles.subtitle}>Smart Sensor Management</Text>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.getStartedBtn}
            activeOpacity={0.85}
            onPress={goToLogin}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
            <View style={styles.arrowCircle}>
              <ArrowRightIcon size={20} color="#3B5BDB" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
    paddingTop: 24,
  },
  heroImage: {
    width: 200,
    height: 250,
    marginBottom: 20,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
  },
  getStartedBtn: {
    width: BUTTON_WIDTH,
    backgroundColor: '#3B5BDB',
    borderRadius: 30,
    paddingVertical: 8,
    paddingLeft: 28,
    paddingRight: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  getStartedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  arrowCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
