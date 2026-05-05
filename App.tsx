import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function App() {
  const [state, setState] = useState(0);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text testID="test_maestro" style={{ fontSize: 24 }}>Test Maestro!</Text>
      <Button testID="increment_button" title="Increment" onPress={() => setState(state + 1)} />
      <Button testID="decrement_button" title="Decrement" onPress={() => setState(state - 1)} />
      <View style={{ height: 2, width: '100%', backgroundColor: 'black', marginVertical: 20 }} />
      <Text testID="state_text" style={{ fontSize: 24 }}>{state}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
