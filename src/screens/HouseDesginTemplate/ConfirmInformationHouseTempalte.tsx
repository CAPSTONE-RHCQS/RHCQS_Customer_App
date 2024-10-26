import {
    View,
    StyleSheet,
    Animated,
  } from 'react-native';
  import React, {useState, useCallback, useEffect, useRef} from 'react';
  import AppBar from '../../components/Appbar';
  import InputField from '../../components/InputField';
  import {useSelector} from 'react-redux';
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
  import { createProjectHouseTemplate } from '../../api/HouseTemplate/HouseTemplate';
  
  const ConfirmInformationHouseTemplate: React.FC = () => {
    const navigationApp = useNavigation<AppStackNavigationProp>();
  
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [customerId, setCustomerId] = useState('');
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
  
    const ultilitiesData = useSelector(UltilitiesSelector);
    const packageData = useSelector(PackageSelector);
    const subTemplateData = useSelector(selectSubTemplateId);
    console.log('subTemplateData', subTemplateData);

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
      setLoading(true);

      const quotationUtilitiesRequest = ultilitiesData.checkedItems.map(
        (item: any) => ({
          ultilitiesItemId: item.checkedItems ?? item.id,
          name: item.checkedItemName ?? item.name,
          price: item.totalPrice,
        }),
      );

      const projectData = {
        subTemplateId: subTemplateData,
        accountId: customerId,
        address: address,
        packageFinished: packageData.selectedComplete,
        quotationUtilitiesRequest,
      };

      try {
        await createProjectHouseTemplate(projectData);
        console.log('Project created successfully');
        console.log('projectData', projectData);
        setLoading(false);
        setVisible(true);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          console.error('Axios error:', error.response?.data);
          console.log('projectData', projectData);
        } else {
          console.error('Unexpected error:', error);
          console.log('projectData', projectData);
        }
      }
    }, [
      customerId,
      address,
      packageData,
      ultilitiesData,
      subTemplateData,
    ]);
  
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
        </View>
        <View style={styles.buttonContainer}>
          <CustomButton
            title="Xác nhận thông tin"
            onPress={handleSubmit}
            colors={['#53A6A8', '#3C9597', '#1F7F81']}
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
  
  export default ConfirmInformationHouseTemplate;
