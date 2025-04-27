import * as Notifications from 'expo-notifications';
import { Platform, Alert, Linking } from 'react-native';

// 聲明 Chrome 相關的全局類型
declare global {
  interface Window {
    chrome?: {
      runtime: any;
    };
  }
}

// 配置通知行為
Notifications.setNotificationHandler({
  handleNotification: async () => {
    console.log('處理新通知...');
    return {
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});

export class NotificationService {
  // 請求通知權限
  static async requestPermissions() {
    try {
      console.log('請求通知權限...');
      if (Platform.OS === 'web') {
        if (!('Notification' in window)) {
          console.error('此瀏覽器不支援通知功能');
          Alert.alert('錯誤', '此瀏覽器不支援通知功能');
          return false;
        }

        const permission = await window.Notification.requestPermission();
        console.log('瀏覽器通知權限狀態:', permission);
        
        if (permission === 'granted') {
          return true;
        } else {
          // 根據不同瀏覽器提供具體的設置指南
          const browserName = this.getBrowserName();
          const instructions = this.getNotificationInstructions(browserName);
          
          Alert.alert(
            '需要通知權限',
            `您已經封鎖了通知權限。請依照以下步驟啟用：\n\n${instructions}`,
            [
              {
                text: '開啟設定',
                onPress: () => {
                  // 嘗試打開瀏覽器設定
                  if (browserName === 'Chrome') {
                    window.open('chrome://settings/content/notifications');
                  } else if (browserName === 'Firefox') {
                    window.open('about:preferences#privacy');
                  } else if (browserName === 'Safari') {
                    Alert.alert(
                      'Safari 設定指南',
                      '1. 點擊 Safari 選單\n2. 選擇「偏好設定」\n3. 前往「網站」標籤\n4. 找到「通知」\n5. 找到本網站並允許通知'
                    );
                  }
                }
              },
              {
                text: '重新載入頁面',
                onPress: () => {
                  window.location.reload();
                }
              },
              { text: '取消' }
            ]
          );
          return false;
        }
      } else {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        console.log('當前通知權限狀態:', existingStatus);
        
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
          console.log('新的通知權限狀態:', status);
        }

        if (finalStatus !== 'granted') {
          Alert.alert('錯誤', '需要通知權限才能接收店家通知');
          return false;
        }

        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }

        return true;
      }
    } catch (error) {
      console.error('請求通知權限失敗:', error);
      Alert.alert('錯誤', '無法請求通知權限');
      return false;
    }
  }

  private static getBrowserName(): string {
    const userAgent = window.navigator.userAgent.toLowerCase();
    if (userAgent.indexOf('chrome') > -1) {
      return 'Chrome';
    } else if (userAgent.indexOf('firefox') > -1) {
      return 'Firefox';
    } else if (userAgent.indexOf('safari') > -1) {
      return 'Safari';
    }
    return 'Unknown';
  }

  private static getNotificationInstructions(browser: string): string {
    switch (browser) {
      case 'Chrome':
        return '1. 點擊網址列左側的鎖頭圖示\n2. 在「通知」選項中選擇「允許」\n3. 重新整理頁面';
      case 'Firefox':
        return '1. 點擊網址列左側的通知圖示\n2. 選擇「允許通知」\n3. 重新整理頁面';
      case 'Safari':
        return '1. 點擊 Safari 選單\n2. 選擇「偏好設定」\n3. 前往「網站」標籤\n4. 找到「通知」\n5. 找到本網站並允許通知';
      default:
        return '請在瀏覽器設定中找到通知權限設定，並允許本網站發送通知';
    }
  }

  // 發送本地通知
  static async sendNotification(title: string, body: string) {
    try {
      console.log('準備發送通知:', { title, body });
      const hasPermission = await this.requestPermissions();
      
      if (!hasPermission) {
        console.log('沒有通知權限，無法發送通知');
        return;
      }

      if (Platform.OS === 'web') {
        console.log('使用瀏覽器原生通知');
        new Notification(title, {
          body: body,
          icon: '/icon.png' // 如果有應用圖標的話
        });
      } else {
        console.log('使用 Expo 通知');
        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            sound: true,
            priority: Notifications.AndroidNotificationPriority.HIGH,
          },
          trigger: null,
        });
      }
      
      console.log('通知發送成功');
    } catch (error) {
      console.error('發送通知失敗:', error);
      Alert.alert('錯誤', '發送通知失敗');
    }
  }

  // 發送位置相關通知
  static async sendLocationBasedNotification(storeName: string, distance: number) {
    console.log('準備發送位置相關通知:', { storeName, distance });
    await this.sendNotification(
      '發現附近好店！',
      `${storeName} 距離您只有 ${distance} 公尺`
    );
  }

  // 取消所有通知
  static async cancelAllNotifications() {
    if (Platform.OS === 'web') {
      // Web 平台沒有取消通知的 API
      return;
    }
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
} 