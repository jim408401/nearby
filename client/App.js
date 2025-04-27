import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MapScreen from './components/MapScreen';
import StoreList from './components/StoreList';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Map">
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{ title: '地圖' }}
        />
        <Stack.Screen
          name="StoreList"
          component={StoreList}
          options={{ title: '店家列表' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 