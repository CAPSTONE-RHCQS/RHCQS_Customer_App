import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppBar from '../../components/Appbar';
import Separator from '../../components/Separator';
import {FONTFAMILY} from '../../theme/theme';
import CustomButton from '../../components/CustomButton';
import {createProjectHaveDesign} from '../../api/HasDesign/HasDesign';
import Dialog from 'react-native-dialog';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  AppStackNavigationProp,
  AppStackParamList,
} from '../../types/TypeScreen';
import DocumentPicker from 'react-native-document-picker';

const Hasdesign: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'HasDesignScreen'>>();
  const {projectId} = route.params;
  const [perspectiveImages, setPerspectiveImages] = useState<string[]>([]);
  const [architectureImages, setArchitectureImages] = useState<string[]>([]);
  const [structureImages, setStructureImages] = useState<string[]>([]);
  const [electricityWaterImages, setElectricityWaterImages] = useState<
    string[]
  >([]);
  const [isContinueButtonEnabled, setIsContinueButtonEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigationApp = useNavigation<AppStackNavigationProp>();

  useEffect(() => {
    if (
      perspectiveImages.length > 0 &&
      architectureImages.length > 0 &&
      structureImages.length > 0 &&
      electricityWaterImages.length > 0
    ) {
      setIsContinueButtonEnabled(true);
    } else {
      setIsContinueButtonEnabled(false);
    }
  }, [
    perspectiveImages,
    architectureImages,
    structureImages,
    electricityWaterImages,
  ]);

  const handleFilePicker = async (
    setImages: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
        allowMultiSelection: true,
      });
      
      const uris = results.map(result => result.uri);
      setImages(prevImages => [...prevImages, ...uris]);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // Người dùng hủy chọn file
      } else {
        console.error('Lỗi khi chọn file:', err);
      }
    }
  };

  const handleContinuePress = async () => {
    setLoading(true);
    try {
      const projectData = {
        ProjectId: projectId,
        PerspectiveImage: perspectiveImages,
        ArchitectureImage: architectureImages,
        StructureImage: structureImages,
        ElectricityWaterImage: electricityWaterImages,
      };

      await createProjectHaveDesign(projectData);
      setVisible(true);
    } catch (error) {
      console.error('Error creating project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (setImages: React.Dispatch<React.SetStateAction<string[]>>, uri: string) => {
    setImages(prevImages => prevImages.filter(image => image !== uri));
  };

  const renderUploadSection = (
    title: string,
    images: string[],
    setImages: React.Dispatch<React.SetStateAction<string[]>>,
  ) => (
    <View style={styles.uploadContainer}>
      <View style={styles.uploadItem}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.imageWrapper}>
          {images.map((uri, index) => (
            <View key={index} style={styles.filePreview}>
              {uri.toLowerCase().endsWith('.pdf') ? (
                <Text style={styles.pdfText}>PDF</Text>
              ) : (
                <Image source={{uri}} style={styles.image} />
              )}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveImage(setImages, uri)}>
                <Text style={styles.removeButtonText}>-</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={styles.drawings}
            onPress={() => handleFilePicker(setImages)}>
            <Image
              source={require('../../assets/image/icon/upload-icon.png')}
              style={styles.uploadIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Separator />
    </View>
  );

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Gửi bản thiết kế" />
      <ScrollView style={styles.content}>
        {renderUploadSection(
          'Phối cảnh',
          perspectiveImages,
          setPerspectiveImages,
        )}
        {renderUploadSection(
          'Kiến trúc',
          architectureImages,
          setArchitectureImages,
        )}
        {renderUploadSection('Kết cấu', structureImages, setStructureImages)}
        {renderUploadSection(
          'Điện nước',
          electricityWaterImages,
          setElectricityWaterImages,
        )}
      </ScrollView>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Tiếp tục"
          onPress={handleContinuePress}
          colors={
            isContinueButtonEnabled
              ? ['#53A6A8', '#3C9597', '#1F7F81']
              : ['#A9A9A9', '#A9A9A9', '#A9A9A9']
          }
          disabled={!isContinueButtonEnabled}
          loading={loading}
        />
      </View>

      <Dialog.Container contentStyle={styles.dialogContainer} visible={visible}>
        <Dialog.Title style={styles.dialogTitle}>Thành công</Dialog.Title>
        <Dialog.Description style={styles.dialogDescription}>
          Gửi bản vẽ thành công!
        </Dialog.Description>
        <Dialog.Button
          label="Xem danh sách"
          onPress={() => {
            setVisible(false);
            navigationApp.navigate('HistoryScreen');
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
    flex: 1,
    marginHorizontal: 20,
  },
  title: {
    fontFamily: FONTFAMILY.montserat_semibold,
    fontSize: 16,
    color: 'black',
  },
  titleUpload: {
    fontFamily: FONTFAMILY.montserat_semibold,
    fontSize: 14,
    color: 'black',
  },
  uploadContainer: {
    marginTop: 10,
  },
  imageWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  drawings: {
    marginTop: 10,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#02A9A3',
    borderRadius: 10,
    width: '40%',
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  uploadItem: {
    width: '100%',
  },
  uploadIcon: {
    width: 40,
    height: 40,
  },
  image: {
    width: '40%',
    height: 100,
    marginTop: 10,
    marginRight: '4%',
    marginBottom: 10,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: 'white',
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
    textTransform: 'none',
  },
  dialogButton: {
    color: '#1F7F81',
    fontFamily: FONTFAMILY.montserat_semibold,
    textTransform: 'none',
  },
  filePreview: {
    width: '40%',
    height: 100,
    marginTop: 10,
    marginRight: '4%',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  pdfText: {
    fontFamily: FONTFAMILY.montserat_semibold,
    fontSize: 16,
    color: '#1F7F81',
  },
  removeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 20,
    height: 20,
    borderRadius: 15,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 20,
  },
});

export default Hasdesign;
