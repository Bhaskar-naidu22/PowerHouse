import { fireEvent, render, screen } from "@testing-library/react-native";
import ProfileScreen from "../ProfileScreen";

const mockReplace = jest.fn();
jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        replace: mockReplace,
    }),
}));

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

jest.mock('react-native-safe-area-context', () => {
    const React = require('react');
    const { View } = require('react-native');

    return {
        SafeAreaView: ({ children }: any) => (
            <View>{children}</View>
        )
    };
});

jest.mock('../../components/ContactRowCard', () => {
    const { Text } = require('react-native');

    return {
        ContactRow: ({ label, value }: any) => (
            <>
                <Text>{label}</Text>
                <Text>{value}</Text>
            </>
        ),
    };
});

describe("ProfileScreen", () => {
    beforeEach(() => {
        jest.resetAllMocks();
    })

    it("Screen Renders properly", async () => {
        const { getByText } = await render(<ProfileScreen />)
        expect(getByText("Days")).toBeTruthy();
    })

    it("renders contact information", async () => {
        const { getByText } = await render(<ProfileScreen />);

        expect(getByText("Email")).toBeTruthy();
        expect(getByText("Mobile")).toBeTruthy();
    });

    it("shows logout button", async () => {
        const { getByText } = await render(<ProfileScreen />);

        expect(getByText("Sign Out")).toBeTruthy();
        await fireEvent.press(getByText("Sign Out"))
        expect(mockReplace).toHaveBeenCalledWith("LoginScreen")
    });

})