import React, {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {AppStackParamList} from '../../../../types/TypeScreen';
import {ContactDesignType} from '../../../../types/screens/History/HistoryType';
import {getContactDesign} from '../../../../api/Project/project';
import {WebView} from 'react-native-webview';
import AppBar from '../../../../components/Appbar';

const ContactDesignScreen: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'ContactDesignScreen'>>();
  const {projectId} = route.params;

  const [contactDesign, setContactDesign] = useState<ContactDesignType | null>(
    null,
  );

  useEffect(() => {
    const fetchContactDesign = async () => {
      try {
        const data = await getContactDesign(projectId);
        setContactDesign(data);
      } catch (error) {
        console.error('Error fetching contact design:', error);
      }
    };

    fetchContactDesign();
  }, [projectId]);

  return (
    <View>
      <AppBar nameScreen="Hợp đồng thiết kế" />
      {contactDesign?.File && (
        <WebView source={{uri: contactDesign.File}} style={{flex: 1}} />
      )}
    </View>
  );
};

export default ContactDesignScreen;
