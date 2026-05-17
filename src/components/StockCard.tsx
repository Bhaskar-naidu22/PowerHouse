import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

// Topic 8/9: Using TypeScript interfaces for our data "Model"
export interface StockProps {
  symbol: string;
  price: number;
  change: number;
  name: string;
  exchange : string;
  onPress?: () => void;
}

const StockCard = ({ symbol, price, change, name, exchange, onPress }: StockProps) => {
  const isPositive = change >= 0;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View>
        {/* <Text style={styles.symbol}>{symbol}</Text> */}
        <Text style={styles.symbol}>{name}</Text>
        <Text/>
        <Text style={styles.market}>{exchange}</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>₹{price.toLocaleString('en-IN')}</Text>
        <Text style={[styles.change, { color: isPositive ? '#4CAF50' : '#F44336' }]}>
          {isPositive ? '+' : ''}{change}%
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2, // Android Shadow
    shadowColor: '#000', // iOS Shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  symbol: { fontSize: 18, fontWeight: 'bold', color: '#1A1A1A' },
  market: { fontSize: 12, color: '#666' },
  priceContainer: { alignItems: 'flex-end' },
  price: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  change: { fontSize: 14, fontWeight: '600' },
});

export default StockCard;