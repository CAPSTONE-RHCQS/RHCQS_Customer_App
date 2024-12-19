import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppStackParamList} from '../../../types/TypeScreen';
import {getVersionFinal} from '../../../api/Project/project';
import AppBar from '../../../components/Appbar';
import Tracking from '../../../components/Tracking';
import {VersionType} from '../../../types/screens/History/HistoryType';
import {FONTFAMILY} from '../../../theme/theme';

const VersionFinalScreen: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'VersionFinalScreen'>>();
  const {projectId} = route.params;
  const navigationApp =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const [versions, setVersions] = useState<VersionType[]>([]);

  useEffect(() => {
    const fetchVersion = async () => {
      const versions = await getVersionFinal(projectId);
      console.log('versions', versions);
      setVersions(versions);
    };
    fetchVersion();
  }, [projectId]);

  const handlePressTracking = (version: string, projectId: string) => {
    navigationApp.navigate('VersionFinalDetail', {
      version: version,
      projectId: projectId,
    });
  };

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Lịch sử báo giá chi tiết" />
      <View style={styles.content}>
        {versions.length === 0 ? (
          <View style={styles.centeredContent}>
            <Text style={styles.noVersionText}>
              Báo giá chi tiết đang được tạo
            </Text>
          </View>
        ) : (
          versions
            .filter(version => Number(version.Version) !== 0 && version.File !== "")
            .map((version, index) => (
              <Tracking
                key={index}
                title={`Báo giá chi tiết phiên bản ${version.Version}`}
                onPress={() => handlePressTracking(version.Version, projectId)}
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

export default VersionFinalScreen;
