import React from 'react';
import { View, StyleSheet } from 'react-native';

const Separator: React.FC = () => {
  return <View style={styles.separator} />;
};

const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    marginVertical: 10, 
  },
});

export default Separator;