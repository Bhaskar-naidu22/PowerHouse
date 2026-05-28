import { Alert, DevMenu, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, NativeEventEmitter, NativeModules, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import BleManager from 'react-native-ble-manager'

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const DeviceDetails = () => {
    const route = useRoute<any>()
    const { device } = route.params

    const [writeChars, setWriteChars] = useState<any[]>([])
    const [notifyChars, setNotifyChars] = useState<any[]>([])
    const [readChars, setReadChars] = useState<any[]>([])
    const [inputKey, setInputKey] = useState<string>('')

    useEffect(() => {
        let updateListener: any;

        const getServices = async () => {
            try {
                await BleManager.refreshCache(device.id);

                const services = await BleManager.retrieveServices(device.id)
                // console.log('Services retrieved', JSON.stringify(services, null, 2))

                const writeChars = services.characteristics?.filter(
                    (c: any) => c.properties.Write && !c.properties.Notify
                ) || []

                // ✅ Get ALL notify characteristics (not just first one)
                const notifyChars = services.characteristics?.filter(
                    (c: any) => c.properties.Notify
                ) || []

                // ✅ Get ALL read characteristics (not just first one)
                const readChars = services.characteristics?.filter(
                    (c: any) => c.properties.Read && !c.properties.Write
                ) || []

                console.log('All Write chars:', writeChars)
                console.log('All Notify chars:', notifyChars)
                console.log('All Read chars:', readChars)

                // Store all of them
                // setWriteChars(writeChars)
                // setNotifyChars(notifyChars)
                // setReadChars(readChars)

                // if (notifyChars) {
                //     const firstNotify = notifyChars[0]
                

                updateListener = bleManagerEmitter.addListener(
                    'BleManagerDidUpdateValueForCharacteristic',
                    // ({ value, characteristic }) => {
                    //     if (characteristic.toLowerCase() === "83ab48e3-32c0-42cf-95fc-5c188f7b9935") {
                    //         console.log('RAW RESPONSE FROM SENSOR (BYTES):', value);
                    //         console.log('PARSED RESPONSE (AS TEXT):', String.fromCharCode(...value));
                    //     }
                    // }
                    data =>{
                        console.log("Even BleManagerDidUpdateValueForCharacteristic", data);
                    }
                );
                // }
            } catch (err) {
                console.error('Failed to retrieve services:', err)
            }
        }
        getServices()
        return () => {
            if (updateListener) updateListener.remove();
            BleManager.stopNotification(device.id, "83ab48e1-32c0-42cf-95fc-5c188f7b9935", "83ab48e3-32c0-42cf-95fc-5c188f7b9935")
                .catch((err) => console.error('Stop notification error:', err))

            BleManager.disconnect(device.id)
                .then(() => console.log('Disconnected'))
                .catch((err) => console.error('Disconnect error:', err))

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

        console.log(
            hashBytes)
        await BleManager.write(
            device.id,
            "83ab48e1-32c0-42cf-95fc-5c188f7b9935",
            "83ab48e2-32c0-42cf-95fc-5c188f7b9935",
            hashBytes
        )
        console.log('Hash key sent')

        // await new Promise<void>(resolve => setTimeout(resolve, 1000))
        // const response = await BleManager.read(
        //     device.id,
        //     "83ab48e1-32c0-42cf-95fc-5c188f7b9935",
        //     "83ab48e3-32c0-42cf-95fc-5c188f7b9935"
        // )
        await BleManager.startNotification(device.id, "83ab48e1-32c0-42cf-95fc-5c188f7b9935", "83ab48e3-32c0-42cf-95fc-5c188f7b9935");
        console.log('--- Subscribed to Notifications ---');
        
        // const responseText = String.fromCharCode(...response)
        // console.log('RAW RESPONSE (BYTES):', response)
        // console.log('PARSED RESPONSE (TEXT):', responseText)
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