import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [stores, setStores] = useState([]);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('需要位置權限才能使用此功能');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      // 獲取附近的店家
      try {
        const response = await axios.get('http://localhost:5000/api/stores/nearby', {
          params: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
        });
        setStores(response.data);
      } catch (error) {
        console.error('獲取店家失敗:', error);
      }
    })();
  }, []);

  return (
    <View style={styles.container}>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="您的位置"
            pinColor="blue"
          />
          {stores.map((store) => (
            <Marker
              key={store._id}
              coordinate={{
                latitude: store.location.coordinates[1],
                longitude: store.location.coordinates[0],
              }}
              title={store.name}
              description={store.address}
            />
          ))}
        </MapView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default MapScreen; 