import React, { useState } from 'react'
import {
    View, Text, TouchableOpacity, StyleSheet,
    ScrollView, TextInput, FlatList, Modal,
    Button
} from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Dropdown from '../components/DropDown'
import { Building, Flat } from '../types'
import { useSession } from '../contexts/SessionContexts'

const BUILDINGS: Building[] = [
    { id: 'b1', name: 'Sky Towers', description: 'Sky Towers features a high-density 3-phase electrical backbone. Ensure all sensors are calibrated for industrial-grade interference protection.', maintenance: 'Weekly', accessLevel: 'Standard' },
    { id: 'b2', name: 'PowerHouse Apartments', description: 'PowerHouse features modern electrical infrastructure with smart metering on all floors.', maintenance: 'Monthly', accessLevel: 'Premium' },
    { id: 'b3', name: 'Green Valley Block', description: 'Green Valley uses solar-hybrid power distribution. Sensors must support low-voltage mode.', maintenance: 'Bi-Weekly', accessLevel: 'Standard' },
]

const FLATS: Flat[] = [
    { id: 'f1', buildingId: 'b1', unit: '101 - Floor 1' },
    { id: 'f2', buildingId: 'b1', unit: '102 - Floor 1' },
    { id: 'f3', buildingId: 'b1', unit: '201 - Floor 2' },
    { id: 'f4', buildingId: 'b2', unit: 'A-101' },
    { id: 'f5', buildingId: 'b2', unit: 'A-102' },
    { id: 'f6', buildingId: 'b3', unit: 'GV-01' },
]


// ── Modal Picker ──────────────────────────────────────────

type PickerModalProps<T> = {
    visible: boolean;
    title: string;
    data: T[];
    searchQuery: string;
    onSearch: (q: string) => void;
    onSelect: (item: T) => void;
    onClose: () => void;
    labelKey: keyof T;
}

function PickerModal<T>({ visible, title, data, searchQuery, onSearch, onSelect, onClose, labelKey }: PickerModalProps<T>) {
    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalSheet}>
                    <View style={styles.modalHandle} />
                    <Text style={styles.modalTitle}>{title}</Text>

                    <View style={styles.modalSearch}>
                        <Text style={styles.inputIcon}>🔍</Text>
                        <TextInput
                            style={styles.modalSearchInput}
                            placeholder="Search..."
                            placeholderTextColor="#9CA3AF"
                            value={searchQuery}
                            onChangeText={onSearch}
                            autoFocus
                        />
                    </View>

                    <FlatList
                        data={data}
                        keyExtractor={(_, i) => String(i)}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.modalItem} onPress={() => onSelect(item)}>
                                <Text style={styles.modalItemText}>{String(item[labelKey])}</Text>
                                <Text style={styles.modalItemArrow}>›</Text>
                            </TouchableOpacity>
                        )}
                        ItemSeparatorComponent={() => <View style={styles.modalDivider} />}
                        ListEmptyComponent={() => (
                            <Text style={styles.modalEmpty}>No results found</Text>
                        )}
                    />
                </View>
            </View>
        </Modal>
    )
}

// ── Main Screen ───────────────────────────────────────────

const PropertySelectionScreen = () => {
    const navigation = useNavigation<any>()
    const insets = useSafeAreaInsets()
    const { setFlatDetails } = useSession()
    const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(null)
    const [selectedFlat, setSelectedFlat] = useState<Flat | null>(null)

    const [buildingModal, setBuildingModal] = useState(false)
    const [flatModal, setFlatModal] = useState(false)

    const [buildingSearch, setBuildingSearch] = useState('')
    const [flatSearch, setFlatSearch] = useState('')

    const filteredBuildings = BUILDINGS.filter(b =>
        b.name.toLowerCase().includes(buildingSearch.toLowerCase())
    )

    const filteredFlats = FLATS.filter(f =>
        f.buildingId === selectedBuilding?.id &&
        f.unit.toLowerCase().includes(flatSearch.toLowerCase())
    )

    const handleSelectBuilding = (building: Building) => {
        setSelectedBuilding(building)
        setSelectedFlat(null) // reset flat when building changes
        setBuildingSearch('')
        setBuildingModal(false)
    }

    const handleSelectFlat = (flat: Flat) => {
        setSelectedFlat(flat)
        setFlatSearch('')
        setFlatModal(false)
    }

    const handleContinue = () => {
        if (!selectedBuilding || !selectedFlat) return
        setFlatDetails({
            FlatName: selectedFlat.unit,
            FlatId: selectedFlat.id,
            buildingName: selectedBuilding.name,
            buildingId: selectedBuilding.id,
        });
        navigation.navigate('Sensor Type', {
            building: selectedBuilding,
            flat: selectedFlat,
        })
    }

    const canContinue = !!selectedBuilding && !!selectedFlat

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* <Button title='Try!' onPress={() => { Sentry.captureException(new Error('First error')) }} /> */}
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={styles.backArrow}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Property Selection</Text>
                <View style={{ width: 22 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}>

                {/* Selection Card */}
                <View style={styles.card}>
                    <Text style={styles.title}>Property Selection</Text>

                    {/* Building Dropdown */}
                    <Text style={styles.fieldLabel}>Select Building</Text>
                    <Dropdown
                        placeholder="Search or select building..."
                        value={selectedBuilding?.name ?? ''}
                        onPress={() => setBuildingModal(true)}
                    />

                    {/* Flat Dropdown */}
                    <Text style={[styles.fieldLabel, { marginTop: 16 }]}>Select Flat / Unit</Text>
                    <Dropdown
                        placeholder="Search unit number..."
                        value={selectedFlat?.unit ?? ''}
                        onPress={() => setFlatModal(true)}
                        disabled={!selectedBuilding}
                    />
                </View>

                {/* Building Info Card — shown after selection */}
                {selectedBuilding && (
                    <View style={styles.infoCard}>
                        <View style={styles.infoIconWrapper}>
                            <Text style={styles.infoIcon}>ⓘ</Text>
                        </View>
                        <View style={styles.infoContent}>
                            <Text style={styles.infoTitle}>{selectedBuilding.name}</Text>
                            <Text style={styles.infoDescription}>
                                {selectedBuilding.description}
                            </Text>
                            <View style={styles.infoDivider} />
                            <View style={styles.infoMetaRow}>
                                <View style={styles.infoMeta}>
                                    <Text style={styles.infoMetaLabel}>Maintenance</Text>
                                    <Text style={styles.infoMetaValue}>{selectedBuilding.maintenance}</Text>
                                </View>
                                <View style={styles.infoMetaDivider} />
                                <View style={styles.infoMeta}>
                                    <Text style={styles.infoMetaLabel}>Access Level</Text>
                                    <Text style={styles.infoMetaValue}>{selectedBuilding.accessLevel}</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                )}

            </ScrollView>

            {/* Footer */}

            <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
                <TouchableOpacity
                    style={[styles.continueButton, !canContinue && styles.continueDisabled]}
                    activeOpacity={0.85}
                    onPress={handleContinue}
                    disabled={!canContinue}>
                    <Text style={styles.continueText}>Continue</Text>
                </TouchableOpacity>
            </View>

            {/* Building Picker Modal */}
            <PickerModal
                visible={buildingModal}
                title="Select Building"
                data={filteredBuildings}
                searchQuery={buildingSearch}
                onSearch={setBuildingSearch}
                onSelect={handleSelectBuilding}
                onClose={() => setBuildingModal(false)}
                labelKey="name"
            />

            {/* Flat Picker Modal */}
            <PickerModal
                visible={flatModal}
                title="Select Flat / Unit"
                data={filteredFlats}
                searchQuery={flatSearch}
                onSearch={setFlatSearch}
                onSelect={handleSelectFlat}
                onClose={() => setFlatModal(false)}
                labelKey="unit"
            />

        </View>
    )
}

export default PropertySelectionScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F0F2F8',
    },

    // Header
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    backArrow: {
        fontSize: 22,
        color: '#3B5BDB',
        fontWeight: '600',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#3B5BDB',
    },

    // Scroll
    scrollContent: {
        paddingHorizontal: 16,
        paddingBottom: 24,
        gap: 16,
    },

    // Selection card
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 18,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
    },
    title: {
        fontSize: 20,
        fontWeight: '800',
        color: '#111827',
        marginBottom: 18,
    },
    fieldLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },

    // Info card
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        gap: 12,
    },
    infoIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#EEF2FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    infoIcon: {
        fontSize: 18,
        color: '#3B5BDB',
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '700',
        color: '#3B5BDB',
        marginBottom: 6,
    },
    infoDescription: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 20,
    },
    infoDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 12,
    },
    infoMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoMeta: {
        flex: 1,
    },
    infoMetaDivider: {
        width: 1,
        height: 32,
        backgroundColor: '#E5E7EB',
        marginHorizontal: 12,
    },
    infoMetaLabel: {
        fontSize: 11,
        color: '#9CA3AF',
        fontWeight: '500',
        marginBottom: 2,
    },
    infoMetaValue: {
        fontSize: 14,
        color: '#111827',
        fontWeight: '700',
    },

    // Footer
    footer: {
        paddingHorizontal: 16,
        paddingTop: 12,
        backgroundColor: '#F0F2F8',
    },
    continueButton: {
        backgroundColor: '#3B5BDB',
        borderRadius: 30,
        paddingVertical: 16,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
        elevation: 2,
        shadowColor: '#3B5BDB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    continueDisabled: {
        opacity: 0.5,
    },
    continueText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.3,
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'flex-end',
    },
    modalSheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        maxHeight: '70%',
    },
    modalHandle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#E5E7EB',
        alignSelf: 'center',
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 14,
    },
    modalSearch: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#E5E7EB',
        paddingHorizontal: 12,
        height: 46,
        marginBottom: 12,
    },
    inputIcon: {
        fontSize: 14,
        marginRight: 8,
        color: '#9CA3AF',
    },
    modalSearchInput: {
        flex: 1,
        fontSize: 14,
        color: '#111827',
    },
    modalItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        justifyContent: 'space-between',
    },
    modalItemText: {
        fontSize: 15,
        color: '#111827',
        fontWeight: '500',
    },
    modalItemArrow: {
        fontSize: 20,
        color: '#9CA3AF',
    },
    modalDivider: {
        height: 1,
        backgroundColor: '#F3F4F6',
    },
    modalEmpty: {
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: 14,
        paddingVertical: 24,
    },
})