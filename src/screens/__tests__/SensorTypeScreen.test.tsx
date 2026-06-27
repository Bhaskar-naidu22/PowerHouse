import { fireEvent, render } from "@testing-library/react-native";
import SensorTypeScreen from "../SensorTypeScreen";

const mockNavigate = jest.fn()
const mockGoBack = jest.fn()
let focusCallback: any;
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
        goBack: mockGoBack
    }),
    useFocusEffect: (cb: any) => {
        focusCallback = cb;
    },
}))

jest.mock('../../components/SensorTypeCard', () => {
    return ({ option, onPress }: any) => {
        const React = require('react');
        const { TouchableOpacity, Text } = require('react-native');

        return (
            <TouchableOpacity onPress={() => onPress(option)}>
                <Text>{option.label}</Text>
            </TouchableOpacity>
        );
    };
});

describe("SensorTypeScreen", () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })
    it('renders screen correctly', async () => {
        const { getByText } = await render(<SensorTypeScreen />);

        expect(getByText('Select Sensor Type')).toBeTruthy();

        expect(getByText('Choose the sensor you want to configure for the current electrical node.')).toBeTruthy();
        expect(getByText('IR')).toBeTruthy();
        expect(getByText('Relay')).toBeTruthy();
        expect(getByText('Temp')).toBeTruthy();
        expect(getByText('Camera')).toBeTruthy();
        expect(getByText('Radar')).toBeTruthy();
    });

    it('goes back when back button is pressed', async () => {
        const { getByText } = await render(<SensorTypeScreen />);

        await fireEvent.press(getByText('←'));

        expect(mockGoBack).toHaveBeenCalled();
    });

    it('does not navigate when continue is pressed without selection', async () => {
        const { getByText } = await render(<SensorTypeScreen />);

        await fireEvent.press(getByText('Continue'));

        expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('navigates with selected sensor', async () => {
        const { getByText } = await render(<SensorTypeScreen />);

        await fireEvent.press(getByText('Temp'));
        await fireEvent.press(getByText('Continue'));

        expect(mockNavigate).toHaveBeenCalledWith(
            'NearByScreen',
            expect.objectContaining({
                sensorType: expect.objectContaining({
                    label: 'Temp',
                }),
            })
        );
    });
});