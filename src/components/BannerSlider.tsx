import React from 'react';
import {View, Image, StyleSheet} from 'react-native';

export default function BannerSlider({data}: {data: any}) {
  return (
    <View style={styles.container}>
      <Image source={data.image} style={styles.image} resizeMode="stretch" />
    </View>
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
