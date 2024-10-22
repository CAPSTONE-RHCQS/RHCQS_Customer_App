import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppBar from '../../components/Appbar';
import Project from '../../components/Project';
import {getProfile} from '../../api/Account/Account';
import {getProjectByEmail} from '../../api/Project/project';
import {ProjectHistory} from '../../types/screens/History/HistoryType';
import {format} from 'date-fns';

const HistoryScreen: React.FC = () => {
  const [customerEmail, setCustomerEmail] = useState('');
  const [projectHistory, setProjectHistory] = useState<ProjectHistory[]>([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        setCustomerEmail(profile.Email);
        console.log('customerEmail', profile.Email);

        // Gọi hàm getProjectByEmail sau khi có customerEmail
        const projects = await getProjectByEmail(profile.Email);
        setProjectHistory(projects);
        console.log('projectHistory', projects);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, []);

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Danh sách dự án" />
      <View style={styles.content}>
        {projectHistory.map((project, index) => {
          const formattedDate = format(new Date(project.InsDate), 'dd-MM-yyyy');
          return (
            <Project key={index} date={formattedDate} title={project.Name} />
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
