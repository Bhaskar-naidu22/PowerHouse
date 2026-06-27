import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, BackHandler, Alert } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import BleManager from 'react-native-ble-manager'
import { useNavigation, useRoute } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { stringToBytes } from '../utils/blePayload'
import { useSession } from '../contexts/SessionContexts'
import uuid from 'react-native-uuid'

const SERVICE_UUID = "83ab48e1-32c0-42cf-95fc-5c188f7b9935";
const HASH_WRITE_CHARACTERISTIC_UUID = "83ab48e2-32c0-42cf-95fc-5c188f7b9935";
const NOTIFY_CHARACTERISTIC_UUID = "83ab48e3-32c0-42cf-95fc-5c188f7b9935";
const WRITE_CHARACTERISTIC_UUID = "83ab48e4-32c0-42cf-95fc-5c188f7b9935";

const DeviceDetails = () => {
    const route = useRoute<any>()
    const navigation = useNavigation<any>()
    const { device, sensorType } = route.params;
    const responseResolverRef = useRef<((value: string) => void) | null>(null);
    const mountedRef = useRef(true);
    const isLeavingRef = useRef(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        let disconnectListener: any;
        let updateListener: any;
        let backHandler: any;

        const setupDevice = async () => {
            try {
                disconnectListener =
                    BleManager.onDisconnectPeripheral((data) => {

                        if (data.peripheral !== device.id) {
                            return;
                        }

                        if (isLeavingRef.current) {
                            return;
                        }

                        Alert.alert(
                            'Connection Lost',
                            'Device disconnected unexpectedly.',
                            [
                                {
                                    text: 'OK',
                                    onPress: () => navigation.goBack(),
                                },
                            ]
                        );
                    });

                backHandler = BackHandler.addEventListener(
                    'hardwareBackPress',
                    () => {
                        handleGoBack();
                        return true;
                    }
                );

                await BleManager.retrieveServices(device.id);

                await BleManager.startNotification(
                    device.id,
                    SERVICE_UUID,
                    NOTIFY_CHARACTERISTIC_UUID
                );

                updateListener =
                    BleManager.onDidUpdateValueForCharacteristic(
                        (data: any) => {

                            if (data.peripheral !== device.id) {
                                return;
                            }

                            if (!mountedRef.current) {
                                return;
                            }

                            const response =
                                String.fromCharCode(...data.value);

                            responseResolverRef.current?.(response);
                            responseResolverRef.current = null;
                        }
                    );
            } catch (err) {
                console.error(err);

                Alert.alert(
                    'Connection Error',
                    'Failed to communicate with device.',
                    [
                        {
                            text: 'OK',
                            onPress: () => navigation.goBack(),
                        },
                    ]
                );
            }
        };

        setupDevice();

        return () => {
            mountedRef.current = false;

            disconnectListener?.remove();
            updateListener?.remove();
            backHandler?.remove();

            responseResolverRef.current = null;

            BleManager.stopNotification(
                device.id,
                SERVICE_UUID,
                NOTIFY_CHARACTERISTIC_UUID
            ).catch(() => { });

            if (!isLeavingRef.current) {
                BleManager.disconnect(device.id).catch(() => { });
            }
        };
    }, []);

    const waitForResponse = (
        timeoutMs: number = 5000
    ): Promise<string> => {

        return new Promise((resolve, reject) => {

            const timer = setTimeout(() => {

                responseResolverRef.current = null;

                reject(new Error('Response timeout'));

            }, timeoutMs);

            responseResolverRef.current = (value: string) => {

                clearTimeout(timer);

                resolve(value);
            };
        });
    };
    const handleOnPressSave = async () => {
        if (saving) return;
        setSaving(true)
        try {
            // Step 1: Send hash key
            await BleManager.write(
                device.id,
                SERVICE_UUID,
                HASH_WRITE_CHARACTERISTIC_UUID,
                stringToBytes("6988")
            )

            const authResponse = await waitForResponse(5000)
            if (authResponse.trim() !== `{"auth":1}`) {
                Alert.alert('Authentication Failed', 'Device rejected the hash key.')
                return
            }

            // Step 2: Send config
            const sensorId = uuid.v4() as string  // ✅ fresh UUID per save
            const payload = JSON.stringify({
                sensorId,
                flatId: flatDetails?.FlatId,
                buildingId: flatDetails?.buildingId,
            })

            const bytes = stringToBytes(payload)
            await BleManager.requestMTU(device.id, 247)
            await BleManager.write(
                device.id,
                SERVICE_UUID,
                WRITE_CHARACTERISTIC_UUID,
                bytes,
                bytes.length
            )

            const configResponse = await waitForResponse(5000)
            if (configResponse.trim() !== `{"config":1}`) {
                Alert.alert('Configuration Failed', 'Device rejected the configuration.')
                return
            }

            isLeavingRef.current = true;

            navigation.replace("SuccessScreen", {
                sensorType, device
            });

        } catch (err: any) {
            // ✅ Handles timeout + any BLE write errors
            console.error('Save error:', err)
            Alert.alert(
                'Error',
                err.message === 'Response timeout'
                    ? 'Device did not respond in time. Please try again.'
                    : err.message ?? 'Something went wrong.'
            )
        } finally {
            setSaving(false)  // ✅ always runs
        }
    }

    const handleGoBack = async () => {

        if (isLeavingRef.current) {
            return;
        }

        isLeavingRef.current = true;

        try {

            await BleManager.stopNotification(
                device.id,
                SERVICE_UUID,
                NOTIFY_CHARACTERISTIC_UUID
            );

        } catch { }

        try {

            await BleManager.disconnect(device.id);

        } catch { }

        navigation.goBack();
    };

    const { flatDetails } = useSession();

    return (
        <SafeAreaView style={styles.container}>

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
                        <Text style={styles.detailValue}>{flatDetails?.buildingName}</Text>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Block</Text>
                        <Text style={styles.detailValue}>{flatDetails?.buildingId}</Text>
                    </View>
                    <View style={styles.divider} />

                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Flat Number</Text>
                        <Text style={styles.detailValue}>{flatDetails?.FlatName}</Text>
                    </View>
                </View>

            </ScrollView>

            {/* Footer Button */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.saveButton}
                    activeOpacity={0.85}
                    onPress={handleOnPressSave}
                    disabled={saving}
                >
                    <Text style={styles.saveButtonText}>
                        {saving
                            ? 'Configuring...'
                            : 'Save & Configure Sensor'}
                    </Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    )
}

export default DeviceDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F8',
        marginTop: 10,
        marginBottom: 20
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