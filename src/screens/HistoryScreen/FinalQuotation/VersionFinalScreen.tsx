import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppStackParamList} from '../../../types/TypeScreen';
import {getVersionFinal} from '../../../api/Project/project';
import AppBar from '../../../components/Appbar';
import Tracking from '../../../components/Tracking';
import {VersionType} from '../../../types/screens/History/HistoryType';

const VersionFinalScreen: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'VersionFinalScreen'>>();
  const {projectId} = route.params;
  const navigationApp = useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const [versions, setVersions] = useState<VersionType[]>([]);

  useEffect(() => {
    const fetchVersion = async () => {
      const versions = await getVersionFinal(projectId);
      setVersions(versions);
      console.log('versions', versions);
    };
    fetchVersion();
  }, [projectId]);

  const handlePressTracking = (version: string, projectId: string) => {
    navigationApp.navigate('VersionFinalDetail', {version: version, projectId: projectId});
  };

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Lịch sử báo giá chi tiết" />
      <View style={styles.content}>
        {versions
          .filter(version => Number(version.Version) !== 0)
          .map((version, index) => (
            <Tracking
              key={index}
              title={`Báo giá chi tiết phiên bản ${version.Version}`}
              onPress={() => handlePressTracking(version.Version, projectId)}
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

export default VersionFinalScreen;
