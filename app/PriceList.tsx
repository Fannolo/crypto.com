import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { CryptoCurrency, useFetchPriceList, useisEURSupportedFlagChange } from './useInterviewHook';
// Define the cryptocurrency data type

interface PriceData {
  code: string;
  data: CryptoCurrency[];
}

const PriceList: React.FC = () => {
  const {priceList} = useFetchPriceList()
  const [cryptoData, setCryptoData] = useState<CryptoCurrency[]>([]);
  const [filteredData, setFilteredData] = useState<CryptoCurrency[]>([]);

  useEffect(() => {
    console.log('priceList', priceList)
    
    setCryptoData(priceList);
    setFilteredData(priceList);
    
  }, [priceList]);

  // Format the price based on its value
  const formatPrice = (price: number): string => {
    if (price >= 1) {
      // For values greater than or equal to 1, show up to 2 decimal places
      return price.toFixed(2);
    } else if (price >= 0.01) {
      // For values between 0.01 and 1, show up to 2 decimal places
      return price.toFixed(2);
    } else {
      // For very small values, show more decimal places as needed
      return price.toFixed(5);
    }
  };

  // Render each cryptocurrency item
  const renderItem = ({ item }: { item: CryptoCurrency }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.nameText}>{item.name}</Text>
      <Text style={styles.priceText}>USD: {formatPrice(item.usd)}</Text>
      {/* // TODO: extend to show EUR price if EUR is available */}
      <View style={styles.separator} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* // TODO: Loading State */}
      {/* // TODO: Error State */}
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  searchContainer: {
    padding: 10,
    backgroundColor: '#F5F5F5',
  },
  searchInput: {
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  nameText: {
    fontSize: 18,
    color: '#000000',
  },
  priceText: {
    fontSize: 14,
    marginTop: 2,
    color: '#333333',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#E5E5E5',
    marginTop: 8,
  }
});

export default PriceList; 