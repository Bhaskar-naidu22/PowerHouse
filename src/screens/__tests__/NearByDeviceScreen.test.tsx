import React, { act } from "react";
import {
    render,
    fireEvent,
    waitFor,
} from "@testing-library/react-native";
import { PermissionsAndroid } from "react-native";
import NearByDeviceScreen from "../NearByDeviceScreen";
import BleManager from "react-native-ble-manager";


const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
        goBack: mockGoBack,
    }),
    useRoute: () => ({
        params: {
            sensorType: {
                label: "Temperature",
            },
        },
    }),
    useFocusEffect: jest.fn()
}));


jest.mock("../../components/ScanningPulse", () => {
    const React = require("react");
    const { Text } = require("react-native");

    return ({ scanning }: any) =>
        scanning ? (
            <Text>Scanning</Text>
        ) : (
            <Text>Scan again</Text>
        );
});

jest.mock("../../components/DeviceCard", () => {
    const React = require("react");
    const { TouchableOpacity, Text } = require("react-native");

    return ({ device, onConnect }: any) => (

        <TouchableOpacity onPress={onConnect}>
            <Text>{device.name}</Text>
            <Text>Connect</Text>
        </TouchableOpacity>
    );
});


jest.mock("react-native-ble-manager", () => ({
    start: jest.fn(),
    enableBluetooth: jest.fn(),
    scan: jest.fn(),
    stopScan: jest.fn(),
    connect: jest.fn(),
    onDiscoverPeripheral: jest.fn(),
    onStopScan: jest.fn(),
}));



describe("NearByDeviceScreen", () => {

    beforeEach(() => {
        jest.clearAllMocks();

        (BleManager.start as jest.Mock).mockResolvedValue(undefined);
        (BleManager.enableBluetooth as jest.Mock).mockResolvedValue(undefined);
        (BleManager.scan as jest.Mock).mockResolvedValue(undefined);
        (BleManager.connect as jest.Mock).mockResolvedValue(undefined);
        jest.spyOn(PermissionsAndroid, "requestMultiple").mockResolvedValue({
            [PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN]: "granted",
            [PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT]: "granted",
            [PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE]: "granted",
        } as any);

        (BleManager.onDiscoverPeripheral as jest.Mock).mockReturnValue({
            remove: jest.fn(),
        });

        (BleManager.onStopScan as jest.Mock).mockReturnValue({
            remove: jest.fn(),
        });

    });
    it("renders correctly", async () => {
        const { getByText } = await render(<NearByDeviceScreen />);

        expect(getByText("Nearby Devices")).toBeTruthy();
        expect(
            getByText("Available Temperature Sensors: 0")
        ).toBeTruthy();
    });

    it("starts ble manager on mount", async () => {
        render(<NearByDeviceScreen />);

        await waitFor(() => {
            expect(BleManager.start).toHaveBeenCalled();
        });
    });

    it("shows empty state initially", async () => {
        const { getByText } = await render(<NearByDeviceScreen />);

        expect(
            getByText(/Make Sure your Temperature sensor/)
        ).toBeTruthy();
    });

    it("navigates back when back button is pressed", async () => {
        const { getByText } = await render(<NearByDeviceScreen />);

        await fireEvent.press(getByText("←"));

        expect(mockGoBack).toHaveBeenCalled();
    });

    it("shows empty state initially", async () => {
        const { getByText } = await render(<NearByDeviceScreen />);

        expect(
            getByText(/Make Sure your Temperature sensor/)
        ).toBeTruthy();
    });

    it("starts scan again when scan area is pressed", async () => {
        let stopScanCallback: any;

        (BleManager.onStopScan as jest.Mock).mockImplementation((cb) => {
            stopScanCallback = cb;
            return { remove: jest.fn() };
        });
        const { getByText } = await render(<NearByDeviceScreen />);


        await act(async () => {
            stopScanCallback();
        });

        await fireEvent.press(getByText("Scan again"));

        await waitFor(() => {
            expect(BleManager.scan).toHaveBeenCalled();
        });
    });
    it("adds discovered device", async () => {
        let discoverCallback: any;

        (BleManager.onDiscoverPeripheral as jest.Mock).mockImplementation(
            (cb) => {
                discoverCallback = cb;
                return { remove: jest.fn() };
            }
        );

        const { getByText } = await render(
            <NearByDeviceScreen />
        );

        await act(async () => {
            discoverCallback({
                id: "AA:BB:CC:11",
                name: "Temp Sensor",
            });
        });

        await waitFor(() => {
            expect(getByText("Temp Sensor")).toBeTruthy();
        });
    });

    it("connects to selected device", async () => {
        let discoverCallback: any;

        (BleManager.onDiscoverPeripheral as jest.Mock).mockImplementation(
            (cb) => {
                discoverCallback = cb;
                return { remove: jest.fn() };
            }
        );

        const { getByText } = await render(<NearByDeviceScreen />);

        await act(async () => {
            discoverCallback({
                id: "AA:BB:CC:11",
                name: "Temp Sensor",
            });
        });

        await fireEvent.press(getByText("Connect"));

        await waitFor(() => {
            expect(BleManager.connect).toHaveBeenCalledWith("AA:BB:CC:11");

            expect(BleManager.stopScan).toHaveBeenCalled();

            expect(mockNavigate).toHaveBeenCalledWith(
                "DeviceDetails",
                {
                    device: {
                        id: "AA:BB:CC:11",
                        name: "Temp Sensor",
                    },
                    sensorType: {
                        label: "Temperature",
                    },
                }
            );
        });
    });
});