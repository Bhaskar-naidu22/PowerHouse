import { FlatList, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text, TextInput } from '../components/AppText'
import React, { useState } from 'react'
import { ActivityCard } from '../components/ActivityCard'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { RECENT_ACTIVITY_DATA } from '../utils/RecentActivityData'
import { Icon } from '../components/IconComponent'


type FilterStatusType = 'All' | 'Completed' | 'Pending';
const FILTER_TABS: FilterStatusType[] = ['All', 'Completed', 'Pending'];

const FlatStatus = () => {
    const navigation = useNavigation<any>()
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState<FilterStatusType>('All')
    const handlePlusButton = () => {
        navigation.navigate("PropertySelectionScreen")
    }
    const filteredData = RECENT_ACTIVITY_DATA.filter((item: any) => {
        // Check text search matching building or subtext details
        const matchesSearch = 
            item.building?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.details?.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Match status pill badge conditions 
        const matchesTab = activeTab === 'All' || item.status === activeTab;
        
        return matchesSearch && matchesTab;
    });
    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']} >
            <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />
            <View style={styles.searchContainer}>
                <Icon name="search" size={20} color="#3B5BDB" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search flat or building..."
                    placeholderTextColor="#9CA3AF"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    clearButtonMode="while-editing"
                />
            </View>
            <View style={styles.filterTabsWrapper}>
                <FlatList
                    data={FILTER_TABS}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item}
                    contentContainerStyle={styles.tabsScrollContent}
                    renderItem={({ item }) => {
                        const isActive = activeTab === item;
                        return (
                            <TouchableOpacity
                                style={[styles.tabButton, isActive ? styles.tabButtonActive : styles.tabButtonInactive]}
                                onPress={() => setActiveTab(item)}
                                activeOpacity={0.7}
                            >
                                <Text style={[styles.tabText, isActive ? styles.tabTextActive : styles.tabTextInactive]}>
                                    {item}
                                </Text>
                            </TouchableOpacity>
                        );
                    }}
                />
            </View>
            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <ActivityCard item={item} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity style={styles.fab} activeOpacity={0.85} onPress={handlePlusButton}>
                <Icon name="add" size={28} color="#FFFFFF" />
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default FlatStatus

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 30
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 100, // Clearance for FAB placement
        gap: 14,
    },
    fab: {
        position: 'absolute',
        bottom: 40,
        right: 40,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#3B5BDB',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 0,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF2F7',
        borderRadius: 12,
        paddingHorizontal: 14,
        marginHorizontal: 16,
        height: 48,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 16,
        gap: 8,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: '#1F2937',
        paddingVertical: 0, // Fix vertical layout centering issues on Android
    },
    filterTabsWrapper: {
        marginBottom: 16,
    },
    tabsScrollContent: {
        paddingHorizontal: 16,
        gap: 8,
    },
    tabButton: {
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
    },
    tabButtonActive: {
        backgroundColor: '#004DE3',
        borderColor: '#004DE3',
    },
    tabButtonInactive: {
        backgroundColor: '#EFF2F7',
        borderColor: '#E2E8F0',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
    },
    tabTextActive: {
        color: '#FFFFFF',
    },
    tabTextInactive: {
        color: '#4B5563',
    },
    emptyText: {
        textAlign: 'center',
        color: '#9CA3AF',
        marginTop: 40,
        fontSize: 14,
    },
})