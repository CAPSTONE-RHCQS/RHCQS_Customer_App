import React from 'react';
import {View, Image, StyleSheet, TouchableOpacity} from 'react-native';

export default function BannerSlider({data, onPress}: {data: any, onPress: () => void}) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}> 
      <View >
        <Image source={data.image} style={styles.image} resizeMode="stretch" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: '100%',
    width: '90%',
    borderRadius: 16,
  },
});
