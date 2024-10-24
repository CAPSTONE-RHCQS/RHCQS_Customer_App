import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Dimensions,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import AppBar from '../../components/Appbar';
import {RouteProp, useRoute} from '@react-navigation/native';
import {
  AppStackNavigationProp,
  AppStackParamList,
} from '../../types/TypeScreen';
import {VersionType} from '../../types/screens/History/HistoryType';
import {getVersion, putComment, putFinalized} from '../../api/Project/project';
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'react-native-blob-util';
import CustomButton from '../../components/CustomButton';
import {FONTFAMILY} from '../../theme/theme';
import Dialog from 'react-native-dialog';
import {useNavigation} from '@react-navigation/native';

const VersionDetail: React.FC = () => {
  const navigationApp = useNavigation<AppStackNavigationProp>();

  const route = useRoute<RouteProp<AppStackParamList, 'VersionDetail'>>();
  const {version, projectId} = route.params;

  const [selectedVersion, setSelectedVersion] = useState<VersionType | null>(
    null,
  );
  const [visible, setVisible] = useState<boolean>(false);
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

    fetchVersion();
  }, [projectId, version]);

  const handlePutComment = useCallback(async () => {
    if (selectedVersion && selectedVersion.Id) {
      await putComment(selectedVersion.Id, inputValue);
      console.log('Comment sent successfully');
    } else {
      console.error('Version ID is missing');
    }
  }, [inputValue, selectedVersion]);

  const handlePutFinalized = useCallback(async () => {
    setVisible(true);

    if (selectedVersion && selectedVersion.Id) {
      await putFinalized(selectedVersion.Id);
      console.log(selectedVersion.Id);
    } else {
      console.error('Version ID is missing');
    }
  }, [selectedVersion]);

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
          <TouchableOpacity onPress={handlePutComment}>
            <Text style={styles.buttonText}>Gửi ghi chú</Text>
          </TouchableOpacity>
        </View>
        {selectedVersion ? (
          pdfUri ? (
            <Pdf
              source={{uri: pdfUri}}
              onLoadComplete={numberOfPages => {
                console.log(`Number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page, numberOfPages) => {
                console.log(`Current page: ${page}`);
              }}
              onError={error => {
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
        title="Chấp nhận báo giá sơ bộ"
        colors={['#53A6A8', '#3C9597', '#1F7F81']}
        onPress={handlePutFinalized}
        style={styles.button}
      />
      <Dialog.Container contentStyle={styles.dialogContainer} visible={visible}>
        <Dialog.Title style={styles.dialogTitle}>Xác nhận</Dialog.Title>
        <Dialog.Description style={styles.dialogDescription}>
          Bạn có chắc chắn muốn yêu cầu bản thiết kế?
        </Dialog.Description>
        <View style={styles.dialogButtonContainer}>
          <Dialog.Button
            label="Hủy"
          onPress={() => {
            setVisible(false);
          }}
          style={styles.dialogButtonCancel}
        />
        <Dialog.Button
          label="Xác nhận"
          onPress={() => {
            setVisible(false);
            navigationApp.navigate('TrackingScreen', {projectId});
          }}
          style={styles.dialogButton}
        />
        </View>
      </Dialog.Container>
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
  buttonText: {
    marginTop: 10,
    alignSelf: 'flex-end',
    fontFamily: FONTFAMILY.montserat_bold,
    color: '#1F7F81',
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
  dialogContainer: {
    borderRadius: 12,
    marginHorizontal: 20,
  },
  dialogTitle: {
    color: '#1F7F81',
    fontSize: 20,
    fontFamily: FONTFAMILY.montserat_bold,
  },
  dialogDescription: {
    color: '#333',
    fontSize: 16,
    fontFamily: FONTFAMILY.montserat_regular,
  },
  dialogButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dialogButtonLabel: {
    color: '#1F7F81',
    fontFamily: FONTFAMILY.montserat_semibold,
  },
  dialogButtonCancel: {
    color: 'red',
    fontFamily: FONTFAMILY.montserat_semibold,
  },
  dialogButton: {
    color: '#1F7F81',
    fontFamily: FONTFAMILY.montserat_semibold,
  },
});

export default VersionDetail;
