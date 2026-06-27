import { fireEvent, render } from "@testing-library/react-native";
import SuccessScreen from "../SuccessScreen";

const mockReplace = jest.fn();
const mockPopToTop = jest.fn();

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        replace: mockReplace,
        popToTop: mockPopToTop,
    }),
    useRoute: () => ({
        params: {
            sensorType: {
                label: "Temperature",
            },
            device: {
                id: "AA:BB:CC:11",
            },
        },
    }),
}));

jest.mock('../../contexts/SessionContexts', () => ({
    useSession: () => ({
        flatDetails: {
            FlatName: 'A104',
            buildingName: "GLF Towers"
        }
    })
}))

describe("SuccessScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    it("Renders Screen Correctly with data", async () => {
        const { getByText } = await render(<SuccessScreen />)
        expect(getByText("Configuration Complete")).toBeTruthy();
        expect(getByText("Temperature Sensor")).toBeTruthy();
        expect(getByText("AA:BB:CC:11")).toBeTruthy();
        expect(getByText("GLF Towers")).toBeTruthy();
        expect(getByText("A104")).toBeTruthy();
    })

    it("navigates to Sensor Type when Add Another Sensor is pressed", async() => {
        const { getByText } = await render(<SuccessScreen />);

        await fireEvent.press(getByText("Add Another Sensor"));

        expect(mockReplace).toHaveBeenCalledWith("Sensor Type");
    });

    it("returns to home dashboard when button is pressed", async() => {
        const { getByText } = await render(<SuccessScreen />);

        await fireEvent.press(getByText("Return to Home Dashboard"));

        expect(mockPopToTop).toHaveBeenCalled();
    });
})