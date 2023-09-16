import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, View } from 'react-native';
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';

export default function App() {
  const [permission, setPermission] = useState(false);
  const devices = useCameraDevices();
  console.log({devices})
  const device = devices.back;

  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.getCameraPermissionStatus();
      if (cameraPermission !== 'granted' ) {
        const newCameraPermission = await Camera.requestCameraPermission();
        setPermission(newCameraPermission === 'granted');
        return;
      }
      setPermission(cameraPermission === 'granted');
    })()
  }, []);

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet'
    const isHotdog = detectIsHotdog(frame)
    console.log(isHotdog ? "Hotdog!" : "Not Hotdog.")
  }, [])

  if (device == null) return <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}><ActivityIndicator /></View>;
  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      frameProcessor={frameProcessor}
    />
  )
};
