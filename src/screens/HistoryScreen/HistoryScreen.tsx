import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
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
  const [projectHistory, setProjectHistory] = useState<ProjectHistory[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchProfile = async () => {
        try {
          const profile = await getProfile();
          const projects = await getProjectByEmail(profile.Email);
          setProjectHistory(projects);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      };
      fetchProfile();

      const onBackPress = () => {
        navigationApp.navigate('HomeScreen');
        return true; // Prevent default back action
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    }, []),
  );

  const handleProjectPress = (projectId: string) => {
    navigationApp.navigate('TrackingScreen', {projectId});
  };

  const handleBackToHome = () => {
    navigationApp.navigate('HomeScreen');
  };

  const groupProjectsByDate = (projects: ProjectHistory[]) => {
    const grouped = projects.reduce((acc, project) => {
      const formattedDate = format(new Date(project.InsDate), 'dd-MM-yyyy');
      if (!acc[formattedDate]) {
        acc[formattedDate] = [];
      }
      acc[formattedDate].push(project);
      return acc;
    }, {} as Record<string, ProjectHistory[]>);

    return Object.keys(grouped)
      .sort((a, b) => {
        const [dayA, monthA, yearA] = a.split('-').map(Number);
        const [dayB, monthB, yearB] = b.split('-').map(Number);
        return (
          new Date(yearB, monthB - 1, dayB).getTime() -
          new Date(yearA, monthA - 1, dayA).getTime()
        );
      })
      .reduce((acc, date) => {
        acc[date] = grouped[date].sort((a, b) => {
          return new Date(b.InsDate).getTime() - new Date(a.InsDate).getTime();
        });
        return acc;
      }, {} as Record<string, ProjectHistory[]>);
  };

  const groupedProjects = groupProjectsByDate(projectHistory);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E4E1E1FF" />
      <AppBar nameScreen="Danh sách dự án" onBackPress={handleBackToHome} />
      <ScrollView>
        <View style={styles.content}>
          {projectHistory.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Bạn chưa có dự án nào !</Text>
              <TouchableOpacity
                style={styles.createButton}
                onPress={() => navigationApp.navigate('Package')}>
                <Text style={styles.createButtonText}>Tạo dự án mới</Text>
              </TouchableOpacity>
            </View>
          ) : (
            Object.entries(groupedProjects).map(([date, projects]) => (
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
            ))
          )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 300,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: FONTFAMILY.montserat_bold,
    color: 'black',
    marginBottom: 20,
  },
  createButton: {
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  createButtonText: {
    color: '#3BC0C2FF',
    fontSize: 20,
    fontFamily: FONTFAMILY.montserat_bold,
  },
});

export default HistoryScreen;
