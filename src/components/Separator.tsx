import React from 'react';
import { View, StyleSheet } from 'react-native';

const Separator: React.FC = () => {
  return <View style={styles.separator} />;
};

const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF', // Màu của đường kẻ
    marginVertical: 10, // Khoảng cách trên và dưới đường kẻ
  },
});

export default Separator;