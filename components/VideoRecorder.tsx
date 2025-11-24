import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystemLegacy from 'expo-file-system/legacy';

interface VideoRecorderProps {
  onVideoRecorded: (videoUri: string) => void;
  onCancel: () => void;
}

export default function VideoRecorder({ onVideoRecorded, onCancel }: VideoRecorderProps) {
  const [facing, setFacing] = useState<CameraType>('front');
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const cameraRef = useRef<CameraView>(null);

  if (!permission || !mediaPermission) {
    return <View style={styles.container}><Text>Loading...</Text></View>;
  }

  if (!permission.granted || !mediaPermission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>需要相機和媒體庫權限</Text>
        <TouchableOpacity style={styles.button} onPress={() => {
          requestPermission();
          requestMediaPermission();
        }}>
          <Text style={styles.buttonText}>授予權限</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const startRecording = async () => {
    if (!cameraRef.current || isRecording) return;

    try {
      // 倒數計時 3, 2, 1
      for (let i = 3; i > 0; i--) {
        setCountdown(i);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      setCountdown(null);

      setIsRecording(true);
      
      const video = await cameraRef.current.recordAsync({
        maxDuration: 1, // 1 秒
        quality: '720p',
      });

      setIsRecording(false);

      if (video?.uri) {
        await saveVideo(video.uri);
      }
    } catch (error) {
      console.error('Error recording video:', error);
      setIsRecording(false);
      setCountdown(null);
      Alert.alert('Error', 'Failed to record video');
    }
  };

  const saveVideo = async (uri: string) => {
    try {
      // 保存到媒體庫
      const asset = await MediaLibrary.createAssetAsync(uri);
      console.log('Video saved to media library:', asset.uri);

      // 複製到 app 的文件目錄
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `emogo_video_${timestamp}.mp4`;
      const newPath = `${FileSystemLegacy.documentDirectory}${fileName}`;
      
      await FileSystemLegacy.copyAsync({
        from: uri,
        to: newPath,
      });

      console.log('Video copied to:', newPath);
      onVideoRecorded(newPath);
    } catch (error) {
      console.error('Error saving video:', error);
      Alert.alert('Error', 'Failed to save video');
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
    }
  };

  return (
    <View style={styles.container}>
      <CameraView 
        ref={cameraRef} 
        style={styles.camera} 
        facing={facing}
        mode="video"
      >
        <View style={styles.overlay}>
          <View style={styles.topSection}>
            {isRecording && (
              <View style={styles.recordingIndicator}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>錄製中...</Text>
              </View>
            )}
          </View>

          {countdown && (
            <View style={styles.countdownContainer}>
              <Text style={styles.countdownText}>{countdown}</Text>
            </View>
          )}

          <View style={styles.bottomSection}>
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={onCancel}
                disabled={isRecording}
              >
                <Text style={styles.buttonText}>取消</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.recordButton, isRecording && styles.recordingButton]}
                onPress={isRecording ? stopRecording : startRecording}
                disabled={countdown !== null}
              >
                <View style={styles.recordButtonInner} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.flipButton]}
                onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}
                disabled={isRecording || countdown !== null}
              >
                <Text style={styles.buttonText}>翻轉</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: '#fff',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 50,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelButton: {
    backgroundColor: 'rgba(255,59,48,0.8)',
  },
  flipButton: {
    backgroundColor: 'rgba(0,122,255,0.8)',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'white',
  },
  recordingButton: {
    borderColor: '#ff3b30',
  },
  recordButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ff3b30',
  },
  countdownContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countdownText: {
    fontSize: 120,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  recordingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,59,48,0.9)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginTop: 50,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
    marginRight: 8,
  },
  recordingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
