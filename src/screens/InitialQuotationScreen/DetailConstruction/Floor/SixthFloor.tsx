import React from 'react';
import {Text, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import AppBar from '../../../../components/Appbar';

const SixthFloor : React.FC = () => {
  const route = useRoute();
  const { Name } = route.params as { Name: string };

  return (
    <View>
        <AppBar nameScreen='Tính chi phí xây dựng thô'/>
      <Text>{Name}</Text>
    </View>
  );
};

export default SixthFloor ;