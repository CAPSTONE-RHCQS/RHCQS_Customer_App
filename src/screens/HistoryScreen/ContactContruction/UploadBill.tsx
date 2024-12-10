import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import AppBar from '../../../components/Appbar';
import {AppStackNavigationProp, AppStackParamList} from '@/types/TypeScreen';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import CustomButton from '../../../components/CustomButton';
import {FONTFAMILY} from '../../../theme/theme';
import {uploadBill} from '../../../api/Project/project';
import {getPaymentById} from '../../../api/Project/project';
import Dialog from 'react-native-dialog';
import {deleteBill} from '../../../api/Project/project';

const UploadBill: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'UploadBill'>>();
  const navigationApp = useNavigation<AppStackNavigationProp>();
  const {paymentId, projectId} = route.params;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [payment, setPayment] = useState<any>(null);

  const handleSelectImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets && response.assets.length > 0) {
        setSelectedImage(response.assets[0].uri || '');
      }
    });
  };

  const fetchPayment = async () => {
    const paymentData = await getPaymentById(paymentId);
    setPayment(paymentData);
    setSelectedImage(paymentData);
  };

  useEffect(() => {
    fetchPayment();
  }, [paymentId]);

  const handleDeleteImage = async () => {
    try {
      setLoading(true);
      await deleteBill(paymentId);
      setSuccessMessage('Đã gỡ hóa đơn thành công');
      setVisible(true);
      fetchPayment();
    } catch (error) {
      setErrorMessage('Lỗi khi gỡ hóa đơn');
      setVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = async () => {
    if (selectedImage) {
      setLoading(true);
      try {
        await uploadBill(paymentId, {selectedImage});
        setErrorMessage(null);
        setSuccessMessage('Hóa đơn đã được tải lên thành công!');
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
      <AppBar nameScreen="Xác nhận thanh toán" />
      <View style={styles.content}>
        <Text style={styles.title}>Hóa đơn thanh toán</Text>
        <TouchableOpacity
          style={styles.uploadContainer}
          onPress={handleSelectImage}>
          {selectedImage ? (
            <Image source={{uri: selectedImage || ''}} style={styles.image} />
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
          title={payment ? 'Gỡ hóa đơn' : 'Xác nhận thanh toán'}
          onPress={payment ? handleDeleteImage : handleUploadImage}
          colors={
            payment
              ? ['#FF0000', '#C70000', '#A00000']
              : ['#53A6A8', '#3C9597', '#1F7F81']
          }
          loading={loading}
        />
      </View>
      <Dialog.Container contentStyle={styles.dialogContainer} visible={visible}>
        <Dialog.Title style={styles.dialogTitle}>
          {errorMessage ? 'Lỗi' : 'Thông báo'}
        </Dialog.Title>
        <Dialog.Description style={styles.dialogDescription}>
          {errorMessage || successMessage}
        </Dialog.Description>
        <Dialog.Button
          label="Đóng"
          onPress={() => {
            setVisible(false);
            if (!errorMessage) {
              navigationApp.navigate('TrackingScreen', {
                projectId: projectId,
              });
            } else {
              navigationApp.navigate('UploadBill', {paymentId, projectId});
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
    marginBottom: 20,
    color: 'black',
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
