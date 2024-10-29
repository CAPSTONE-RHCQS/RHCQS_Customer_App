import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {AppStackParamList} from '../../../../types/TypeScreen';
import {getVersionDesignDetail} from '../../../../api/Project/project';
import {
  TrackingVersionDesignType,
  Version,
} from '../../../../types/screens/History/HistoryType';
import AppBar from '../../../../components/Appbar';
import {FONTFAMILY} from '../../../../theme/theme';
import {width, height} from '../../../../utils/Dimensions';
import CustomButton from '../../../../components/CustomButton';
import Dialog from 'react-native-dialog';

const DetailVersionDesign: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'DetailVersionDesign'>>();
  const {projectId, version} = route.params;

  const [versionDetail, setVersionDetail] = useState<Version | null>(null);
  const [drawingType, setDrawingType] = useState<string | null>(null);

  const [inputValue, setInputValue] = useState('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchVersionDetail = async () => {
      try {
        const data: TrackingVersionDesignType[] = await getVersionDesignDetail(
          projectId,
        );
        // Tìm phiên bản cụ thể dựa trên version được truyền vào
        for (const item of data) {
          const foundVersion = item.Versions.find(
            v => v.Version === Number(version),
          );
          if (foundVersion) {
            setVersionDetail(foundVersion);
            setDrawingType(item.Name);
            break;
          }
        }
      } catch (error) {
        console.error('Error fetching version detail:', error);
      }
    };

    fetchVersionDetail();
  }, [projectId, version]);

  const handlePutComment = () => {
    console.log('inputValue', inputValue);
  };

  const handlePutFinalized = () => {
    setVisible(true);
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

      {versionDetail?.Status !== 'Finished' && (
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

      <View style={styles.noteContainer}>
        <Text style={styles.note}>Điều chỉnh:</Text>
        <Text style={styles.noteDetail}>{versionDetail?.Note}</Text>
      </View>

      {versionDetail?.FileUrl && (
        <Image source={{uri: versionDetail?.FileUrl}} style={styles.image} />
      )}

      {versionDetail?.Status !== 'Finished' && (
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Chấp nhận báo giá sơ bộ"
            colors={['#53A6A8', '#3C9597', '#1F7F81']}
            onPress={handlePutFinalized}
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
            setVisible(false);
            // navigationApp.navigate('TrackingScreen', {projectId});
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
  inputContainer: {
    flex: 1,
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
    flexDirection: 'row',
    marginHorizontal: 24,
  },
  note: {
    fontSize: 16,
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
  image: {
    width: width,
    height: height / 1.7,
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
});

export default DetailVersionDesign;
