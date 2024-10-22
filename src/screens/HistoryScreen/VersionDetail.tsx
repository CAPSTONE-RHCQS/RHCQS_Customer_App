import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Dimensions, TextInput } from 'react-native';
import AppBar from '../../components/Appbar';
import { RouteProp, useRoute } from '@react-navigation/native';
import { AppStackParamList } from '../../types/TypeScreen';
import { VersionType } from '../../types/screens/History/HistoryType';
import { getVersion } from '../../api/Project/project';
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'react-native-blob-util';
import CustomButton from '../../components/CustomButton';
import {FONTFAMILY} from '../../theme/theme';

const VersionDetail: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'VersionDetail'>>();
  const { version, projectId } = route.params;

  const [selectedVersion, setSelectedVersion] = useState<VersionType | null>(null);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>('');

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const versions = await getVersion(projectId);
        const matchedVersion = versions.find(v => v.Version === version);
        setSelectedVersion(matchedVersion || null);

        if (matchedVersion?.File) {
          const pdfPath = await downloadPdf(matchedVersion.File);
          setPdfUri(pdfPath);
        }
      } catch (error) {
        console.error('Error fetching version:', error);
      } finally {
        setLoading(false);
      }
    };

    const downloadPdf = async (url: string): Promise<string> => {
      try {
        const { path } = await RNFetchBlob.config({
          fileCache: true,
          appendExt: 'pdf',
        }).fetch('GET', url);

        return path();
      } catch (error) {
        console.error('Error downloading PDF:', error);
        throw error;
      }
    };

    fetchVersion();
  }, [projectId, version]);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppBar nameScreen={`Báo giá sơ bộ phiên bản ${version}`} />
      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.title}>Ghi chú</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập ghi chú..."
            placeholderTextColor="gray"
            value={inputValue}
            onChangeText={setInputValue}
            multiline={true}
            textAlignVertical="top"
          />
        </View>
        {selectedVersion ? (
          pdfUri ? (
            <Pdf
              source={{ uri: pdfUri }}
              onLoadComplete={(numberOfPages) => {
                console.log(`Number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page, numberOfPages) => {
                console.log(`Current page: ${page}`);
              }}
              onError={(error) => {
                console.log(error);
              }}
              style={styles.pdf}
            />
          ) : (
            <Text>No file available for this version.</Text>
          )
        ) : (
          <Text>Version not found.</Text>
        )}
      </View>
      <CustomButton
        title="Submit"
        colors={['#53A6A8', '#3C9597', '#1F7F81']}
        onPress={() => {
          console.log('Input Value:', inputValue);
        }}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  content: {
    marginTop: 16,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontFamily: FONTFAMILY.montserat_bold,
    marginLeft: 6,
    marginBottom: 5,
    color: 'black',
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
  inputContainer: {
    position: 'relative',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  input: {
    height: 120,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 8,
    fontSize: 14,
    fontFamily: FONTFAMILY.montserat_regular,
  },
  button: {
    margin: 20,
  },
});

export default VersionDetail;
