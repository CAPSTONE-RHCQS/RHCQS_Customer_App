import {FONTFAMILY} from '../theme/theme';
import React from 'react';
import {View, Image, StyleSheet, Text, TouchableOpacity} from 'react-native';

export default function BlogCard({
  data,
  onPress,
}: {
  data: any;
  onPress: () => void;
}) {
  const formatDate = (date: string) => {
    const dateObj = new Date(date);
    return new Intl.DateTimeFormat('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(dateObj);
  };
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image
        source={{uri: data.ImgUrl}}
        style={styles.image}
        resizeMode="stretch"
      />
      <View style={styles.content}>
        <Text style={styles.heading} numberOfLines={3} ellipsizeMode="tail">
          {data.Heading}
        </Text>
        <Text style={styles.date}>{formatDate(data.InsDate)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 10,
  },
  image: {
    height: 115,
    width: 200,
    borderRadius: 16,
    marginRight: 10,
  },
  content: {
    flexDirection: 'column',
    flex: 1,
  },
  heading: {
    fontSize: 15,
    fontFamily: FONTFAMILY.montserat_bold,
    color: '#0198A4',
  },
  date: {
    fontSize: 12,
    fontFamily: FONTFAMILY.montserat_regular,
    color: '#808080',
  },
});
