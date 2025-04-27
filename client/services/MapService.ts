export class MapService {
  private static apiKey = 'AIzaSyBUwLlRBZKUxZFePkSINaGbKqTRNo8Xk08';
  private static isLoading = false;
  private static isLoaded = false;

  static async loadGoogleMapsAPI(): Promise<void> {
    if (this.isLoaded) {
      console.log('Google Maps API 已經載入');
      return;
    }

    if (this.isLoading) {
      console.log('Google Maps API 正在載入中');
      return new Promise((resolve) => {
        const checkLoaded = setInterval(() => {
          if (this.isLoaded) {
            clearInterval(checkLoaded);
            resolve();
          }
        }, 100);
      });
    }

    console.log('開始載入 Google Maps API');
    this.isLoading = true;

    return new Promise((resolve, reject) => {
      try {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${this.apiKey}`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          console.log('Google Maps API 載入成功');
          this.isLoaded = true;
          this.isLoading = false;
          resolve();
        };

        script.onerror = (error) => {
          console.error('Google Maps API 載入失敗:', error);
          this.isLoading = false;
          reject(new Error('無法載入 Google Maps API'));
        };

        document.head.appendChild(script);
      } catch (error) {
        console.error('載入 Google Maps API 時發生錯誤:', error);
        this.isLoading = false;
        reject(error);
      }
    });
  }

  static isAPILoaded(): boolean {
    return this.isLoaded;
  }
} 