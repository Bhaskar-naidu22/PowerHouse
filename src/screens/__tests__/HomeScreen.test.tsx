import { fireEvent, render } from "@testing-library/react-native";
import React from "react";
import HomeScreen from "../HomeScreen";

const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
        goBack: jest.fn(),
    })
}))

jest.mock('../../components/StatCard', () => {
    const { Text } = require('react-native')
    return {
        StatCard: ({ label, value }: any) => (
            <>
                <Text>{label}</Text>
                <Text>{value}</Text>
            </>
        )
    }
});

jest.mock('../../components/ActivityCard', () => {
    const { Text } = require('react-native')
    return {
        ActivityCard: ({ item }: any) => (
            <Text>{item.building}</Text>
        )
    }
});

describe('HomeScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })
    it("Screen Renders Correctly", async () => {
        const { getByText } = await render(<HomeScreen />)
        expect(getByText("+")).toBeTruthy();
        expect(getByText('Flats Completed')).toBeTruthy();
        expect(getByText('Sensors')).toBeTruthy();
        expect(getByText('Pending')).toBeTruthy();
        expect(getByText('Recent Activity')).toBeTruthy();
    })
    it("navigation working properly", async () => {
        const { getByTestId, getByText } = await render(<HomeScreen />)

        await fireEvent.press(getByTestId("profile-icon"))
        expect(mockNavigate).toHaveBeenCalledWith('MainTabs',{ screen: 'Profile' });

        await fireEvent.press(getByText("+"));
        expect(mockNavigate).toHaveBeenCalledWith("PropertySelectionScreen")

        await fireEvent.press(getByText("View All"));
        expect(mockNavigate).toHaveBeenCalledWith('MainTabs',{ screen: 'Flats' })
    })

    it("Recent activity Loading properly", async()=>{
        const {getByTestId} = await render(<HomeScreen/>)
        expect(getByTestId("recent-activity")).toBeTruthy();
    })
})