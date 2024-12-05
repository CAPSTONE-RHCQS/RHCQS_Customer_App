import {View, StyleSheet, Text} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import AppBar from '../../../../components/Appbar';
import TrackingHouseDesignVersion from '../../../../components/TrackingHouseDesignVersion';
import {getVersionDesignDetail} from '../../../../api/Project/project';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {AppStackNavigationProp, AppStackParamList} from '@/types/TypeScreen';
import {TrackingVersionDesignType} from '@/types/screens/History/HistoryType';
import {FONTFAMILY} from '../../../../theme/theme';
import {useFocusEffect} from '@react-navigation/native';

interface FormattedDesignData {
  title: string;
  status: string;
  subItems: {
    subTitle: number;
    subStatus: string;
    confirmed: boolean;
    versionId: string;
    onPress: () => void;
  }[];
}

const TrackingVersionDesign: React.FC = () => {
  const navigation = useNavigation<AppStackNavigationProp>();

  const route =
    useRoute<RouteProp<AppStackParamList, 'TrackingVersionDesign'>>();
  const {projectId} = route.params;
  console.log('projectId', projectId);
  const [designData, setDesignData] = useState<FormattedDesignData[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const data: TrackingVersionDesignType[] = await getVersionDesignDetail(
        projectId,
      );
      console.log('data', JSON.stringify(data, null, 2));
      const formattedData = data.map(item => ({
        title: item.Name,
        status: item.Status,
        subItems: item.Versions.map(version => ({
          subTitle: version.Version,
          subStatus: version.Status,
          confirmed: version.Confirmed,
          versionId: version.Id,
          onPress: () => {
            navigation.navigate('DetailVersionDesign', {
              versionId: version.Id,
              projectId: projectId,
            });
          },
        })),
      }));
      setDesignData(formattedData);
    } catch (error) {
      console.error('Error fetching design data:', error);
    }
  }, [projectId, navigation]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Bản vẽ chi tiết" />
      <View style={styles.content}>
        {designData.length === 0 ? (
          <View style={styles.centeredContent}>
            <Text style={styles.noVersionText}>Bản thiết kế đang cập nhật</Text>
          </View>
        ) : (
          designData.map((item, index) => (
            <TrackingHouseDesignVersion
              key={index}
              title={item.title}
              status={item.status}
              subItems={item.subItems}
              onPress={() => {}}
            />
          ))
        )}
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
    flex: 1,
    marginTop: 10,
    marginHorizontal: 20,
  },
  centeredContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noVersionText: {
    fontSize: 20,
    color: 'black',
    fontFamily: FONTFAMILY.montserat_bold,
    marginBottom: 50,
  },
});

export default TrackingVersionDesign;
