import { fireEvent, render } from "@testing-library/react-native";
import FlatStatus from "../FlatStatus";

const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
    }),
}))
jest.mock('../../components/ActivityCard', () => {
    const React = require('react');
    const { Text, View } = require('react-native');
    return {
        ActivityCard: ({ item }: any) => (
            <View>
                <Text>{item.building}</Text>
                <Text>{item.details}</Text>
            </View>
        )
    }
})

jest.mock('../../utils/RecentActivityData', () => ({
    RECENT_ACTIVITY_DATA: [
        { id: '1', building: 'Skyline Heights', details: 'Block B, Flat 402', time: '10:30 AM', status: 'Completed' },
        { id: '2', building: 'Skyline Heights', details: 'Block C, Flat 105', time: '09:15 AM', status: 'Pending' },
        { id: '3', building: 'Emerald Plaza', details: 'Shop 12, Level G', time: 'Yesterday', status: 'Completed' },
        { id: '4', building: 'Tech Hub One', details: 'Main Lobby Sensors', time: 'Yesterday', status: 'Completed' }
    ]
}))

describe('FlatStatus', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('Renders Correctly and shows Filter Tabs', async () => {
        const { getByPlaceholderText, getAllByText, getByText } = await render(<FlatStatus />)
        expect(getByPlaceholderText("Search flat or building...")).toBeTruthy();
        expect(getByText("All")).toBeTruthy();
        expect(getAllByText("Completed")).toBeTruthy();
    })

    it('renders activity cards', async () => {
        const { getAllByText } = await render(<FlatStatus />);

        expect(getAllByText("Skyline Heights")).toBeTruthy();
        expect(getAllByText('Emerald Plaza')).toBeTruthy();
    })

    it("filters pending activities", async() => {
        const { getByText, queryByText,getAllByText } = await render(<FlatStatus />);

        await fireEvent.press(getByText("Pending"));

        expect(getAllByText("Skyline Heights")).toHaveLength(1);
        expect(queryByText("Emerald Plaza")).toBeNull();
        expect(queryByText("Tech Hub One")).toBeNull();
    });

    it("navigates when + is pressed", async () => {
        const { getByText } = await render(<FlatStatus />);

        await fireEvent.press(getByText("+"));

        expect(mockNavigate).toHaveBeenCalledWith(
            "PropertySelectionScreen"
        );
    });

})