import React, { useState, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  NativeModules,
  ListRenderItem,
} from 'react-native';
import { CryptoCurrency, useFetchPriceList, useIsEURSupportedFlagChange } from './useInterviewHook';

// Native navigation module to communicate with iOS
const { NavigationModule } = NativeModules;

const PriceList: React.FC = () => {
  const { priceList, loading, error, refetch } = useFetchPriceList();
  const isEURSupported = useIsEURSupportedFlagChange();
  const [refreshing, setRefreshing] = useState(false);

  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  // Format the price based on its value
  const formatPrice = (price: number): string => {
    if (price >= 1) {
      return price.toFixed(2);
    } else if (price >= 0.01) {
      return price.toFixed(4);
    } else {
      return price.toFixed(8);
    }
  };

  // Handle item press for navigation
  const handleItemPress = (item: CryptoCurrency) => {
    // Call native module to navigate to detail view
    if (NavigationModule && NavigationModule.navigateToDetail) {
      NavigationModule.navigateToDetail(item.id);
    }
  };

  // Render each cryptocurrency item
  const renderItem: ListRenderItem<CryptoCurrency> = ({ item }) => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => handleItemPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.itemContent}>
        <Text style={styles.nameText}>{item.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.priceText}>USD: ${formatPrice(item.usd)}</Text>
          {isEURSupported && item.eur != null && (
            <Text style={styles.priceText}>EUR: €{formatPrice(item.eur)}</Text>
          )}
        </View>
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.map((tag, index) => (
              <View key={`${item.id}-${tag}-${index}`} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <View style={styles.separator} />
    </TouchableOpacity>
  );

  // Key extractor for FlatList optimization
  const keyExtractor = useCallback((item: CryptoCurrency) => item.id.toString(), []);

  // Get item layout for performance optimization
  const getItemLayout = useCallback(
    (data: ArrayLike<CryptoCurrency> | null | undefined, index: number) => ({
      length: 100, // Approximate height of each item
      offset: 100 * index,
      index,
    }),
    []
  );

  // Empty list component
  const ListEmptyComponent = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No cryptocurrencies available</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {loading && priceList.length === 0 ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading prices...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={priceList}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          style={styles.list}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#007AFF" />
          }
          getItemLayout={getItemLayout}
          ListEmptyComponent={ListEmptyComponent}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          removeClippedSubviews={true}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  itemContainer: {
    backgroundColor: '#FFFFFF',
  },
  itemContent: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  priceText: {
    fontSize: 14,
    color: '#333333',
  },
  tagsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  tag: {
    backgroundColor: '#F0F0F0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#666666',
  },
  separator: {
    height: 0.5,
    backgroundColor: '#E5E5E5',
    marginLeft: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666666',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666666',
  },
});

export default PriceList;
