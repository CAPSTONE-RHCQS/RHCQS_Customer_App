import React from 'react';
import {Text, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import AppBar from '../../../components/Appbar';

const ElevatorTechnicalScreen: React.FC = () => {
  const route = useRoute();
  const { id } = route.params as { id: number };

  return (
    <View>
        <AppBar nameScreen='Tính chi phí xây dựng thô'/>
      <Text>ID: {id}</Text>
    </View>
  );
};

export default ElevatorTechnicalScreen;