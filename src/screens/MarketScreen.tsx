import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, TextInput } from 'react-native';
import StockCard, { StockProps } from '../components/StockCard';
import { SafeAreaView } from 'react-native-safe-area-context';

const MarketScreen = () => {
  // Mock Data - In Topic 4 we will replace this with a real API
  const [stocks] = useState<StockProps[]>([
    { symbol: 'RELIANCE', price: 2950.45, change: 1.2, name: 'RELIANCE' },
    { symbol: 'TCS', price: 3820.10, change: -0.5, name:'TCS' },
    { symbol: 'HDFC BANK', price: 1640.00, change: 0.8, name:'HDFC BANK' },
    { symbol: 'IRFC', price: 175.20, change: 4.5, name:'IRFC' }, // Railway interest!
    { symbol: 'RVNL', price: 250.15, change: -1.2, name:'RVNL' },
  ]);

  const [searchText, setSearchText] = useState<string>('');
  const [filteredStocks, setFilteredStocks] = useState<StockProps[]>(stocks)

  useEffect(()=>{
    const results = stocks.filter(stock => stock.symbol.toLowerCase().includes(searchText.toLowerCase()));
    setFilteredStocks(results);
  }, [searchText, stocks])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Indian Market</Text>
        
        {/* Search Input Section */}
        <TextInput
          placeholder="Search Symbol (e.g. IRFC)"
          value={searchText}
          onChangeText={(text) => setSearchText(text)} // This updates the state
          clearButtonMode="while-editing"
        />
      </View>
      
      <FlatList
        data={filteredStocks}
        keyExtractor={(item) => item.symbol}
        renderItem={({ item }) => (
          <StockCard 
            symbol={item.symbol} 
            price={item.price} 
            change={item.change} 
            name={item.name}
            exchange={item.exchange}
          />
        )}
        ListEmptyComponent={
          <Text>No stocks found matching "{searchText}"</Text>
        }
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { padding: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#EEE' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A1A1A' },
  listContent: { padding: 16 },
});

export default MarketScreen;