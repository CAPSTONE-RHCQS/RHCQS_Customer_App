import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppBar from '../../components/Appbar';
import Project from '../../components/Project';
import {getProfile} from '../../api/Account/Account';
import {getProjectByEmail} from '../../api/Project/project';
import {ProjectHistory} from '../../types/screens/History/HistoryType';
import {format} from 'date-fns';
import { useNavigation } from '@react-navigation/native';
import { AppStackNavigationProp } from '../../types/TypeScreen';

const HistoryScreen: React.FC = () => {
  const navigationApp = useNavigation<AppStackNavigationProp>();
  const [customerEmail, setCustomerEmail] = useState('');
  const [projectHistory, setProjectHistory] = useState<ProjectHistory[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        setCustomerEmail(profile.Email);
        const projects = await getProjectByEmail(profile.Email);
        setProjectHistory(projects);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleProjectPress = (projectId: string) => {
    console.log('Project ID:', projectId);
    navigationApp.navigate('TrackingScreen', {projectId});
  };

  // Hàm xử lý khi nhấn nút quay lại trên AppBar
  const handleBackToHome = () => {
    navigationApp.navigate('HomeScreen');
  };

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Danh sách dự án" onBackPress={handleBackToHome} />
      <View style={styles.content}>
        {projectHistory.map((project, index) => {
          const formattedDate = format(new Date(project.InsDate), 'dd-MM-yyyy');
          return (
            <Project
              key={index}
              date={formattedDate}
              title={project.Name}
              onPress={() => handleProjectPress(project.Id)}
            />
          );
        })}
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
    paddingHorizontal: 20,
  },
});

export default HistoryScreen;
