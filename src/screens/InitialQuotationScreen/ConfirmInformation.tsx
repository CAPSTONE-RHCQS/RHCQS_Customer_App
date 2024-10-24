import {View, Text, StyleSheet, Button, ActivityIndicator} from 'react-native';
import React, {useState, useCallback, useEffect} from 'react';
import AppBar from '../../components/Appbar';
import InputField from '../../components/InputField';
import {useSelector} from 'react-redux';
import {UltilitiesSelector} from '../../redux/selectors/UltilitiesSelector/UltilitiesSelector';
import {ContructionSelector} from '../../redux/selectors/ContructionSelector/ContructionSelector';
import {PackageSelector} from '../../redux/selectors/PackageSelector/PackageSelector';
import {createProject} from '../../api/Project/project';
import axios from 'axios';
import {getProfile} from '../../api/Account/Account';
import CustomButton from '../../components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {AppStackNavigationProp} from '../../types/TypeScreen';

const ConfirmInformation: React.FC = () => {
  const navigationApp = useNavigation<AppStackNavigationProp>();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [projectName, setProjectName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [loading, setLoading] = useState(false);

  const ultilitiesData = useSelector(UltilitiesSelector);
  console.log('ultilitiesData', ultilitiesData);
  const constructionData = useSelector(ContructionSelector);
  const packageData = useSelector(PackageSelector);
  const detailUltilities = useSelector(
    (state: any) => state.detailUltilities || [],
  );

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        setCustomerId(profile.Id);
        console.log('customerId', profile.Id);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    navigationApp.navigate('HistoryScreen');

    const initialQuotationItemRequests = constructionData.checkedItems.map(
      (item: any) => ({
        constructionItemId: item.id,
        subConstructionId: item.checkedItems,
        area: item.area,
        pirce: item.totalPrice,
      }),
    );

    const quotationUtilitiesRequest = ultilitiesData.checkedItems.map(
      (item: any) => ({
        ultilitiesItemId: item.checkedItems ?? item.id,
        name: item.checkedItemName ?? item.name,
        price: item.totalPrice,
      }),
    );

    console.log('quotationUtilitiesRequest', quotationUtilitiesRequest);

    const projectData = {
      customerId: customerId,
      name: projectName,
      type: 'ALL',
      address: address,
      area: constructionData.constructionArea,
      packageQuotations: [
        {
          packageId: packageData.selectedRough,
          type: packageData.selectedRoughType,
        },
        {
          packageId: packageData.selectedComplete,
          type: packageData.selectedCompleteType,
        },
      ],
      initialQuotation: {
        promotionId: null,
        initialQuotationItemRequests,
      },
      quotationUtilitiesRequest,
    };

    try {
      await createProject(projectData);
      console.log('Project created successfully');
      console.log('projectData', projectData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error:', error.response?.data);
      } else {
        console.error('Unexpected error:', error);
      }
    }
  }, [
    customerId,
    projectName,
    address,
    constructionData,
    packageData,
    detailUltilities,
  ]);

  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#1F7F81"
        style={{flex: 1, justifyContent: 'center', alignItems: 'center', opacity: 0.5}}
      />
    );
  }

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
        <InputField
          name="Tên dự án"
          value={projectName}
          onChangeText={setProjectName}
          placeholder="Nhập tên dự án"
        />
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Xác nhận thông tin"
          onPress={handleSubmit}
          colors={['#53A6A8', '#3C9597', '#1F7F81']}
        />
      </View>
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
});

export default ConfirmInformation;
