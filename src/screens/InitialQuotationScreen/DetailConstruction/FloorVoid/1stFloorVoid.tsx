import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import AppBar from '../../../../components/Appbar';
import { FONTFAMILY } from '../../../../theme/theme';

const FirstFloorVoid : React.FC = () => {
  const route = useRoute();
  const { Name } = route.params as { Name: string };

  return (
    <View style={styles.container}>
        <AppBar nameScreen='Tính chi phí xây dựng thô'/>
      <Text style={styles.titleText}>{Name}</Text>
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

export default FirstFloorVoid ;