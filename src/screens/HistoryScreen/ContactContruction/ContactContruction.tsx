import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {AppStackParamList} from '../../../types/TypeScreen';
import {ContactDesignType} from '../../../types/screens/History/HistoryType';
import {getContactContruction} from '../../../api/Project/project';
import {WebView} from 'react-native-webview';
import AppBar from '../../../components/Appbar';

const ContactContruction: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'ContactContructionScreen'>>();
  const {projectId} = route.params;

  const [contactContruction, setContactContruction] = useState<ContactDesignType | null>(
    null,
  );

  useEffect(() => {
    const fetchContactDesign = async () => {
      try {
        const data = await getContactContruction(projectId);
        setContactContruction(data);
      } catch (error) {
        console.error('Error fetching contact design:', error);
      }
    };

    fetchContactDesign();
  }, [projectId]);

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Hợp đồng thiết kế" />
      {contactContruction?.File && (
        <WebView source={{uri: contactContruction.File}} style={{flex: 1}} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default ContactContruction;
