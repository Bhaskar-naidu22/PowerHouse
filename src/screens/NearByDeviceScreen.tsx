import { FlatList, PermissionsAndroid, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import BleManager from 'react-native-ble-manager'
import { useNavigation, useRoute } from '@react-navigation/native'
import ScanningPulse from '../components/ScanningPulse'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import DeviceCard from '../components/DeviceCard'

const NearByDeviceScreen = () => {
    const route = useRoute<any>()
    const { sensorType } = route.params
    const navigation = useNavigation<any>()
    const [scanning, setScanning] = useState<boolean>(true)
    const [devices, setDevices] = useState<any[] | null>(null)


    useEffect(() => {
        BleManager.start()
        requestPermissions();
        const discoverListener = BleManager.onDiscoverPeripheral((device: any) => {
            if (device.name ) {
                setDevices((prevDevices) => {
                    // Check if we already added this device to the list to prevent duplicates
                    const exists = prevDevices?.some(d => d.id === device.id);
                    if (!exists) {
                        // console.log("Device Found: ", device)
                        return [...(prevDevices ?? []), device];
                    }
                    return prevDevices;
                });
            }
        })
        const stopListener = BleManager.onStopScan(() => {
            setScanning(false);
            console.log("Scanning Stopped")
        })

        return () => {
            if (discoverListener) discoverListener.remove();
            if (stopListener) stopListener.remove();
        }
    }, []);

    const handleBluetoothScan = () => {
        if (!scanning) {
            setScanning(true);
            requestPermissions()
        }
    }

    const requestPermissions = async () => {
        try {
            await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
            ])
            console.log('Permissions requested')
        } catch (e) {
            console.warn('Permission error:', e)
        }

        try {
            await BleManager.enableBluetooth()
        } catch (e) {
            console.warn(e)
            return
        }

        startScanning()
    }

    const startScanning = async () => {

        setDevices([]) // Clear previous devices
        setScanning(true)
        console.log("scanning started")

        await BleManager.scan({
            serviceUUIDs: ["83ab48e1-32c0-42cf-95fc-5c188f7b9935"],
            seconds: 5,
            allowDuplicates: false,
        })

    }
    return (
        <View style={[styles.container, { paddingTop: useSafeAreaInsets().top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Nearby Devices</Text>
                <Text style={styles.headerTitle}></Text>

            </View>

            <TouchableOpacity style={styles.scanSection} onPress={handleBluetoothScan}>
                <ScanningPulse scanning={scanning} onRescan={requestPermissions} />

            </TouchableOpacity>

            <FlatList data={devices}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
                ListHeaderComponent={() => (
                    <Text style={styles.sectionTitle}>
                        Available {sensorType.label} Sensors: {devices?.length ?? 0}
                    </Text>
                )}
                ListEmptyComponent={() => (
                    <Text style={styles.noDevicesText}>
                        Make Sure your {sensorType.label} sensor is powered on and in range. {'\n'}
                        Tap the scan button above to refresh.
                    </Text>
                )}
                renderItem={({ item }) => (
                    <DeviceCard device={item} sensortype={sensorType} onConnect={async (id) => {
                        try {
                            await BleManager.connect(id);
                            console.log("Connected to device with id: ", id);
                            navigation.navigate("DeviceDetails", { item, sensorType })
                        } catch (error) {
                            console.log("Connection error", error);
                        }
                    }} />

                )} />
        </View>
    )
}

export default NearByDeviceScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F8',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
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
    avatarCircle: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#3B5BDB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInitial: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 15,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    scanSection: {
        alignItems: 'center',
        marginTop: 28,
        marginBottom: 36,
    },
    scanWrapper: {
        width: 110,
        height: 110,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pulseRing: {
        position: 'absolute',
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: '#3B5BDB',
    },
    pulseRingInner: {
        width: 95,
        height: 95,
        borderRadius: 47.5,
    },
    scanCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
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
    },
    scanningLabel: {
        marginTop: 16,
        fontSize: 16,
        color: '#9CA3AF',
    },
    sensorTypeHighlight: {
        color: '#3B5BDB',
        fontWeight: '700',
    },
    noDevicesText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '500',
        color: '#9CA3AF',
        textAlign: 'center',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#6B7280',
        letterSpacing: 1.2,
        marginBottom: 12,
    },
    troubleshootBanner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        backgroundColor: '#3B5BDB',
        borderRadius: 14,
        padding: 16,
        marginTop: 20,
    },
    troubleshootIcon: {
        fontSize: 18,
        color: '#fff',
        marginTop: 1,
    },
    troubleshootTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    troubleshootBody: {
        fontSize: 13,
        color: '#C7D2FE',
        lineHeight: 19,
    },
});