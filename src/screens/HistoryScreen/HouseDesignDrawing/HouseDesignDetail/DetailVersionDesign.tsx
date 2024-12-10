import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Dimensions,
  Keyboard,
} from 'react-native';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {AppStackParamList} from '../../../../types/TypeScreen';
import {
  getVersionDesignDetail,
  putCommentVersionDesign,
  putConfirmVersionDesign,
} from '../../../../api/Project/project';
import {
  TrackingVersionDesignType,
  Version,
} from '../../../../types/screens/History/HistoryType';
import AppBar from '../../../../components/Appbar';
import {FONTFAMILY} from '../../../../theme/theme';
import {width, height} from '../../../../utils/Dimensions';
import CustomButton from '../../../../components/CustomButton';
import Dialog from 'react-native-dialog';
import {AppStackNavigationProp} from '../../../../types/TypeScreen';
import Pdf from 'react-native-pdf';
import RNFetchBlob from 'react-native-blob-util';

const DetailVersionDesign: React.FC = () => {
  const navigationApp = useNavigation<AppStackNavigationProp>();
  const route = useRoute<RouteProp<AppStackParamList, 'DetailVersionDesign'>>();
  const {projectId, versionId} = route.params;

  const [versionDetail, setVersionDetail] = useState<Version | null>(null);
  const [drawingType, setDrawingType] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [commentSuccessVisible, setCommentSuccessVisible] = useState<boolean>(false);

  const fetchVersionDetail = async () => {
    try {
      setLoading(true);
      const data: TrackingVersionDesignType[] = await getVersionDesignDetail(
        projectId,
      );
      for (const item of data) {
        const foundVersion = item.Versions.find(v => v.Id === versionId);
        if (foundVersion) {
          setVersionDetail(foundVersion);
          setDrawingType(item.Name);
          setStatus(item.Status);

          if (foundVersion.FileUrl) {
            const pdfPath = await downloadPdf(foundVersion.FileUrl);
            setPdfUri(pdfPath);
          }
          break;
        }
      }
    } catch (error) {
      console.error('Error fetching version detail:', error);
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

  useEffect(() => {
    fetchVersionDetail();
  }, [projectId, versionId]);

  const handlePutComment = () => {
    putCommentVersionDesign(versionId, inputValue).then(() => {
      setInputValue('');
      setCommentSuccessVisible(true);
      Keyboard.dismiss();
      fetchVersionDetail();
    });
  };

  const handlePutConfirmed = () => {
    navigationApp.navigate('TrackingVersionDesign', {projectId});
    putConfirmVersionDesign(versionId).then(() => {
      setVisible(true);
    });
  };

  return (
    <View style={styles.container}>
      <AppBar
        nameScreen={
          versionDetail?.Name && versionDetail?.Version
            ? `${versionDetail?.Name} - Phiên bản ${versionDetail?.Version}`
            : ''
        }
      />
      <View style={styles.content}>
        <View style={styles.noteContainer}>
          <Text style={styles.note}>Điều chỉnh:</Text>
          <Text style={styles.noteDetail}>{versionDetail?.Note}</Text>
        </View>
        {status !== 'Finished' && status !== 'Accepted' && status !== 'Updating' && (
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
        )}
        {loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        ) : pdfUri ? (
          <Pdf
            source={{uri: pdfUri}}
            onError={error => {
              console.log(error);
            }}
            style={styles.pdf}
          />
        ) : (
          <Text style={styles.text}>Bản vẽ đang được cập nhật</Text>
        )}
      </View>
      {status !== 'Finished' && status !== 'Accepted' && status !== 'Updating' && (
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Chấp nhận thiết kế"
            colors={['#53A6A8', '#3C9597', '#1F7F81']}
            onPress={() => setVisible(true)}
            loading={loading}
          />
        </View>
      )}

      <Dialog.Container contentStyle={styles.dialogContainer} visible={visible}>
        <Dialog.Title style={styles.dialogTitle}>Xác nhận</Dialog.Title>
        <Dialog.Description style={styles.dialogDescription}>
          Bạn có chắc chắn muốn yêu cầu bản thiết kế?
        </Dialog.Description>

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
            handlePutConfirmed();
          }}
          style={styles.dialogButton}
        />
      </Dialog.Container>

      <Dialog.Container contentStyle={styles.dialogContainer} visible={commentSuccessVisible}>
        <Dialog.Title style={styles.dialogTitle}>Thông báo</Dialog.Title>
        <Dialog.Description style={styles.dialogDescription}>
          Ghi chú đã được gửi thành công.
        </Dialog.Description>
        <Dialog.Button
          label="Đóng"
          onPress={() => {
            setCommentSuccessVisible(false);
            navigationApp.navigate('TrackingVersionDesign', {projectId: projectId});
          }}
          style={styles.dialogButton}
        />
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
  inputContainer: {
    position: 'relative',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    fontFamily: FONTFAMILY.montserat_bold,
    marginLeft: 6,
    marginBottom: 5,
    color: 'black',
  },
  noteContainer: {
    flexDirection: 'column',
    marginHorizontal: 23,
  },
  note: {
    fontSize: 13,
    fontFamily: FONTFAMILY.montserat_bold,
    marginBottom: 5,
    color: 'black',
  },
  noteDetail: {
    fontSize: 16,
    fontFamily: FONTFAMILY.montserat_regular,
    marginLeft: 23,
    marginBottom: 5,
    color: 'black',
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
  buttonText: {
    marginTop: 10,
    alignSelf: 'flex-end',
    fontFamily: FONTFAMILY.montserat_bold,
    color: '#1F7F81',
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 20,
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
  dialogButtonLabel: {
    color: '#1F7F81',
    fontFamily: FONTFAMILY.montserat_semibold,
  },
  dialogButtonCancel: {
    color: 'red',
    fontFamily: FONTFAMILY.montserat_semibold,
    textTransform: 'none',
  },
  dialogButton: {
    color: '#1F7F81',
    fontFamily: FONTFAMILY.montserat_semibold,
    textTransform: 'none',
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

export default DetailVersionDesign;
