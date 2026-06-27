import React, { useState, useRef } from 'react'
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ScrollView, ActivityIndicator
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type Step = 'input' | 'otp'

const LoginScreen = () => {
    const navigation = useNavigation<any>()
    const insets = useSafeAreaInsets()

    const [step, setStep] = useState<Step>('input')
    const [contact, setContact] = useState('')
    const [otp, setOtp] = useState(['', '', '', ''])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const otpRefs = [
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
    ]

    const isEmail = contact.includes('@')
    const isValid = isEmail
        ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)
        : /^[6-9]\d{9}$/.test(contact)

    // ── Step 1: Request OTP ───────────────────────────────
    const handleRequestOtp = async () => {
        if (!isValid) {
            setError('Enter a valid email or 10-digit mobile number')
            return
        }
        setError('')
        setLoading(true)
        // TODO: Replace with real API call
        setTimeout(() => {
            setLoading(false)
            setStep('otp')
        })
    }

    // ── Step 2: Verify OTP ────────────────────────────────
    const handleVerifyOtp = async () => {
        const code = otp.join('')
        if (code.length < 4) {
            setError('Enter the 4-digit OTP')
            return
        }
        // navigation.navigate('PropertySelectionScreen')
        setError('')
        setLoading(true)
        // TODO: Replace with real API call
        setTimeout(() => {
            setLoading(false)
            navigation.replace('MainTabs')
        })
    }

    const handleOtpChange = (value: string, index: number) => {
        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)
        // Auto advance to next box
        if (value && index < 3) {
            otpRefs[index + 1].current?.focus()
        }
    }

    const handleOtpBackspace = (value: string, index: number) => {
        if (!value && index > 0) {
            otpRefs[index - 1].current?.focus()
        }
    }

    const handleResend = () => {
        setOtp(['', '', '', ''])
        setStep('input')
    }

    return (
        <ScrollView
            style={{ flex: 1 }}>
            <View
                style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 24 }]}>

                {/* Logo / Brand */}
                <View style={styles.brandSection}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoText}>F</Text>
                    </View>
                    <Text style={styles.brandName}>FieldLink</Text>
                    <Text style={styles.brandTagline}>Smart Sensor Management</Text>
                </View>

                {/* Card */}
                <View style={styles.card}>
                    {step === 'input' ? (
                        <>
                            <Text style={styles.cardTitle}>Welcome</Text>
                            <Text style={styles.cardSubtitle}>
                                Enter your email or mobile number to receive an OTP
                            </Text>

                            <Text style={styles.inputLabel}>Email / Mobile Number</Text>
                            <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
                                <Text style={styles.inputIcon}>
                                    {isEmail ? '✉' : '📱'}
                                </Text>
                                <TextInput
                                    testID='contact-input'
                                    style={styles.input}
                                    value={contact}
                                    onChangeText={(t) => { setContact(t); setError('') }}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    placeholder='Enter Email/Mobile Number'
                                />
                            </View>

                            {error ? <Text style={styles.errorText}>{error}</Text> : null}

                            <TouchableOpacity
                                style={[styles.primaryButton, (!isValid || loading) && styles.buttonDisabled]}
                                activeOpacity={0.85}
                                onPress={handleRequestOtp}
                                disabled={!isValid || loading}>
                                {loading
                                    ? <ActivityIndicator color="#fff" />
                                    : <Text style={styles.primaryButtonText}>Send OTP</Text>}
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <Text style={styles.cardTitle}>Verify OTP</Text>
                            <Text style={styles.cardSubtitle}>
                                We sent a 4-digit code to{'\n'}
                                <Text style={styles.contactHighlight}>{contact}</Text>
                            </Text>

                            {/* OTP Boxes */}
                            <View style={styles.otpRow}>
                                {otp.map((digit, index) => (
                                    <TextInput
                                        testID={`otp-${index}`}
                                        key={index}
                                        ref={otpRefs[index]}
                                        style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
                                        value={digit}
                                        onChangeText={(v) => handleOtpChange(v.slice(-1), index)}
                                        onKeyPress={({ nativeEvent }) => {
                                            if (nativeEvent.key === 'Backspace') handleOtpBackspace(digit, index)
                                        }}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        textAlign="center"
                                    />
                                ))}
                            </View>

                            {error ? <Text style={styles.errorText}>{error}</Text> : null}

                            <TouchableOpacity
                                style={[styles.primaryButton, loading && styles.buttonDisabled]}
                                activeOpacity={0.85}
                                onPress={handleVerifyOtp}
                                disabled={loading}>
                                {loading
                                    ? <ActivityIndicator color="#fff" />
                                    : <Text style={styles.primaryButtonText}>Verify & Continue →</Text>}
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.resendRow} onPress={handleResend}>
                                <Text style={styles.resendText}>
                                    Didn't receive it?{' '}
                                    <Text style={styles.resendLink}>Resend OTP</Text>
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>

                <Text style={styles.footerNote}>
                    By continuing, you agree to FieldLink's Terms & Condition's.
                </Text>

            </View>
        </ScrollView>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#F0F2F8',
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    // Brand
    brandSection: {
        alignItems: 'center',
        marginBottom: 100,
    },
    logoCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#3B5BDB',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
        elevation: 4,
        shadowColor: '#3B5BDB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    logoText: {
        fontSize: 28,
        fontWeight: '800',
        color: '#fff',
    },
    brandName: {
        fontSize: 26,
        fontWeight: '800',
        color: '#111827',
        letterSpacing: 0.5,
    },
    brandTagline: {
        fontSize: 13,
        color: '#9CA3AF',
        marginTop: 4,
    },

    // Card
    card: {
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 24,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        marginBottom: 20,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 6,
    },
    cardSubtitle: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 20,
        marginBottom: 24,
    },
    contactHighlight: {
        color: '#3B5BDB',
        fontWeight: '700',
    },

    // Input
    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        paddingHorizontal: 14,
        marginBottom: 8,
        height: 52,
    },
    inputError: {
        borderColor: '#EF4444',
    },
    inputIcon: {
        fontSize: 16,
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#111827',
    },

    // OTP
    otpRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        gap: 12,
        marginTop: 8,
    },
    otpBox: {
        flex: 1,
        height: 58,
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        backgroundColor: '#F9FAFB',
        fontSize: 22,
        fontWeight: '700',
        color: '#111827',
    },
    otpBoxFilled: {
        borderColor: '#3B5BDB',
        backgroundColor: '#EEF2FF',
    },

    // Error
    errorText: {
        fontSize: 12,
        color: '#EF4444',
        marginBottom: 12,
        marginTop: 2,
    },

    // Button
    primaryButton: {
        backgroundColor: '#3B5BDB',
        borderRadius: 30,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 8,
        elevation: 2,
        shadowColor: '#3B5BDB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },

    // Resend
    resendRow: {
        alignItems: 'center',
        marginTop: 16,
    },
    resendText: {
        fontSize: 13,
        color: '#6B7280',
    },
    resendLink: {
        color: '#3B5BDB',
        fontWeight: '700',
    },

    // Footer
    footerNote: {
        fontSize: 11,
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 18,
    },
})