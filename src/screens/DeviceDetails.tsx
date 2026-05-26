import { Alert, DevMenu, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, NativeEventEmitter, NativeModules } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import BleManager from 'react-native-ble-manager'

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const DeviceDetails = () => {
    const route = useRoute<any>()
    const { device } = route.params
    const [newName, setNewName] = useState<string>(device.name)

    const [writeChar, setWriteChar] = useState<any>(null)
    const [notifyChar, setNotifyChar] = useState<any>(null)
    const [inputKey, setInputKey] = useState<string>('')
    const HASH_KEY = ''

    const saveName = () => {
        if (!newName) {
            Alert.alert("name cannot be empty")
            return
        }

    }
    const identifyCharacteristics = (services: any) => {
        const standardServices = ['1800', '1801', 'fe2c']

        const customChars = services.characteristics.filter(
            (c: any) => !standardServices.includes(c.service)
        )
        // console.log('Custom characteristics:', JSON.stringify(customChars, null, 2))

        const writeChar = customChars.find(
            (c: any) => c.properties.Write && !c.properties.Notify
        )
        const notifyChar = customChars.find(
            (c: any) => c.properties.Notify
        )
        const readChar = customChars.find(
            (c: any) => c.properties.Read && !c.properties.Write
        )

        console.log('Write → service:', writeChar?.service, 'char:', writeChar?.characteristic)
        console.log('Notify → service:', notifyChar?.service, 'char:', notifyChar?.characteristic)
        console.log('Read → service:', readChar?.service, 'char:', readChar?.characteristic)

        return { writeChar, notifyChar, readChar }
    }
    useEffect(() => {
        let updateListener: any;
        const getServices = async () => {
            try {
                const services = await BleManager.retrieveServices(device.id)
                // console.log('Services retrieved', JSON.stringify(services, null, 2))
                const { writeChar, notifyChar } = identifyCharacteristics(services)
                setWriteChar(writeChar)
                setNotifyChar(notifyChar)

                debugger;
                if (notifyChar) {
                    await BleManager.startNotification(device.id, notifyChar.service, notifyChar.characteristic);
                    console.log('--- Subscribed to Notifications ---');

                    updateListener = bleManagerEmitter.addListener(
                        'BleManagerDidUpdateValueForCharacteristic',
                        ({ value, characteristic }) => {
                            if (characteristic.toLowerCase() === notifyChar.characteristic.toLowerCase()) {
                                console.log('RAW RESPONSE FROM SENSOR (BYTES):', value);
                                console.log('PARSED RESPONSE (AS TEXT):', String.fromCharCode(...value));
                            }
                        }
                    );
                }   
            } catch (err) {
                console.error('Failed to retrieve services:', err)
            }
        }
        getServices()
        return () => {
            if (updateListener) updateListener.remove();
        }
    }, [])
    const authenticate = async () => {
        if (!inputKey.trim()) {
            Alert.alert("Error", "Please type a hash key first");
            return;
        }
        try {
            const hashBytes = Array.from(inputKey)
                .map((c: string) => c.charCodeAt(0))

            console.log(writeChar.service,
                writeChar.characteristic,
                hashBytes)
            await BleManager.write(
                device.id,
                writeChar.service,
                writeChar.characteristic,
                hashBytes
            )
            console.log('Hash key sent')
        } catch (err) {
            console.error('Failed to send hash key:', err)
        }
    }
    return (
        <ScrollView>
            <Text style={styles.value}>
                {device.id}, {device.name}
            </Text>

            <View style={styles.card}>
                {/* <Text >Rename Device</Text>
                <TextInput
                    style={styles.input}
                    value={newName}
                    onChangeText={setNewName}
                    placeholder="Enter new device name"
                    placeholderTextColor="#aaa"
                /> */}
                {/* <TouchableOpacity style={styles.saveButton} onPress={saveName}>
                    <Text style={styles.saveButtonText}>Save Name</Text>
                </TouchableOpacity> */}
                <TextInput
                    style={styles.input}
                    value={inputKey}
                    onChangeText={setInputKey}
                    placeholder="e.g. secret123 or A1B2C3"
                    placeholderTextColor="#999"
                    autoCapitalize="none"
                    autoCorrect={false}
                />
                <TouchableOpacity
                    style={styles.authButton}
                    onPress={authenticate}
                >
                    <Text style={styles.authButtonText}>Authenticate with Hash Key</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

export default DeviceDetails

const styles = StyleSheet.create({
    authButton: {
        backgroundColor: '#FF9500',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    authButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    value: {
        flex: 1,
        marginLeft: 2
    },
    card: {
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
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 6,
        padding: 10,
        fontSize: 15,
        color: '#333',
        marginBottom: 10,
    },
    saveButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 6,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    }
})