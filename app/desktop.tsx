import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { useLanguage } from '@/hooks/useLanguage';

const { width } = Dimensions.get('window');

export default function DesktopView() {
  const { t } = useLanguage();
  return (
    <ScrollView contentContainerStyle={styles.page}>
      {/* Desktop panel */}
      <View style={styles.panel}>
        <Text style={styles.watermark}>ARENA-24</Text>

        <View style={styles.leftCol}>
          <Text style={styles.kicker}>ARENA-24</Text>
          <Text style={styles.h1}>{t('desktop.heading')}</Text>
          <Text style={styles.body}>{t('desktop.description')}</Text>

          <View style={styles.qrRow}>
            <Image
              source={{
                uri: 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=arena24.app',
              }}
              style={styles.qr}
            />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>10+</Text>
              <Text style={styles.badgeSub}>{t('desktop.eventsPerMonth')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.rightCol}>
          <View style={styles.blob} />
          <Image
            source={{ uri: 'https://i.imgur.com/H0h3m8S.png' }} // phone mock
            resizeMode='contain'
            style={styles.phone}
          />

          {/* Chips */}
          <View style={[styles.chip, { top: 12, right: 18 }]}>
            <View style={styles.dot} />
            <Text style={styles.chipText}>
              {t('desktop.reservationConfirmed')}
              {'\n'}Studio • 20:00
            </Text>
          </View>
          <View style={[styles.chip, { top: 56, right: 180 }]}>
            <View style={[styles.dot, { backgroundColor: '#8ED17C' }]} />
            <Text style={styles.chipText}>
              {t('desktop.reservationConfirmed')}
              {'\n'}La Stancu • 21:00
            </Text>
          </View>
        </View>
      </View>

      {/* Tablet panel */}
      <View style={[styles.panel, styles.tablet]}>
        <Text style={styles.watermarkSmall}>ARENA-24</Text>
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={styles.kicker}>ARENA-24</Text>
          <Text style={styles.h2}>{t('desktop.heading')}</Text>
          <Text style={styles.bodySmall}>{t('desktop.tabletDescription')}</Text>

          <View style={styles.tabletRow}>
            <Image
              source={{
                uri: 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=arena24.app',
              }}
              style={styles.qrSmall}
            />
            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={styles.tabletBlob} />
              <Image
                source={{ uri: 'https://i.imgur.com/H0h3m8S.png' }}
                resizeMode='contain'
                style={styles.phoneSmall}
              />
            </View>
          </View>

          <View
            style={[styles.badge, { alignSelf: 'flex-end', marginTop: 12 }]}
          >
            <Text style={styles.badgeText}>10+</Text>
            <Text style={styles.badgeSub}>{t('desktop.eventsPerMonth')}</Text>
          </View>

          <View
            style={[
              styles.chip,
              { position: 'absolute', bottom: 20, left: 24 },
            ]}
          >
            <View style={styles.dot} />
            <Text style={styles.chipText}>
              {t('desktop.reservationConfirmed')}
              {'\n'}EGO • 22:00
            </Text>
          </View>
          <View
            style={[
              styles.chip,
              { position: 'absolute', bottom: 20, left: 220 },
            ]}
          >
            <View style={[styles.dot, { backgroundColor: '#8ED17C' }]} />
            <Text style={styles.chipText}>
              {t('desktop.reservationConfirmed')}
              {'\n'}Studio • 18:30
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const CARD_W = Math.min(1100, width - 24);
const R = 28;

const styles = StyleSheet.create({
  page: {
    padding: 12,
    alignItems: 'center',
    gap: 24,
    backgroundColor: '#0f0f0f',
  },
  panel: {
    width: CARD_W,
    minHeight: 520,
    backgroundColor: '#ffffff',
    borderRadius: R,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  watermark: {
    position: 'absolute',
    top: 12,
    left: 18,
    fontSize: 96,
    letterSpacing: 8,
    color: '#F2F2F2',
    fontWeight: Platform.OS === 'ios' ? '800' : 'bold',
  },
  watermarkSmall: {
    position: 'absolute',
    top: 10,
    left: 16,
    fontSize: 56,
    letterSpacing: 6,
    color: '#F2F2F2',
    fontWeight: Platform.OS === 'ios' ? '800' : 'bold',
  },
  leftCol: {
    flex: 1.1,
    padding: 28,
    gap: 12,
    zIndex: 2,
  },
  rightCol: {
    flex: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  kicker: {
    fontSize: 14,
    color: '#777',
    fontWeight: '600',
  },
  h1: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '800',
    color: '#212121',
  },
  h2: {
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '800',
    color: '#212121',
    marginTop: 4,
  },
  body: {
    fontSize: 14,
    color: '#5C5C5C',
  },
  bodySmall: {
    fontSize: 13,
    color: '#5C5C5C',
    marginTop: 8,
  },
  qrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    marginTop: 16,
  },
  qr: { width: 160, height: 160 },
  qrSmall: { width: 140, height: 140 },
  badge: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#f1ece7',
    borderRadius: 14,
  },
  badgeText: { fontSize: 22, fontWeight: '800', color: '#7A4A2E' },
  badgeSub: { fontSize: 10, color: '#7A4A2E' },
  blob: {
    position: 'absolute',
    width: CARD_W * 0.62,
    height: 420,
    right: -40,
    borderTopLeftRadius: 420,
    borderBottomLeftRadius: 420,
    backgroundColor: '#EFEFEF',
  },
  phone: { width: 230, height: 420, zIndex: 2 },
  chip: {
    position: 'absolute',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  chipText: { fontSize: 11, color: '#333' },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4DA3FF' },
  tablet: {
    flexDirection: 'column',
    paddingBottom: 8,
  },
  tabletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 12,
  },
  tabletBlob: {
    width: '100%',
    height: 160,
    backgroundColor: '#EFEFEF',
    borderRadius: 18,
  },
  phoneSmall: { width: 120, height: 200, position: 'absolute', bottom: -18 },
});
