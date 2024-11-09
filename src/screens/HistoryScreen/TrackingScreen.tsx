import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppBar from '../../components/Appbar';
import Tracking from '../../components/Tracking';
import {cancelInitialQuotation, getTracking} from '../../api/Project/project';
import {
  useRoute,
  RouteProp,
  useNavigation,
  useFocusEffect,
} from '@react-navigation/native';
import {
  AppStackNavigationProp,
  AppStackParamList,
} from '../../types/TypeScreen';
import {FONTFAMILY} from '../../theme/theme';
import {TrackingType} from '../../types/screens/History/HistoryType';

const TrackingScreen: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'TrackingScreen'>>();
  const {projectId} = route.params;

  const navigationApp = useNavigation<AppStackNavigationProp>();

  const [tracking, setTracking] = useState<TrackingType | null>(null);

  const fetchTracking = async () => {
    try {
      const trackingData: TrackingType = await getTracking(projectId);
      setTracking(trackingData);
      console.log('Tracking data:', trackingData);
    } catch (error) {
      console.error('Error fetching tracking data:', error);
    }
  };

  const handleCancelInitialQuotation = async () => {
    await cancelInitialQuotation(projectId);
    navigationApp.navigate('HistoryScreen');
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchTracking();
    }, [projectId]),
  );

  const handlePressTracking = (title: string, projectId: string) => {
    switch (title) {
      case 'Báo giá sơ bộ':
        navigationApp.navigate('VersionScreen', {projectId: projectId});
        break;
      case 'Hợp đồng thiết kế':
        navigationApp.navigate('TrackingDesignContact', {projectId: projectId});
        break;
      case 'Báo giá chi tiết':
        navigationApp.navigate('VersionFinalScreen', {projectId: projectId});
        break;
      case 'Hợp đồng thi công':
        navigationApp.navigate('TrackingContruction', {projectId: projectId});
        break;
      default:
        console.log('Title:', title);
        break;
    }
  };

  const renderTrackingItems = () => {
    if (!tracking) return null;

    const items = [
      {title: 'Báo giá sơ bộ', data: tracking.InitialResponse},
      {title: 'Hợp đồng thiết kế', data: tracking.ContractDesignResponse},
      {title: 'Báo giá chi tiết', data: tracking.FinalAppResponse},
      {title: 'Hợp đồng thi công', data: tracking.ContractProcessingResponse},
    ];

    return items.map((item, index) => {
      if (item.data) {
        return (
          <Tracking
            key={index}
            title={item.title}
            status={item.data.Status}
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
      <AppBar nameScreen="Lịch sử báo giá sơ bộ" />
      <View>
        <View style={styles.content}>{renderTrackingItems()}</View>
      </View>
      {tracking?.InitialResponse?.Status &&
        tracking.InitialResponse.Status !== 'Finalized' &&
        tracking.InitialResponse.Status !== 'Approved' &&
        tracking.InitialResponse.Status !== 'Reviewing' && (
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <TouchableOpacity onPress={handleCancelInitialQuotation}>
                <Text style={styles.buttonText}>Hủy báo giá sơ bộ</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  button: {
    height: 60,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'red',
  },
  buttonText: {
    fontFamily: FONTFAMILY.montserat_medium,
    color: 'red',
    fontSize: 18,
  },
});

export default TrackingScreen;
