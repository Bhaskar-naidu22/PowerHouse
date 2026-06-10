import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, BackHandler, Alert } from 'react-native'
import React, { useEffect, useRef } from 'react'
import BleManager from 'react-native-ble-manager'
import { useNavigation, useRoute } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { JSONtoBytes, stringToBytes } from '../utils/blePayload'

const SERVICE_UUID = "83ab48e1-32c0-42cf-95fc-5c188f7b9935";
const HASH_WRITE_CHARACTERISTIC_UUID = "83ab48e2-32c0-42cf-95fc-5c188f7b9935";
const NOTIFY_CHARACTERISTIC_UUID = "83ab48e3-32c0-42cf-95fc-5c188f7b9935";
const WRITE_CHARACTERISTIC_UUID = "83ab48e4-32c0-42cf-95fc-5c188f7b9935";
const SENSORID = "550e8400-e29b-41d4-a716-446655440000"
const FlatID = "550e8400-e29b-41d4-a716-446655440001"
const buildingID = "550e8400-e29b-41d4-a716-446655440002"

const DeviceDetails = () => {
    const route = useRoute<any>()
    const navigation = useNavigation<any>()
    const insets = useSafeAreaInsets()
    const { item: device, sensorType } = route.params;
    const responseResolverRef = useRef<((value: string) => void) | null>(null);

    useEffect(() => {
        let disconnectListener: any;
        let backHandler: any;
        let updateListener: any;
        const setupDevice = async () => {
            try {
                disconnectListener = BleManager.onDisconnectPeripheral((data) => {
                    console.log("Device disconnected: ", data.peripheral);
                    navigation.goBack();
                });
                BleManager.retrieveServices(device.id)
                    .catch((err) => {
                        console.error('Service retrieval error:', err);
                        Alert.alert('Error', 'Failed to retrieve device services. Please try again.', [
                            { text: 'OK', onPress: () => navigation.goBack() },
                        ]);
                    })
                // Handle hardware back button on Android
                backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
                    handleGoBack();
                    return true; // prevents default back behavior
                });
                await BleManager.startNotification(device.id, SERVICE_UUID, NOTIFY_CHARACTERISTIC_UUID);
                updateListener = BleManager.onDidUpdateValueForCharacteristic(((data: any) => {
                    // Handle updated characteristic values
                    const response = String.fromCharCode(...data.value);
                    if (responseResolverRef.current) {
                        responseResolverRef.current(response);
                        responseResolverRef.current = null; // reset after handling
                    }
                }));
            }
            catch (err) {
                console.error('Setup error:', err);
                Alert.alert('Connection Error', 'Failed to connect to the device. Please try again.', [
                    { text: 'OK', onPress: () => navigation.goBack() },
                ]);
            }
        }
        setupDevice();
        return () => {
            if (disconnectListener) {
                disconnectListener.remove();
            }
            if (backHandler) {
                backHandler.remove();
            }
            if (updateListener) {
                updateListener.remove();
            }
            (async () => {
                await BleManager.stopNotification(device.id, SERVICE_UUID, NOTIFY_CHARACTERISTIC_UUID)
                    .catch((err) => console.error('Stop notification error:', err))
                await BleManager.disconnect(device.id)
                    .catch((err) => console.warn("Disconnect error:", err))
            })();
        };
    }, []);

    const waitForResponse = (timeoutMs: number = 5000): Promise<string> => {
        return new Promise((resolve, reject) => {
            // ✅ Store resolve so the listener above can call it
            responseResolverRef.current = resolve;

            // ✅ Timeout so it doesn't hang forever
            setTimeout(() => {
                if (responseResolverRef.current) {
                    responseResolverRef.current = null;
                    reject(new Error('Response timeout'));
                }
            }, timeoutMs);
        });
    };
    const handleOnPressSave = async () => {
        const hashKey = "6988"
        await BleManager.write(
            device.id,
            SERVICE_UUID,
            HASH_WRITE_CHARACTERISTIC_UUID,
            stringToBytes(hashKey)
        )
        const response = await waitForResponse(5000)
        if (response.trim() !== `{"auth":1}`) {
            Alert.alert('Authentication Failed', 'Device rejected the hash key. Please try again.');
            return;
        }
        const payload = JSON.stringify({ sensorId: SENSORID, flatId: FlatID, buildingId: buildingID })
        console.log("Payload to send: ", payload)
        await BleManager.write(
            device.id,
            SERVICE_UUID,
            WRITE_CHARACTERISTIC_UUID,
            JSONtoBytes({ sensorId: SENSORID, flatId: FlatID, buildingId: buildingID })
        )
        const response2 = await waitForResponse(5000)
        debugger
        if (response2.trim() !== `{"config":1}`) {
            Alert.alert('Configuration Failed', 'Device rejected the configuration data. Please try again.');
            return;
        }
    };

    const handleGoBack = () => {
        BleManager.disconnect(device.id)
            .catch((err) => console.warn("Disconnect error:", err))
            .finally(() => navigation.goBack());
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>

            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Device Details</Text>
                <View style={{ width: 22 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Device Identity Card */}
                <View style={styles.deviceCard}>
                    <View style={styles.imageWrapper}>
                        <Image
                            source={sensorType.image}
                            style={styles.sensorImage}
                            resizeMode="contain"
                        />
                    </View>
                    <View style={styles.statusBadge}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>Connected</Text>
                    </View>
                    <Text style={styles.sensorName}>{sensorType.label} Sensor</Text>
                    <View style={styles.macBadge}>
                        <Text style={styles.macText}>ID: {device.id}</Text>
                    </View>
                </View>

                {/* Flat Details Card */}
                <View style={styles.sectionCard}>
                    <Text style={styles.sectionTitle}>Flat Details</Text>

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Building</Text>
                        <Text style={styles.detailValue}>PowerHouse Apartments</Text>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Block</Text>
                        <Text style={styles.detailValue}>A</Text>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Flat Number</Text>
                        <Text style={styles.detailValue}>101</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Footer Button */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
                <TouchableOpacity
                    style={styles.saveButton}
                    activeOpacity={0.85}
                    onPress={handleOnPressSave}>
                    <Text style={styles.saveButtonText}>Save & Configure Sensor</Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}

export default DeviceDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F8',
        marginTop: 10,
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginBottom: 10,
    },
    backArrow: {
        fontSize: 22,
        color: '#3B5BDB',
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#3B5BDB',
    },

    // Scroll
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
        gap: 16,
    },

    // Device identity card
    deviceCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 28,
        paddingHorizontal: 16,
        alignItems: 'center',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    imageWrapper: {
        width: 100,
        height: 100,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    sensorImage: {
        width: 100,
        height: 100,
    },
    connectedLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#22C55E',
        letterSpacing: 1,
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    sensorName: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 10,
    },
    macBadge: {
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        paddingVertical: 5,
        paddingHorizontal: 14,
    },
    macText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: '500',
        letterSpacing: 0.5,
    },

    // Section cards
    sectionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        paddingHorizontal: 16,
        paddingVertical: 8,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#9CA3AF',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        paddingVertical: 12,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 13,
    },
    detailLabel: {
        fontSize: 14,
        color: '#6B7280',
        fontWeight: '500',
    },
    detailValue: {
        fontSize: 14,
        color: '#111827',
        fontWeight: '600',
        maxWidth: '55%',
        textAlign: 'right',
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
    },

    // Status badge
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: '#DCFCE7',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginBottom: 12,
    },
    statusDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: '#22C55E',
    },
    statusText: {
        fontSize: 15,
        color: '#16A34A',
        fontWeight: '600',
    },

    // Footer
    footer: {
        paddingHorizontal: 16,
        paddingTop: 12,
        backgroundColor: '#F0F2F8',
    },
    saveButton: {
        backgroundColor: '#3B5BDB',
        borderRadius: 30,
        paddingVertical: 16,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#3B5BDB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
})