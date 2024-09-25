import { FONTFAMILY } from '../../theme/theme';
import AppBar from '../../components/Appbar';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const UltilitiesScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <AppBar nameScreen="Tính chi phí xây dựng thô" />
      <Text style={styles.titleText}>Tùy chọn & tiện ích</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white'
  },
  titleText:{
    marginHorizontal: 20,
    marginTop: 10,
    fontFamily: FONTFAMILY.montserat_bold,
    fontSize: 16,
    color: 'black' 
  }
});

export default UltilitiesScreen;
