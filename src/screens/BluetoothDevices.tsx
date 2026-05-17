// import { NativeEventEmitter, NativeModules, PermissionsAndroid, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
// import React, { useEffect, useRef, useState } from 'react'
// import BleManager from 'react-native-ble-manager'

// const bleManagerEmitter = new NativeEventEmitter(NativeModules.BleManager)
// const BluetoothDevices = () => {

//     // BleManager.start({ showAlert: false }).then(() => {
//     //     // Success code
//     //     console.log("Module initialized");
//     // });

//     const [isScanning, setIsScanning] = useState<boolean>(false)
//     const scanTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
//     const [devices, setDevices] = useState<any[]>([]);

//     useEffect(() => {
//     BleManager.start({ showAlert: false })
//         .then(() => console.log("Module initialized"))
//         .catch((err) => console.error("Initialization error", err))

//     const discoverListener = bleManagerEmitter.addListener(
//         'BleManagerDiscoverPeripheral',
//         (peripheral) => {
//             console.log('Discovered:', peripheral.id, peripheral.name)
//             setDevices((prev) => {
//                 if (!prev.some((d) => d.id === peripheral.id)) {
//                     return [...prev, peripheral]
//                 }
//                 return prev
//             })
//         }
//     )

//     const stopListener = bleManagerEmitter.addListener(
//         'BleManagerStopScan',
//         () => {
//             console.log('Scan stopped (event)')
//             // ✅ Clear safety timeout since event fired normally
//             if (scanTimeout.current) {
//                 clearTimeout(scanTimeout.current)
//                 scanTimeout.current = null
//             }
//             setIsScanning(false)
//         }
//     )

//     return () => {
//         discoverListener.remove()
//         stopListener.remove()
//         // ✅ Clean up timeout on unmount
//         if (scanTimeout.current) {
//             clearTimeout(scanTimeout.current)
//         }
//     }
// }, [])

// const stopScanning = () => {
//     // Clear safety timeout if it exists
//     if (scanTimeout.current) {
//         clearTimeout(scanTimeout.current)
//         scanTimeout.current = null
//     }
//     BleManager.stopScan()
//         .then(() => {
//             console.log('Scan stopped manually')
//             setIsScanning(false)  // ✅ force reset state
//         })
//         .catch((err) => {
//             console.error('Stop scan error:', err)
//             setIsScanning(false)  // ✅ reset even on error
//         })
// }

//     const requestPermissions = async () => {
//         const granted = await PermissionsAndroid.requestMultiple([
//             PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
//             PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
//             PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
//         ])
//         try {
//             await BleManager.enableBluetooth();
//         } catch (e) {
//             console.warn('Bluetooth not enabled by user');
//             return;
//         }
//         if (granted) {
//             console.log('permissions granted')
//             startScanning();
//         }
//     }

//     const startScanning = () => {
//         console.log("start Scan triggered")
//         if (isScanning) return; // Prevent double scanning

//         BleManager.checkState().then((state) => {
//             console.log('BLE state:', state); // should log "on"
//         });

//         setDevices([]); // Reset list for new scan
//         setIsScanning(true);

//         BleManager.scan({
//             serviceUUIDs: [],
//             seconds: 5,
//             allowDuplicates: true,
//             scanMode: 2,        // ✅ LOW_LATENCY — finds way more devices
//             matchMode: 1,       // ✅ AGGRESSIVE matching
//             numberOfMatches: 3, // ✅ MAX_ADVERTISEMENT
//             reportDelay: 0,
//             legacy: false
//         })
//             .then(() => {
//                 console.log("Scan successfully executed");
//                 // ✅ Poll every second to see if anything is found
//                 const pollInterval = setInterval(() => {
//                     BleManager.getDiscoveredPeripherals().then((peripherals) => {
//                         console.log('Polled peripherals count:', peripherals.length)
//                         if (peripherals.length > 0) {
//                             console.log('Found devices:', JSON.stringify(peripherals))
//                             setDevices(peripherals)
//                         }
//                     })
//                 }, 1000)
//                 // ✅ After 6s stop polling and check final result
//                 scanTimeout.current = setTimeout(() => {
//                     clearInterval(pollInterval)
//                     setIsScanning(false)

//                     BleManager.getDiscoveredPeripherals().then((peripherals) => {
//                         console.log('Final poll — total devices:', peripherals.length)
//                         setDevices(peripherals)
//                     })
//                 }, 6000)
//             })
//             .catch((err: any) => {
//                 console.error("Scan initialization failed:", err);
//                 setIsScanning(false);
//             });
//     }



//     return (
//         <View style={styles.container}>
//             <Text style={styles.title}>BluetoothDevices</Text>
//             <TouchableOpacity
//                 style={[styles.button, isScanning && styles.buttonStop]}
//                 onPress={isScanning ? stopScanning : requestPermissions}
//             >
//                 <Text style={styles.buttonText}>
//                     {isScanning ? 'Stop Scan' : 'Start BLE Scan'}
//                 </Text>
//             </TouchableOpacity>
//             <ScrollView style={styles.listContainer}>
//                 {devices.map((device) => (
//                     <View key={device.id} style={styles.deviceItem}>
//                         <Text style={styles.deviceName}>{device.name || 'Unnamed Device'}</Text>
//                         <Text style={styles.deviceId}>{device.id}</Text>
//                         <Text style={styles.deviceRssi}>RSSI: {device.rssi}</Text>
//                     </View>
//                 ))}
//             </ScrollView>
//         </View>
//     )
// }

// export default BluetoothDevices

// const styles = StyleSheet.create({
//     listContainer: {
//         flex: 1,
//     },
//     container: {
//         flex: 1,
//         padding: 24,
//         backgroundColor: '#f5f5f5',
//         justifyContent: 'center',
//     },
//     title: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         textAlign: 'center',
//         marginBottom: 20,
//     },
//     button: {
//         backgroundColor: '#007AFF',
//         padding: 14,
//         borderRadius: 8,
//         alignItems: 'center',
//     },
//     buttonDisabled: {
//         backgroundColor: '#A2C4FF',
//     },
//     buttonText: {
//         color: '#fff',
//         fontWeight: '600',
//         fontSize: 16,
//     },
//     buttonStop: {
//         backgroundColor: '#FF3B30',
//     },
//     deviceItem: {
//         backgroundColor: '#fff',
//         padding: 16,
//         borderRadius: 8,
//         marginBottom: 10,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 1 },
//         shadowOpacity: 0.2,
//         shadowRadius: 1.41,
//         elevation: 2,
//     },
//     deviceName: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#333'
//     },
//     deviceId: {
//         fontSize: 12,
//         color: '#666',
//         marginTop: 2,
//     },
//     deviceRssi: {
//         fontSize: 12,
//         color: '#007AFF',
//         fontWeight: '600',
//         marginTop: 4,
//     }
// })


import {
    NativeEventEmitter,
    NativeModules,
    PermissionsAndroid,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import BleManager from 'react-native-ble-manager'

const bleManagerEmitter = new NativeEventEmitter(NativeModules.BleManager)

const BluetoothDevices = () => {
    const [isScanning, setIsScanning] = useState<boolean>(false)
    const [devices, setDevices] = useState<any[]>([])
    const scanTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
    const pollInterval = useRef<ReturnType<typeof setInterval> | null>(null)

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
            seconds: 10,
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
                        for (let i = 0; i < peripherals.length; i++) {
                            console.log(peripherals[i]);
                        }
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
                        <Text style={styles.deviceName}>
                            {device.name || 'Unnamed Device'}
                        </Text>
                        <Text style={styles.deviceId}>{device.id}</Text>
                        <Text style={styles.deviceRssi}>RSSI: {device.rssi}</Text>
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