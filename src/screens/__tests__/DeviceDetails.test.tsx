import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import BleManager from 'react-native-ble-manager';
import DeviceDetails from "../DeviceDetails";

const mockReplace = jest.fn()
const mockGoBack = jest.fn()
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        replace: mockReplace,
        goBack: mockGoBack
    }),
    useRoute: () => ({
        params: {
            sensorType: {
                label: 'Temperature'
            },
            device: {
                id: 'AA:BB:11:22'
            }
        }
    })
}));
jest.mock('react-native-uuid', () => ({
    v4: jest.fn(() => 'mock-uuid'),
}));

jest.mock('react-native-ble-manager', () => ({
    retrieveServices: jest.fn(),
    startNotification: jest.fn(),
    stopNotification: jest.fn(),
    disconnect: jest.fn(),
    write: jest.fn(),
    requestMTU: jest.fn(),
    onDisconnectPeripheral: jest.fn(),
    onDidUpdateValueForCharacteristic: jest.fn(),
}));

jest.mock('../../contexts/SessionContexts', () => ({
    useSession: () => ({
        flatDetails: {
            buildingName: 'GLF Towers'
        }
    })
}))

describe("DeviceDetails", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        (BleManager.retrieveServices as jest.Mock).mockResolvedValue(undefined);
        (BleManager.startNotification as jest.Mock).mockResolvedValue(undefined);
        (BleManager.stopNotification as jest.Mock).mockResolvedValue(undefined);
        (BleManager.disconnect as jest.Mock).mockResolvedValue(undefined);
        (BleManager.write as jest.Mock).mockResolvedValue(undefined);
        (BleManager.requestMTU as jest.Mock).mockResolvedValue(undefined);

        (BleManager.onDisconnectPeripheral as jest.Mock).mockReturnValue({
            remove: jest.fn(),
        });

        (BleManager.onDidUpdateValueForCharacteristic as jest.Mock).mockReturnValue({
            remove: jest.fn(),
        });
    });
    it('renders screen correctly', async () => {
        const { getByText } = await render(<DeviceDetails />);

        expect(getByText('Device Details')).toBeTruthy();
        expect(getByText('Temperature Sensor')).toBeTruthy();
        expect(getByText('Connected')).toBeTruthy();
        expect(getByText('GLF Towers')).toBeTruthy();
        expect(getByText('ID: AA:BB:11:22')).toBeTruthy();
    });
    it('initializes BLE communication', async () => {
        await render(<DeviceDetails />);

        await waitFor(() => {
            expect(BleManager.retrieveServices).toHaveBeenCalledWith(
                'AA:BB:11:22'
            );

            expect(BleManager.startNotification).toHaveBeenCalledWith(
                'AA:BB:11:22',
                '83ab48e1-32c0-42cf-95fc-5c188f7b9935',
                '83ab48e3-32c0-42cf-95fc-5c188f7b9935'
            );
        });
    });
    it('goes back when back button pressed', async () => {
        const { getByText } = await render(<DeviceDetails />);

        await fireEvent.press(getByText('←'));

        await waitFor(() => {
            expect(BleManager.stopNotification).toHaveBeenCalled();
            expect(BleManager.disconnect).toHaveBeenCalled();
            expect(mockGoBack).toHaveBeenCalled();
        });
    });
    it('registers disconnect listener', async() => {
        await render(<DeviceDetails />);

        expect(
            BleManager.onDisconnectPeripheral
        ).toHaveBeenCalled();
    });
})

