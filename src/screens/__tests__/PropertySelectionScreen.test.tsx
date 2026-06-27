import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import PropertySelectionScreen from "../PropertySelectionScreen";

const mockNavigate = jest.fn();

jest.mock("@react-navigation/native", () => ({
    useNavigation: () => ({
        navigate: mockNavigate,
        goBack: jest.fn(),
    }),
}))

jest.mock("react-native-safe-area-context", () => ({
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock("../../contexts/SessionContexts", () => ({
    useSession: () => ({
        setFlatDetails: jest.fn(),
    }),
}));

jest.mock("@sentry/react-native", () => ({
    captureException: jest.fn(),
}));

jest.mock("../../components/DropDown", () => {
    const { TouchableOpacity, Text } = require("react-native");
    return ({ placeholder, value, onPress, disabled }: any) => (
        <TouchableOpacity onPress={onPress} disabled={disabled} testID={placeholder}>
            <Text>{value || placeholder}</Text>
        </TouchableOpacity>
    );
});

describe("PropertySelectionScreen", () => {
    beforeAll(() => {
        mockNavigate.mockClear();
        jest.clearAllMocks();
    });
    it("Screen renders correctly", async () => {
        const { getAllByText } = await render(<PropertySelectionScreen />);
        expect(getAllByText("Property Selection")).toBeTruthy();
        expect(getAllByText("Select Building")).toBeTruthy();
        expect(getAllByText("Select Flat / Unit")).toBeTruthy();
        expect(getAllByText("Continue")).toBeTruthy();
    });

    it("Screen Functionality working correctly", async () => {
        const { getByTestId, getByPlaceholderText, getByText } = await render(<PropertySelectionScreen />);
        const buildingDropdown = getByText("Search or select building...");
        const flatDropdown = getByTestId("Search unit number...");
        const continueButton = getByText("Continue");
        expect(continueButton).toBeDisabled();
        expect(flatDropdown).toBeDisabled();
        await fireEvent.press(buildingDropdown);
        const searchInput = getByPlaceholderText("Search...");
        await fireEvent.changeText(searchInput, "Sky");
        expect(getByText("Sky Towers")).toBeTruthy();
        await fireEvent.press(getByText("Sky Towers"));
        expect(getByText("Maintenance")).toBeTruthy();
        expect(flatDropdown).toBeEnabled()

        await fireEvent.press(flatDropdown)
        await fireEvent.press(getByText("101 - Floor 1"));
        expect(continueButton).toBeEnabled();
        fireEvent.press(continueButton)
        expect(mockNavigate).toHaveBeenCalledWith("Sensor Type",
            expect.objectContaining({
                building: expect.objectContaining({ name: "Sky Towers" }),
                flat: expect.objectContaining({ unit: "101 - Floor 1" }),
            })
        )

    });

});