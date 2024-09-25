import {FONTFAMILY} from '../theme/theme';
import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface BlogItemProps {
  image: any;
  heading: string;
  id: number;
  onPress: (id: number) => void;
}

const BlogItem: React.FC<BlogItemProps> = ({image, heading, id, onPress}) => {
    return (
      <TouchableOpacity onPress={() => onPress(id)}>
        <View style={styles.container}>
          <Image source={image} style={styles.image} />
          <Text style={styles.heading} numberOfLines={2} ellipsizeMode="tail">
            {heading}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    width: 240,
    marginRight: 30,
  },
  image: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  heading: {
    marginTop: 5,
    fontSize: 12,
    fontFamily: FONTFAMILY.montserat_bold,
    color: 'black',
    textAlign: 'left',
  },
});

export default BlogItem;
