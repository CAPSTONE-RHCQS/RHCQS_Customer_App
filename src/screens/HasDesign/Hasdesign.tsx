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
import InputField from '../../components/InputField';
import Separator from '../../components/Separator';
import {FONTFAMILY} from '../../theme/theme';
import {launchImageLibrary} from 'react-native-image-picker';
import CustomButton from '../../components/CustomButton';
import {getProfile} from '../../api/Account/Account';
import {createProjectHaveDesign} from '../../api/HasDesign/HasDesign';
import Dialog from 'react-native-dialog';
import {useNavigation} from '@react-navigation/native';
import {AppStackNavigationProp} from '../../types/TypeScreen';

const Hasdesign: React.FC = () => {
  const [area, setArea] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [customerId, setCustomerId] = useState<string>('');
  const [perspectiveImages, setPerspectiveImages] = useState<string[]>([]);
  const [architectureImages, setArchitectureImages] = useState<string[]>([]);
  const [structureImages, setStructureImages] = useState<string[]>([]);
  const [electricityWaterImages, setElectricityWaterImages] = useState<string[]>([]);
  const [isContinueButtonEnabled, setIsContinueButtonEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const navigationApp = useNavigation<AppStackNavigationProp>();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        setCustomerId(profile.Id);
        console.log('customerId', customerId);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    if (area && address && customerId) {
      setIsContinueButtonEnabled(true);
    } else {
      setIsContinueButtonEnabled(false);
    }
  }, [area, address, customerId]);

  const handleImagePicker = (
    setImages: React.Dispatch<React.SetStateAction<string[]>>,
  ) => {
    launchImageLibrary({mediaType: 'photo', selectionLimit: 0}, response => {
      if (response.assets) {
        const uris = response.assets.map(asset => asset.uri || '');
        setImages(prevImages => [...prevImages, ...uris]);
      }
    });
  };

  const handleContinuePress = async () => {
    setLoading(true);
    try {
      const projectData = {
        AccountId: customerId,
        Address: address,
        Area: area,
        PerspectiveImage: perspectiveImages,
        ArchitectureImage: architectureImages,
        StructureImage: structureImages,
        ElectricityWaterImage: electricityWaterImages,
      };

      const response = await createProjectHaveDesign(projectData);
      console.log('Project created successfully:', response);
      setVisible(true);
    } catch (error) {
      console.error('Error creating project:', error);
      // TODO: Handle error (e.g., show an error message)
    } finally {
      setLoading(false);
    }
  };

  const renderUploadSection = (
    title: string,
    images: string[],
    setImages: React.Dispatch<React.SetStateAction<string[]>>,
  ) => (
    <View style={styles.uploadContainer}>
      <View style={styles.uploadItem}>
        <Text style={styles.titleUpload}>{title}</Text>
        <View style={styles.imageWrapper}>
          {images.map((uri, index) => (
            <Image key={index} source={{uri}} style={styles.image} />
          ))}
          <TouchableOpacity
            style={styles.drawings}
            onPress={() => handleImagePicker(setImages)}>
            <Image
              source={require('../../assets/image/icon/upload-icon.png')}
              style={styles.uploadIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <AppBar nameScreen="Gửi bảng thiết kế" />
      <View style={styles.content}>
        <InputField
          name="Diện tích đất"
          value={area}
          onChangeText={setArea}
          placeholder="Nhập diện tích đất"
          isRequired={true}
        />
        <InputField
          name="Địa chỉ"
          value={address}
          onChangeText={setAddress}
          placeholder="Nhập địa chỉ"
          isRequired={true}
        />
        <Separator />
        <Text style={styles.title}>Tải lên bảng thiết kế</Text>
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
      </View>

      <Dialog.Container contentStyle={styles.dialogContainer} visible={visible}>
        <Dialog.Title style={styles.dialogTitle}>Thành công</Dialog.Title>
        <Dialog.Description style={styles.dialogDescription}>
          Dự án đã được tạo thành công!
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
    </ScrollView>
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
    textTransform: 'none',
  },
  dialogButton: {
    color: '#1F7F81',
    fontFamily: FONTFAMILY.montserat_semibold,
    textTransform: 'none',
  },
});

export default Hasdesign;
