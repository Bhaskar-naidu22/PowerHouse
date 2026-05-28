import {
    PermissionsAndroid,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    ActivityIndicator
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import BleManager from 'react-native-ble-manager'
import { useNavigation } from '@react-navigation/native'


const BluetoothDevices = () => {
    const [isScanning, setIsScanning] = useState<boolean>(false)
    const [devices, setDevices] = useState<any[]>([])
    const scanTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
    const pollInterval = useRef<ReturnType<typeof setInterval> | null>(null)
    const navigation = useNavigation<any>()
    const [connectingId, setConnectingId] = useState<string | null>(null)

    useEffect(() => {
        BleManager.start({ showAlert: false })
            .then(() => console.log("Module initialized"))
            .catch((err) => console.error("Initialization error", err))

        return () => {
            if (scanTimeout.current) clearTimeout(scanTimeout.current)
            if (pollInterval.current) clearInterval(pollInterval.current)
        }
    }, [])

    const stopPolling = () => {
        if (pollInterval.current) {
            clearInterval(pollInterval.current)
            pollInterval.current = null
        }
        if (scanTimeout.current) {
            clearTimeout(scanTimeout.current)
            scanTimeout.current = null
        }
    }

    const stopScanning = () => {
        stopPolling()
        BleManager.stopScan()
            .then(() => {
                BleManager.getDiscoveredPeripherals().then((peripherals) => {
                    setDevices(peripherals)
                })
                setIsScanning(false)
            })
            .catch(() => setIsScanning(false))
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
            console.warn('Bluetooth enable skipped (may already be on):', e)
        }

        startScanning()
    }

    const startScanning = () => {
        console.log("start Scan triggered")

        if (isScanning) return

        setDevices([])
        setIsScanning(true)

        BleManager.scan({
            serviceUUIDs: [],
            seconds: 5,
            allowDuplicates: false,
            scanMode: 2,
            matchMode: 1,
            numberOfMatches: 3,
            reportDelay: 0,
            legacy: false,
        })
            .then(() => {
                console.log("Scan started")

                pollInterval.current = setInterval(() => {
                    BleManager.getDiscoveredPeripherals().then((peripherals) => {
                        if (peripherals.length > 0) {
                            setDevices([...peripherals])
                        }
                    })
                }, 1000)

                scanTimeout.current = setTimeout(() => {
                    stopPolling()
                    BleManager.getDiscoveredPeripherals().then((peripherals) => {
                        console.log('Scan complete — total:', peripherals.length)
                        peripherals.forEach((device, index) => {
                            console.log(`Device ${index + 1}:`, {
                                name: device.name || 'Unnamed',
                                id: device.id,
                                rssi: device.rssi,
                            })
                        })
                        // for (let i = 0; i < peripherals.length; i++) {
                        //     console.log(peripherals[i]);
                        // }
                        setDevices(peripherals)
                    })
                    setIsScanning(false)
                }, 11000)
            })
            .catch((err: any) => {
                console.error("Scan failed:", err)
                setIsScanning(false)
            })
    }
    const connectToDevice = async (device: any) => {
        try {
            setConnectingId(device.id)   // show spinner on this device
            console.log('Connecting to:', device.id)

            await BleManager.connect(device.id)
            console.log('Connected!')

            const services = await BleManager.retrieveServices(device.id)
            // console.log('Services retrieved', JSON.stringify(services, null, 2))

            setConnectingId(null)

            // ✅ Navigate to details screen passing device info
            navigation.navigate('DeviceDetails', { device })

        } catch (err) {
            console.error('Connection failed:', err)
            setConnectingId(null)
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>BLE Scanner</Text>
            <TouchableOpacity
                style={[styles.button, isScanning && styles.buttonStop]}
                onPress={isScanning ? stopScanning : requestPermissions}
            >
                <Text style={styles.buttonText}>
                    {isScanning ? 'Stop Scan' : 'Start BLE Scan'}
                </Text>
            </TouchableOpacity>
            <Text style={styles.count}>
                {isScanning
                    ? `Scanning... ${devices.length} found`
                    : `${devices.length} device(s) found`}
            </Text>
            <ScrollView style={styles.listContainer}>
                {devices.map((device) => (
                    <View key={device.id} style={styles.deviceItem}>
                        <View>
                            <Text style={styles.deviceName}>
                                {device.name || 'Unnamed Device'}
                            </Text>
                            <Text style={styles.deviceId}>{device.id}</Text>
                            <Text style={styles.deviceRssi}>RSSI: {device.rssi}</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.connectButton}
                            onPress={() => connectToDevice(device)}
                            disabled={connectingId !== null}
                        >
                            {connectingId === device.id ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.connectButtonText}>Connect</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
        </View>
    )
}

export default BluetoothDevices

const styles = StyleSheet.create({
    listContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 40,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonStop: {
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    connectButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 6,
        alignItems: 'center',
        minWidth: 90,
        justifyContent: 'center',
    },
    connectButtonConnecting: {
        backgroundColor: '#A2C4FF',  // faded while connecting
    },
    connectButtonText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
    },
    count: {
        textAlign: 'center',
        color: '#555',
        marginVertical: 10,
        fontSize: 14,
    },
    deviceItem: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    deviceName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    deviceId: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    deviceRssi: {
        fontSize: 12,
        color: '#007AFF',
        fontWeight: '600',
        marginTop: 4,
    },
})