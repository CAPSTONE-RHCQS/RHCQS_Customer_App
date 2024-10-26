import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppBar from '../../../../components/Appbar';
import TrackingHouseDesignVersion from '../../../../components/TrackingHouseDesignVersion';
import {getVersionDesignDetail} from '../../../../api/Project/project';
import {NavigationProp, RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {AppStackParamList} from '@/types/TypeScreen';
import {TrackingVersionDesignType} from '@/types/screens/History/HistoryType';

interface FormattedDesignData {
  title: string;
  status: string;
  subItems: {
    subTitle: number;
    subStatus: string;
  }[];
}

const TrackingVersionDesign: React.FC = () => {

  const route =
    useRoute<RouteProp<AppStackParamList, 'TrackingVersionDesign'>>();
  const {projectId} = route.params;

  const [designData, setDesignData] = useState<FormattedDesignData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data: TrackingVersionDesignType[] = await getVersionDesignDetail(
          projectId,
        );
        const formattedData = data.map(item => ({
          title: item.Name,
          status: item.Status,
          subItems: item.Versions.map(version => ({
            subTitle: version.Version,
            subStatus: version.Status,
          })),
        }));
        setDesignData(formattedData);
      } catch (error) {
        console.error('Error fetching design data:', error);
      }
    };

    fetchData();
  }, [projectId]);

  

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
