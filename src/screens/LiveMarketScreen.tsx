import { ActivityIndicator, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import StockCard, { StockProps } from '../components/StockCard'
import { StockService } from '../services/StockService'

const LiveMarketScreen = () => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [allStocks, setAllStocks] = useState<StockProps[]>([])
    const [searchText, setSearchText] = useState<string>('');
    const [error, setError] = useState<string | null>(null)
    const [filteredStocks, setFilteredStocks] = useState<StockProps[]>([])

    const fetchStockData = async () => {
        if (searchText.length < 2) return;
        try {
            setIsLoading(true)
            setError(null)

            const response = await StockService.searchStocks(searchText)

            setAllStocks(response)
            setFilteredStocks(response);
        }
        catch (err: any) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        // If user clears the box, clear the list
        if (searchText.length === 0) {
            setAllStocks([]);
            setFilteredStocks([]);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            fetchStockData();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchText]);

    useEffect(() => {
        if (!allStocks) return;

        // This ensures the UI is responsive even if the network is slow
        const results = allStocks.filter(stock =>
            stock.symbol.toLowerCase().includes(searchText.toLowerCase()) ||
            stock.name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredStocks(results);
    }, [searchText, allStocks]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle} >Indian Market (Live)</Text>
                <TextInput
                    placeholder="Search Symbol..."
                    value={searchText}
                    onChangeText={(text) => setSearchText(text)}
                    placeholderTextColor="#999"
                />
            </View>
            {isLoading && allStocks.length === 0 ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#6200EE" />
                    <Text style={{ marginTop: 10 }}>Fetchings latest prices...</Text>
                </View>
            ) : error ? (
                <View style={styles.center}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={fetchStockData}>
                        <Text style={{ color: '#fff' }}>Retry</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <FlatList
                    data={filteredStocks}
                    keyExtractor={(item, index) => item.symbol + index}
                    renderItem={({ item }) => (
                        <StockCard
                            symbol={item.symbol}
                            price={item.price}
                            change={item.change}
                            name={item.name}
                            exchange={item.exchange}
                            onPress={() => console.log(`Selected: ${item.symbol}`)}
                        />
                    )}
                    // Pull to Refresh feature!
                    // onRefresh={fetchStockData}
                    refreshing={isLoading}
                    ListEmptyComponent={() => (
                        searchText.length > 1 && !isLoading ? (
                            <View style={styles.center}>
                                <Text>No stocks found for "{searchText}"</Text>
                            </View>
                        ) : null
                    )}
                />
            )}
        </SafeAreaView>
    )
}

export default LiveMarketScreen

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F9FA' },
    header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#EEE' },
    headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A', marginBottom: 15 },
    searchBar: { height: 45, backgroundColor: '#F1F3F4', borderRadius: 10, paddingHorizontal: 15 },
    listContent: { padding: 16 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorText: { color: 'red', marginBottom: 15 },
    retryBtn: { backgroundColor: '#6200EE', padding: 10, borderRadius: 5 }
});