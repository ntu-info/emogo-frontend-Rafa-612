import * as Location from 'expo-location';

export interface LocationData {
  latitude: number;
  longitude: number;
  address: string | null;
}

export const requestLocationPermissions = async () => {
  try {
    const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
    
    if (foregroundStatus !== 'granted') {
      alert('請允許位置權限以追蹤您的情緒模式！');
      return false;
    }
    
    console.log('✅ Location permission granted');
    return true;
  } catch (error) {
    console.error('Error requesting location permissions:', error);
    return false;
  }
};

export const getCurrentLocation = async (): Promise<LocationData | null> => {
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    
    const { latitude, longitude } = location.coords;
    
    // 反向地理編碼獲取地址
    let address: string | null = null;
    try {
      const [geocode] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      
      if (geocode) {
        address = `${geocode.city || ''}, ${geocode.region || ''}, ${geocode.country || ''}`.trim();
      }
    } catch (geocodeError) {
      console.warn('Could not get address:', geocodeError);
    }
    
    return { latitude, longitude, address };
  } catch (error) {
    console.error('Error getting location:', error);
    return null;
  }
};

export const startLocationTracking = async () => {
  try {
    await Location.startLocationUpdatesAsync('emotion-location-tracking', {
      accuracy: Location.Accuracy.Balanced,
      timeInterval: 60000, // 每分鐘更新一次
      distanceInterval: 100, // 或移動100米更新
    });
    console.log('Location tracking started');
  } catch (error) {
    console.error('Error starting location tracking:', error);
  }
};
