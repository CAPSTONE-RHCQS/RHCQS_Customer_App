import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import AppBar from '../../components/Appbar';

const RoughPackager: React.FC = () => {
  return (
    <View style={styles.container}>
      <AppBar nameScreen="Gói thi công thô" />
      <Text>RoughPackager</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default RoughPackager;
