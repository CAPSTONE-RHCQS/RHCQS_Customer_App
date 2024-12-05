import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AppStackParamList} from '../../../types/TypeScreen';
import {getVersion} from '../../../api/Project/project';
import AppBar from '../../../components/Appbar';
import Tracking from '../../../components/Tracking';
import {VersionType} from '../../../types/screens/History/HistoryType';
import {FONTFAMILY} from '../../../theme/theme';

const VersionScreen: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'VersionScreen'>>();
  const {projectId} = route.params;
  const navigationApp =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();

  const [versions, setVersions] = useState<VersionType[]>([]);

  useEffect(() => {
    const fetchVersion = async () => {
      const versions = await getVersion(projectId);
      console.log('versions', JSON.stringify(versions, null, 2));
      setVersions(versions);
    };
    fetchVersion();
  }, [projectId]);

  const handlePressTracking = (version: string, projectId: string) => {
    navigationApp.navigate('VersionDetail', {
      version: version,
      projectId: projectId,
    });
  };

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Lịch sử báo giá sơ bộ" />
      <View style={styles.content}>
        {versions.length === 0 ||
        (versions.length === 1 && Number(versions[0].Version) === 0) ? (
          <View style={styles.centeredContent}>
            <Text style={styles.noVersionText}>
              Báo giá sơ bộ đang được tạo
            </Text>
          </View>
        ) : (
          versions
            .filter(
              version =>
                Number(version.Version) !== 0 &&
                !(version.Status === 'Ended' && version.File === '')
            )
            .map((version, index) => (
              <Tracking
                key={index}
                title={`Báo giá sơ bộ phiên bản ${version.Version}`}
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

export default VersionScreen;
