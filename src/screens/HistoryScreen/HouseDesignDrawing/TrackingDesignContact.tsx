import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppBar from '../../../components/Appbar';
import Tracking from '../../../components/Tracking';
import {getTracking} from '../../../api/Project/project';
import {
  useRoute,
  RouteProp,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import {
  AppStackNavigationProp,
  AppStackParamList,
} from '../../../types/TypeScreen';

const TrackingDesignContact: React.FC = () => {
  const route =
    useRoute<RouteProp<AppStackParamList, 'TrackingDesignContact'>>();
  const {projectId} = route.params;

  const navigationApp = useNavigation<AppStackNavigationProp>();

  const handlePressTracking = (title: string, projectId: string) => {
    switch (title) {
      case 'Hợp đồng tư vấn và thiết kế kiến trúc':
        navigationApp.navigate('ContactDesignScreen', {projectId: projectId});
        break;
      case 'Bản vẽ chi tiết':
        navigationApp.navigate('TrackingVersionDesign', {projectId: projectId});
        break;
      default:
        console.log('Title:', title);
        break;
    }
  };

  const renderTrackingItems = () => {
    const items = [
      {title: 'Hợp đồng tư vấn và thiết kế kiến trúc'},
      {title: 'Bản vẽ chi tiết'},
    ];

    return items.map((item, index) => {
      if (item.title) {
        return (
          <Tracking
            key={index}
            title={item.title}
            onPress={() => {
              handlePressTracking(item.title, projectId);
            }}
          />
        );
      }
      return null;
    });
  };

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Hợp đồng thiết kế" />
      <View>
        <View style={styles.content}>{renderTrackingItems()}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    marginTop: 10,
    marginHorizontal: 20,
  },
});

export default TrackingDesignContact;
