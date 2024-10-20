import {UltilitiesStackParamList} from '@/types/TypeScreen';
import {RouteProp, useRoute} from '@react-navigation/native';
import React from 'react';
import {Text, View} from 'react-native';

const NarrowAlleyConstructionCost: React.FC = () => {
  const route =
    useRoute<
      RouteProp<UltilitiesStackParamList, 'NarrowAlleyConstructionCost'>
    >();
  const {Id} = route.params;

  return (
    <View>
      <Text>{Id}</Text>
    </View>
  );
};

export default NarrowAlleyConstructionCost;
