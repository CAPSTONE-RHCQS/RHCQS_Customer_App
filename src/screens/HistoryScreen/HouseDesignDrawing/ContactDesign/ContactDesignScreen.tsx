import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {AppStackParamList} from '../../../../types/TypeScreen';
import {ContactDesignType} from '../../../../types/screens/History/HistoryType';
import {getContactDesign} from '../../../../api/Project/project';
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'react-native-blob-util';
import AppBar from '../../../../components/Appbar';
import {FONTFAMILY} from '../../../../theme/theme';

const ContactDesignScreen: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'ContactDesignScreen'>>();
  const {projectId} = route.params;

  const [contactDesign, setContactDesign] = useState<ContactDesignType | null>(
    null,
  );
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchContactDesign = async () => {
      try {
        const data = await getContactDesign(projectId);
        setContactDesign(data);

        if (data?.File) {
          const pdfPath = await downloadPdf(data.File);
          setPdfUri(pdfPath);
        }
      } catch (error) {
        console.error('Error fetching contact design:', error);
      } finally {
        setLoading(false);
      }
    };

    const downloadPdf = async (url: string): Promise<string> => {
      try {
        const {path} = await RNFetchBlob.config({
          fileCache: true,
          appendExt: 'pdf',
        }).fetch('GET', url);

        return path();
      } catch (error) {
        console.error('Error downloading PDF:', error);
        throw error;
      }
    };

    fetchContactDesign();
  }, [projectId]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Hợp đồng tư vấn và thiết kế" />
      {pdfUri ? (
        <Pdf
          source={{uri: pdfUri}}
          onError={error => {
            console.log(error);
          }}
          style={styles.pdf}
        />
      ) : (
        <Text style={styles.text}>Không tìm thấy file PDF.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pdf: {
    flex: 1,
    backgroundColor: 'white',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  text: {
    fontFamily: FONTFAMILY.montserat_regular,
    color: 'gray',
    fontSize: 16,
    padding: 20,
  },
});

export default ContactDesignScreen;
