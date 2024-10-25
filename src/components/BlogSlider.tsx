import {FONTFAMILY} from '../theme/theme';
import React from 'react';
import {View, Image, StyleSheet, Text, TouchableOpacity} from 'react-native';

export default function BlogSlider({data, onPress}: {data: any, onPress: () => void}) {
  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return new Intl.DateTimeFormat('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(dateObj);
  };
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{uri: data.ImgUrl}}
        style={styles.image}
        resizeMode="stretch"
      />
      <Text style={styles.heading}>{data.Heading}</Text>
      <Text style={styles.date}>{formatDate(data.InsDate)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    marginHorizontal: 20,
  },
  image: {
    height: '35%',
    width: '100%',
    borderRadius: 16,
  },
  heading: {
    marginTop: 10,
    fontSize: 15,
    fontFamily: FONTFAMILY.montserat_bold,
    color: '#0198A4',
  },
  date: {
    marginTop: 5,
    fontSize: 12,
    fontFamily: FONTFAMILY.montserat_regular,
    color: '#808080',
  },
});
