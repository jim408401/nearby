import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Alert, Platform, Linking, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Config } from '../../constants/Config';
import * as Location from 'expo-location';
import { NotificationService } from '../../services/NotificationService';
import { MapService } from '../../services/MapService';

interface Store {
  _id: string;
  name: string;
  address: string;
  description: string;
  category: string;
  rating: number;
  location: {
    coordinates: [number, number];
  };
}

declare global {
  interface Window {
    google: any;
    initMap?: () => void;
  }
}

export default function HomeScreen() {
  const [stores, setStores] = useState<Store[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // 開始監聽位置變化
  const startLocationUpdates = async () => {
    try {
      // 先停止之前的監聽
      if (locationSubscription) {
        locationSubscription.remove();
      }

      // 開始新的監聽
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,
          distanceInterval: 10,
        },
        (location) => {
          console.log('位置更新:', {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy
          });
          setUserLocation(location);
        }
      );

      setLocationSubscription(subscription);
    } catch (error) {
      console.error('設置位置監聽失敗:', error);
    }
  };

  // 清理位置監聽
  useEffect(() => {
    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, [locationSubscription]);

  // 請求位置權限並開始監聽
  useEffect(() => {
    (async () => {
      try {
        console.log('開始請求位置權限...');
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setLocationError('需要位置權限才能顯示您的位置');
          Alert.alert('權限錯誤', '需要位置權限才能顯示您的位置');
          return;
        }

        // 設定測試位置（鼎泰豐附近）
        const testLocation = {
          coords: {
            latitude: 25.0335,
            longitude: 121.5665,
            accuracy: 5,
            altitude: null,
            altitudeAccuracy: null,
            heading: null,
            speed: null
          },
          timestamp: Date.now()
        };

        console.log('使用測試位置:', {
          latitude: testLocation.coords.latitude,
          longitude: testLocation.coords.longitude
        });
        
        setUserLocation(testLocation);

        // 模擬位置更新
        const interval = setInterval(() => {
          const updatedLocation = {
            ...testLocation,
            timestamp: Date.now()
          };
          setUserLocation(updatedLocation);
        }, 5000);

        return () => clearInterval(interval);

      } catch (error) {
        console.error('位置設置失敗:', error);
        setLocationError('無法設置位置');
        Alert.alert('錯誤', '無法設置位置');
      }
    })();
  }, []);

  // 獲取店家資料
  useEffect(() => {
    const fetchStores = async () => {
      try {
        console.log('開始獲取店家資料...');
        const response = await axios.get(`${Config.API_BASE_URL}/stores`);
        console.log('獲取店家資料成功:', response.data);
        setStores(response.data);
      } catch (error) {
        console.error('獲取店家失敗:', error);
        Alert.alert('錯誤', '無法獲取店家資料');
      }
    };

    fetchStores();
  }, []);

  // 請求通知權限
  const requestNotificationPermission = async () => {
    try {
      const hasPermission = await NotificationService.requestPermissions();
      if (hasPermission) {
        setNotificationPermission('granted');
        Alert.alert('成功', '通知權限已啟用！');
      }
    } catch (error) {
      console.error('請求通知權限失敗:', error);
    }
  };

  // 檢查附近的店家並發送通知
  useEffect(() => {
    if (!userLocation || stores.length === 0 || notificationPermission !== 'granted') return;

    const checkNearbyStores = async () => {
      try {
        console.log('開始檢查附近店家...');
        
        // 檢查每個店家的距離
        for (const store of stores) {
          const distance = calculateDistance(
            userLocation.coords.latitude,
            userLocation.coords.longitude,
            store.location.coordinates[1],
            store.location.coordinates[0]
          );

          console.log(`檢查店家: ${store.name}, 距離: ${distance}公尺`);
          
          if (distance <= 50) {
            console.log(`發送 ${store.name} 的通知，距離: ${distance}公尺`);
            await NotificationService.sendLocationBasedNotification(
              store.name,
              Math.round(distance)
            );
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      } catch (error) {
        console.error('檢查附近店家失敗:', error);
      }
    };

    // 立即檢查一次
    checkNearbyStores();

    // 每 15 秒檢查一次附近店家
    const checkInterval = setInterval(checkNearbyStores, 15000);

    return () => clearInterval(checkInterval);
  }, [userLocation, stores, notificationPermission]);

  // 計算兩點之間的距離（公尺）
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // 地球半徑（公尺）
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  // 初始化地圖
  useEffect(() => {
    const initMap = async () => {
      try {
        await MapService.loadGoogleMapsAPI();
        if (!window.google) {
          throw new Error('Google Maps API 載入失敗');
        }

        console.log('開始載入地圖...');
        const initialLocation = userLocation ? {
          lat: userLocation.coords.latitude,
          lng: userLocation.coords.longitude,
        } : { lat: 25.0330, lng: 121.5654 };

        console.log('地圖初始位置:', initialLocation);

        const map = new window.google.maps.Map(
          document.getElementById('map'),
          {
            zoom: 15,
            center: initialLocation,
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
          }
        );

        // 添加使用者位置標記
        if (userLocation) {
          console.log('添加使用者位置標記');
          new window.google.maps.Marker({
            position: initialLocation,
            map: map,
            title: '您的位置',
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#4285F4',
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#ffffff',
            },
          });
        }

        // 添加店家標記
        console.log('開始添加店家標記...');
        stores.forEach(store => {
          const position = {
            lat: store.location.coordinates[1],
            lng: store.location.coordinates[0],
          };
          console.log(`添加店家標記: ${store.name}`, position);

          const marker = new window.google.maps.Marker({
            position: position,
            map: map,
            title: store.name,
          });

          // 添加資訊視窗
          const infowindow = new window.google.maps.InfoWindow({
            content: `
              <div style="padding: 10px;">
                <h3 style="margin: 0 0 5px 0;">${store.name}</h3>
                <p style="margin: 0 0 5px 0;">${store.address}</p>
                <p style="margin: 0 0 5px 0;">${store.description}</p>
                <p style="margin: 0;">評分: ${store.rating}/5</p>
              </div>
            `,
          });

          // 點擊標記時顯示資訊視窗
          marker.addListener('click', () => {
            infowindow.open(map, marker);
          });
        });

        setMapLoaded(true);
        console.log('地圖載入完成');
      } catch (error) {
        console.error('載入地圖失敗:', error);
        Alert.alert('錯誤', '無法載入地圖');
      }
    };

    initMap();
  }, [stores, userLocation]);

  return (
    <View style={styles.container}>
      {locationError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{locationError}</Text>
        </View>
      )}
      {!mapLoaded && (
        <View style={styles.loading}>
          <Text>載入地圖中...</Text>
        </View>
      )}
      {notificationPermission !== 'granted' && (
        <View style={styles.notificationButtonContainer}>
          <TouchableOpacity
            style={styles.notificationButton}
            onPress={requestNotificationPermission}
          >
            <Text style={styles.notificationButtonText}>
              啟用店家通知
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <div id="map" style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
      }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    position: 'absolute',
    top: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 5,
    zIndex: 1000,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
  },
  notificationButtonContainer: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1000,
  },
  notificationButton: {
    backgroundColor: '#4285F4',
    padding: 10,
    borderRadius: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  notificationButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
