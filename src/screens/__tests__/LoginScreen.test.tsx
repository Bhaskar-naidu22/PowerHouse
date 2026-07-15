import React, { act } from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import LoginScreen from '../LoginScreen';

jest.useFakeTimers();

const mockReplace = jest.fn();

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => ({
        replace: mockReplace,
    }),
}));

jest.mock('react-native-safe-area-context', () => ({
    useSafeAreaInsets: () => ({
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
    }),
}));
describe('LoginScreen', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the initial state', async () => {
        const { getByText, getAllByText } = await render(<LoginScreen />);

        expect(getByText('Email / Mobile Number')).toBeTruthy();
        expect(getAllByText('Send OTP')).toBeTruthy();
    });

    it('wrong Input Validation Error', async () => {
        const { getByPlaceholderText, getByText, queryByText, getByTestId } = await render(<LoginScreen />);
        expect(getByPlaceholderText('Enter Email/Mobile Number')).toBeTruthy();

        const userInput = getByTestId('contact-input')
        await fireEvent.changeText(userInput, '123456')
        const sendButton = getByText('Send OTP')
        expect(sendButton).toBeDisabled();

        await fireEvent.changeText(userInput, 'bhasakrgmail')
        expect(sendButton).toBeDisabled();

    });

    it('accepts valid email', async () => {
        const { getByTestId, getByDisplayValue } = await render(<LoginScreen />);

        await fireEvent.changeText(getByTestId('contact-input'), 'bhaskar@gmail.com',);

        expect(getByDisplayValue('bhaskar@gmail.com')).toBeTruthy();
    });

    it('moves to OTP screen on Valid Input', async () => {
        const { getByTestId, getByText } = await render(<LoginScreen />);

        await fireEvent.changeText(
            getByTestId('contact-input'),
            '9876543210',
        );

        await fireEvent.press(getByText('Send OTP'));

        await act(async () => {
            jest.runAllTimers();
        });

        await waitFor(() => {
            expect(getByText('Verify OTP')).toBeTruthy();
            expect(getByText('9876543210')).toBeTruthy();
        });
    });

    it('shows error when OTP is incomplete', async () => {
        const { getByTestId, getByText } = await render(<LoginScreen />);

        await fireEvent.changeText(getByTestId('contact-input'), '9876543210');

        await fireEvent.press(getByText('Send OTP'));

        await act(async () => {
            jest.runAllTimers();
        });

        await waitFor(() => {
            expect(getByText('Verify OTP')).toBeTruthy();
        });

        await fireEvent.press(getByText('Verify & Continue →'));

        expect(getByText('Enter the 4-digit OTP'),).toBeTruthy();
    });

    it('navigates after entering valid OTP', async () => {
        const { getByTestId, getByText } = await render(<LoginScreen />);

        await fireEvent.changeText(getByTestId('contact-input'), '9876543210');

        await fireEvent.press(getByText('Send OTP'));

        await act(async () => {
            jest.runAllTimers();
        });

        await waitFor(() => {
            expect(getByText('Verify OTP')).toBeTruthy();
        });


        await fireEvent.changeText(screen.getByTestId('otp-0'), '1');
        await fireEvent.changeText(screen.getByTestId('otp-1'), '2');
        await fireEvent.changeText(screen.getByTestId('otp-2'), '3');
        await fireEvent.changeText(screen.getByTestId('otp-3'), '4');

        await fireEvent.press(screen.getByText('Verify & Continue →'));

        await act(async () => {
            jest.runAllTimers();
        });

        await waitFor(() => {
            expect(mockReplace).toHaveBeenCalledWith('MainTabs');
        });
    });

    it('resets to login screen on resend OTP', async () => {
        const { getByTestId, getByText } = await render(<LoginScreen />);
        await fireEvent.changeText(getByTestId('contact-input'), '9876543210');
        await fireEvent.press(getByText('Send OTP'));
        await act(async () => {
            jest.runAllTimers();
        });

        await waitFor(() => {
            expect(getByText('Verify OTP')).toBeTruthy();
        });

        await fireEvent.press(getByText('Resend OTP'));

        expect(getByText('Email / Mobile Number')).toBeTruthy();
    });
});