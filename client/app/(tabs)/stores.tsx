import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Config } from '../../constants/Config';

interface Store {
  _id: string;
  name: string;
  address: string;
  rating?: number;
}

export default function StoresScreen() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get(`${Config.API_BASE_URL}/stores`);
        setStores(response.data);
        setLoading(false);
      } catch (error) {
        console.error('獲取店家列表失敗:', error);
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  const renderStoreItem = ({ item }: { item: Store }) => (
    <TouchableOpacity
      style={styles.storeItem}
      onPress={() => {
        // 導航到店家詳情頁面
      }}
    >
      <Text style={styles.storeName}>{item.name}</Text>
      <Text style={styles.storeAddress}>{item.address}</Text>
      {item.rating && (
        <Text style={styles.storeRating}>評分: {item.rating}/5</Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>載入中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={stores}
        renderItem={renderStoreItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 16,
  },
  storeItem: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  storeName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  storeAddress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  storeRating: {
    fontSize: 14,
    color: '#ff9500',
  },
}); 