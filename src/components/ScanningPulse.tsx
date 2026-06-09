import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ScanningPulseProps = {
    scanning: boolean;
    onRescan: () => void; // callback to restart scan
};

const ScanningPulse = ({ scanning, onRescan }: ScanningPulseProps) => {
    const pulse1 = useRef(new Animated.Value(1)).current;
    const pulse2 = useRef(new Animated.Value(1)).current;
    const opacity1 = useRef(new Animated.Value(0.6)).current;
    const opacity2 = useRef(new Animated.Value(0.3)).current;
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);

    useEffect(() => {
        if (scanning) {
            // Reset values before starting
            pulse1.setValue(1);
            pulse2.setValue(1);
            opacity1.setValue(0.6);
            opacity2.setValue(0.3);

            animationRef.current = Animated.loop(
                Animated.parallel([
                    Animated.sequence([
                        Animated.timing(pulse1, { toValue: 1.5, duration: 1000, useNativeDriver: true }),
                        Animated.timing(pulse1, { toValue: 1, duration: 1000, useNativeDriver: true }),
                    ]),
                    Animated.sequence([
                        Animated.timing(opacity1, { toValue: 0, duration: 1000, useNativeDriver: true }),
                        Animated.timing(opacity1, { toValue: 0.6, duration: 1000, useNativeDriver: true }),
                    ]),
                    Animated.sequence([
                        Animated.delay(400),
                        Animated.timing(pulse2, { toValue: 1.8, duration: 1000, useNativeDriver: true }),
                        Animated.timing(pulse2, { toValue: 1, duration: 1000, useNativeDriver: true }),
                    ]),
                    Animated.sequence([
                        Animated.delay(400),
                        Animated.timing(opacity2, { toValue: 0, duration: 1000, useNativeDriver: true }),
                        Animated.timing(opacity2, { toValue: 0.3, duration: 1000, useNativeDriver: true }),
                    ]),
                ]),
            );
            animationRef.current.start();
        } else {
            animationRef.current?.stop();
            Animated.parallel([
                Animated.timing(pulse1, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.timing(pulse2, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.timing(opacity1, { toValue: 0, duration: 300, useNativeDriver: true }),
                Animated.timing(opacity2, { toValue: 0, duration: 300, useNativeDriver: true }),
            ]).start();
        }
    }, [scanning]);

    return (
        <View style={styles.scanWrapper}>
            {scanning ? (
                // ── Pulsing rings shown while scanning ──
                <>
                    <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulse2 }], opacity: opacity2 }]} />
                    <Animated.View style={[styles.pulseRing, styles.pulseRingInner, { transform: [{ scale: pulse1 }], opacity: opacity1 }]} />
                    <View style={styles.scanCircle}>
                        <Text style={styles.scanIcon}>{'((·))'}</Text>
                        <Text style={styles.refreshLabel}>Scanning</Text>
                    </View>
                </>
            ) : (
                // ── Refresh button shown after scan ends ──
                <TouchableOpacity
                    style={styles.scanCircle}
                    activeOpacity={0.8}
                    onPress={onRescan}>
                    <Text style={styles.refreshIcon}>↻</Text>
                    <Text style={styles.refreshLabel}>Scan again</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default ScanningPulse;

const styles = StyleSheet.create({
    scanWrapper: {
        width: 150,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pulseRing: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#3B5BDB',
    },
    pulseRingInner: {
        width: 95,
        height: 95,
        borderRadius: 47.5,
    },
    scanCircle: {
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#3B5BDB',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
        shadowColor: '#3B5BDB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 8,
    },
    scanIcon: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
        letterSpacing: -1,
        lineHeight: 80,
    },
    refreshIcon: {
        color: '#fff',
        fontSize: 40,
        fontWeight: '700',
        lineHeight: 80,
    },
    refreshLabel: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '600',
        letterSpacing: 0.3,
        marginTop: 2,
    },
});