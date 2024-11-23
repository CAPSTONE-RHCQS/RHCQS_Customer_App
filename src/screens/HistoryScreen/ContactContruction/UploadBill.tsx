import React, {useState} from 'react';
import {View, StyleSheet, Text, Image, TouchableOpacity, Alert} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import AppBar from '../../../components/Appbar';
import {AppStackNavigationProp, AppStackParamList} from '@/types/TypeScreen';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import CustomButton from '../../../components/CustomButton';
import {FONTFAMILY} from '../../../theme/theme';
import {uploadBill} from '../../../api/Project/project';
import Dialog from 'react-native-dialog';

const UploadBill: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'UploadBill'>>();
  const navigationApp = useNavigation<AppStackNavigationProp>();
  const {paymentId, projectId} = route.params;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0].uri || '');
      }
    });
  };

  const handleUploadImage = async () => {
    if (selectedImage) {
      setLoading(true);
      try {
        await uploadBill(paymentId, {selectedImage});
        setErrorMessage(null);
        setVisible(true);
      } catch (error) {
        console.error('Error uploading image:', error);
        setErrorMessage('Lỗi khi tải lên hình ảnh');
        setVisible(true);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Upload Bill" />
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.uploadContainer}
          onPress={handleSelectImage}>
          {selectedImage ? (
            <Image source={{uri: selectedImage}} style={styles.image} />
          ) : (
            <Image
              source={require('../../../assets/image/icon/upload-icon.png')}
              style={styles.icon}
            />
          )}
        </TouchableOpacity>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Upload"
          onPress={handleUploadImage}
          colors={['#53A6A8', '#3C9597', '#1F7F81']}
          loading={loading}
        />
      </View>
      <Dialog.Container contentStyle={styles.dialogContainer} visible={visible}>
        <Dialog.Title style={styles.dialogTitle}>
          {errorMessage ? 'Lỗi' : 'Thành công'}
        </Dialog.Title>
        <Dialog.Description style={styles.dialogDescription}>
          {errorMessage || 'Hóa đơn đã được tải lên thành công!'}
        </Dialog.Description>
        <Dialog.Button
          label="Đóng"
          onPress={() => {
            setVisible(false);
            if (!errorMessage) {
              navigationApp.navigate('TrackingContruction', {
                projectId: projectId,
              });
            }
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
  title: {
    fontSize: 20,
    fontFamily: FONTFAMILY.montserat_bold,
    marginHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginVertical: 20,
    marginHorizontal: 20,
  },
  uploadContainer: {
    width: 350,
    height: 650,
    borderWidth: 2,
    borderColor: '#53A6A8',
    borderStyle: 'dashed',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 50,
    height: 50,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
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
  dialogButton: {
    backgroundColor: '#53A6A8',
    color: 'white',
    fontFamily: FONTFAMILY.montserat_bold,
    padding: 10,
    borderRadius: 5,
  },
});

export default UploadBill;
