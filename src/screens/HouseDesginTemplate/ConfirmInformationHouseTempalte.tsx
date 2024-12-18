import {View, StyleSheet, Animated, Text} from 'react-native';
import React, {useState, useCallback, useEffect, useRef} from 'react';
import AppBar from '../../components/Appbar';
import InputField from '../../components/InputField';
import {useSelector, useDispatch} from 'react-redux';
import {UltilitiesSelector} from '../../redux/selectors/UltilitiesSelector/UltilitiesSelector';
import {PackageSelector} from '../../redux/selectors/PackageSelector/PackageSelector';
import axios from 'axios';
import {getProfile} from '../../api/Account/Account';
import CustomButton from '../../components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {AppStackNavigationProp} from '../../types/TypeScreen';
import Dialog from 'react-native-dialog';
import {FONTFAMILY} from '../../theme/theme';
import {selectSubTemplateId} from '../../redux/selectors/HouseTemplate/SubTemplateSelector';
import {createProjectHouseTemplate} from '../../api/HouseTemplate/HouseTemplate';
import {resetDataSubTemplate} from '../../redux/actions/HouseTemplate/SubTemplate';
import {
  resetDataDetailUltilities,
  resetDataPackage,
  resetDataUltilities,
} from '../../redux/actions/reset/resetData';

const ConfirmInformationHouseTemplate: React.FC = () => {
  const navigationApp = useNavigation<AppStackNavigationProp>();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [addressError, setAddressError] = useState('');

  const ultilitiesData = useSelector(UltilitiesSelector);
  const packageData = useSelector(PackageSelector);
  const subTemplateData = useSelector(selectSubTemplateId);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        setCustomerId(profile.Id);
        setName(profile.Username);
        setPhone(profile.PhoneNumber);
        setEmail(profile.Email);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!address) {
      setAddressError('Địa chỉ không được để trống');
      return;
    }
    setAddressError('');
    setLoading(true);

    const quotationUtilitiesRequest =
      ultilitiesData.checkedItems.length > 0
        ? ultilitiesData.checkedItems.map((item: any) => ({
            utilitiesItemId: item.checkedItems ?? item.id,
            name: item.checkedItemName ?? item.name,
            price: item.totalPrice,
            quantity: item.area === '' ? null : item.area,
          }))
        : null;

    const projectData = {
      customerName: name,
      subTemplateId: subTemplateData,
      accountId: customerId,
      address: address,
      packageFinished: packageData.selectedComplete,
      quotationUtilitiesRequest,
    };

    try {
      await createProjectHouseTemplate(projectData);
      setLoading(false);
      setVisible(true);
      dispatch(resetDataSubTemplate());
      dispatch(resetDataDetailUltilities());
      dispatch(resetDataUltilities());
      dispatch(resetDataPackage());
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }, [customerId, address, packageData, ultilitiesData, subTemplateData]);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(fadeAnim, {
            toValue: 0.3,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      fadeAnim.setValue(1);
    }
  }, [loading, fadeAnim]);

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Xác nhận thông tin" />
      <View style={styles.bodyContainer}>
        <InputField
          name="Họ và tên"
          value={name}
          onChangeText={setName}
          placeholder="Nhập họ và tên"
        />
        <InputField
          name="Số điện thoại"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          placeholder="Nhập số điện thoại"
        />
        <InputField
          name="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Nhập email"
        />
        <InputField
          name="Địa chỉ"
          value={address}
          onChangeText={setAddress}
          placeholder="Nhập địa chỉ"
        />
        {addressError ? (
          <Text style={styles.errorText}>{addressError}</Text>
        ) : null}
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Yêu cầu báo giá"
          onPress={handleSubmit}
          colors={['#53A6A8', '#3C9597', '#1F7F81']}
          loading={loading}
        />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  bodyContainer: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  dialogContainer: {
    borderRadius: 12,
    marginHorizontal: 20,
    backgroundColor: 'white',
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
  errorText: {
    fontFamily: FONTFAMILY.montserat_bold,
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
});

export default ConfirmInformationHouseTemplate;
