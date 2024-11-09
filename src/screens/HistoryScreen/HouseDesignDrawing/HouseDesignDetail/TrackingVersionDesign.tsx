import {View, StyleSheet} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import AppBar from '../../../../components/Appbar';
import TrackingHouseDesignVersion from '../../../../components/TrackingHouseDesignVersion';
import {getVersionDesignDetail} from '../../../../api/Project/project';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {AppStackNavigationProp, AppStackParamList} from '@/types/TypeScreen';
import {TrackingVersionDesignType} from '@/types/screens/History/HistoryType';

interface FormattedDesignData {
  title: string;
  status: string;
  subItems: {
    subTitle: number;
    subStatus: string;
    versionId: string;
    onPress: () => void;
  }[];
}

const TrackingVersionDesign: React.FC = () => {

  const navigation = useNavigation<AppStackNavigationProp>();

  const route =
    useRoute<RouteProp<AppStackParamList, 'TrackingVersionDesign'>>();
  const {projectId} = route.params;

  const [designData, setDesignData] = useState<FormattedDesignData[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const data: TrackingVersionDesignType[] = await getVersionDesignDetail(
        projectId,
      );
      console.log(JSON.stringify(data, null, 2));
      const formattedData = data.map(item => ({
        title: item.Name,
        status: item.Status,
        subItems: item.Versions.map(version => ({
          subTitle: version.Version,
          subStatus: version.Status,
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Bản vẽ chi tiết" />
      <View style={styles.content}>
        {designData.map((item, index) => (
          <TrackingHouseDesignVersion
            key={index}
            title={item.title}
            status={item.status}
            subItems={item.subItems}
            onPress={() => {}}
          />
        ))}
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

export default TrackingVersionDesign;
