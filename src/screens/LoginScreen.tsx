import React, { useState, useRef } from 'react'
import {
    View,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { Text, TextInput } from '../components/AppText'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import UiModeToggle from '../components/UiModeToggle'
import UiModeScreenPicker from '../components/UiModeScreenPicker'
import { useUiMode } from '../contexts/UiModeContext'
import CallIcon from '../components/icons/CallIcon'
import ArrowRightIcon from '../components/icons/ArrowRightIcon'
import { Icon } from '../components/IconComponent'

type Step = 'input' | 'otp'

const LoginScreen = () => {
    const navigation = useNavigation<any>()
    const insets = useSafeAreaInsets()
    const { uiMode } = useUiMode()

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
        <LinearGradient
            colors={['#3B5BDB', '#FFFFFF', '#FFFFFF']}
            locations={[0, 0.58, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.root}
        >
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={[
                    styles.container,
                    {
                        paddingTop: insets.top + 28,
                        paddingBottom: insets.bottom + 24,
                    },
                ]}
                keyboardShouldPersistTaps="handled"
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={false}
                // Keep layout fixed — do not scroll when keyboard opens
                scrollEnabled={false}
            >
                <View style={styles.brandSection}>
                    <Text style={styles.brandName}>FieldLink</Text>
                    <Text style={styles.brandTagline}>Smart Sensor Management</Text>
                </View>

                <View style={styles.middleSection}>
                    {!uiMode ? (
                    <View style={styles.card}>
                        {step === 'input' ? (
                            <>
                                <Text style={styles.inputLabel}>Email / Mobile Number</Text>
                                <View style={[styles.inputWrapper, error ? styles.inputError : null]}>
                                    <View style={styles.inputIcon}>
                                        {isEmail ? (
                                            <Icon name="email" size={20} color="#3B5BDB" />
                                        ) : (
                                            <CallIcon size={20} color="#3B5BDB" />
                                        )}
                                    </View>
                                    <TextInput
                                        testID='contact-input'
                                        style={styles.input}
                                        value={contact}
                                        onChangeText={(t) => { setContact(t); setError('') }}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        placeholder="Enter email or mobile number"
                                        placeholderTextColor="#9CA3AF"
                                    />
                                </View>

                                {error ? <Text style={styles.errorText}>{error}</Text> : null}

                                <TouchableOpacity
                                    style={[
                                        styles.primaryButton,
                                        loading && styles.buttonDisabled,
                                    ]}
                                    activeOpacity={0.85}
                                    onPress={handleRequestOtp}
                                    disabled={!isValid || loading}>
                                    {loading
                                        ? <ActivityIndicator color="#FFFFFF" />
                                        : (
                                            <>
                                                <Text style={styles.primaryButtonText}>Send OTP</Text>
                                                <View style={styles.arrowCircle}>
                                                    <ArrowRightIcon size={20} color="#3B5BDB" />
                                                </View>
                                            </>
                                        )}
                                </TouchableOpacity>
                            </>
                        ) : (
                            <>
                                <Text style={styles.cardTitle}>Verify OTP</Text>
                                <Text style={styles.cardSubtitle}>
                                    We sent a 4-digit code to{'\n'}
                                    <Text style={styles.contactHighlight}>{contact}</Text>
                                </Text>

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
                                        : (
                                            <>
                                                <Text style={styles.primaryButtonText}>Verify & Continue</Text>
                                                <View style={styles.arrowCircle}>
                                                    <ArrowRightIcon size={20} color="#3B5BDB" />
                                                </View>
                                            </>
                                        )}
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
                    ) : null}

                    {!uiMode ? (
                    <Text style={styles.footerNote}>
                        By continuing, you agree to FieldLink's Terms & Condition's.
                    </Text>
                    ) : null}
                </View>
            </ScrollView>

            {/* TEMP: UI Mode — floating corner, out of main UI flow */}
            <View
                pointerEvents="box-none"
                style={[
                    styles.uiModeCorner,
                    { bottom: insets.bottom + 16, right: 16 },
                ]}
            >
                <UiModeScreenPicker compact />
                <UiModeToggle compact />
            </View>
        </LinearGradient>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    scroll: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    container: {
        flexGrow: 1,
        paddingHorizontal: 20,
        alignItems: 'center',
    },

    brandSection: {
        alignItems: 'center',
        width: '100%',
        marginTop: 24,
        marginBottom: 8,
    },
    brandName: {
        fontSize: 26,
        fontWeight: '700',
        color: '#FFFFFF',
        letterSpacing: 0.5,
    },
    brandTagline: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.85)',
        marginTop: 2,
    },

    middleSection: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        // Bias form upward without moving brand
        paddingBottom: 72,
    },

    card: {
        width: '100%',
        backgroundColor: 'transparent',
        borderRadius: 20,
        paddingHorizontal: 24,
        paddingVertical: 8,
        marginBottom: 0,
    },
    cardTitle: {
        fontSize: 26,
        fontWeight: '700',
        color: '#3B5BDB',
        marginBottom: 0,
    },
    cardSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        lineHeight: 17,
        marginBottom: 24,
    },
    contactHighlight: {
        color: '#3B5BDB',
        fontWeight: '700',
    },

    inputLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
        textAlign: 'center',
        width: '100%',
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 26,
        borderWidth: 0,
        paddingHorizontal: 14,
        marginBottom: 8,
        height: 52,
    },
    inputError: {
        borderWidth: 1.5,
        borderColor: '#EF4444',
    },
    inputIcon: {
        marginRight: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#111827',
    },

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

    errorText: {
        fontSize: 12,
        color: '#EF4444',
        marginBottom: 12,
        marginTop: 2,
    },

    primaryButton: {
        backgroundColor: '#3B5BDB',
        borderRadius: 30,
        paddingVertical: 8,
        paddingLeft: 28,
        paddingRight: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
        width: '100%',
        elevation: 2,
        shadowColor: '#3B5BDB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        minHeight: 60,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    primaryButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '400',
        letterSpacing: 0.3,
    },
    arrowCircle: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },

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

    footerNote: {
        fontSize: 11,
        color: '#9CA3AF',
        textAlign: 'center',
        lineHeight: 18,
        marginTop: 16,
        paddingHorizontal: 24,
    },
    uiModeCorner: {
        position: 'absolute',
        zIndex: 50,
        alignItems: 'flex-end',
        maxWidth: 280,
    },
})
