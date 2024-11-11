import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppBar from '../../components/Appbar';
import Project from '../../components/Project';
import {getProfile} from '../../api/Account/Account';
import {getProjectByEmail} from '../../api/Project/project';
import {ProjectHistory} from '../../types/screens/History/HistoryType';
import {format} from 'date-fns';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {AppStackNavigationProp} from '../../types/TypeScreen';
import {FONTFAMILY} from '../../theme/theme';

const HistoryScreen: React.FC = () => {
  const navigationApp = useNavigation<AppStackNavigationProp>();
  const [customerEmail, setCustomerEmail] = useState('');
  const [projectHistory, setProjectHistory] = useState<ProjectHistory[]>([]);

  useFocusEffect(
    React.useCallback(() => {
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
    }, []),
  );

  const handleProjectPress = (projectId: string) => {
    console.log('Project ID:', projectId);
    navigationApp.navigate('TrackingScreen', {projectId});
  };

  const handleBackToHome = () => {
    navigationApp.navigate('HomeScreen');
  };

  const groupProjectsByDate = (projects: ProjectHistory[]) => {
    return projects.reduce((acc, project) => {
      const formattedDate = format(new Date(project.InsDate), 'dd-MM-yyyy');
      if (!acc[formattedDate]) {
        acc[formattedDate] = [];
      }
      acc[formattedDate].push(project);
      return acc;
    }, {} as Record<string, ProjectHistory[]>);
  };

  const groupedProjects = groupProjectsByDate(projectHistory);

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Danh sách dự án" onBackPress={handleBackToHome} />
      <ScrollView>
        <View style={styles.content}>
          {Object.entries(groupedProjects).map(([date, projects]) => (
            <View key={date}>
              <Text style={styles.dateText}>{date}</Text>
              {projects.map((project, index) => (
                <Project
                  key={index}
                  title={project.Name}
                  projectCode={project.ProjectCode}
                  onPress={() => handleProjectPress(project.Id)}
                />
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
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
  dateText: {
    fontSize: 18,
    fontFamily: FONTFAMILY.montserat_bold,
    marginVertical: 10,
    color: '#1F7F81',
  },
});

export default HistoryScreen;
