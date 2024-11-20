import {View, StyleSheet, Animated, Text} from 'react-native';
import React, {useState, useCallback, useEffect, useRef} from 'react';
import AppBar from '../../components/Appbar';
import InputField from '../../components/InputField';
import {useSelector, useDispatch} from 'react-redux';
import {UltilitiesSelector} from '../../redux/selectors/UltilitiesSelector/UltilitiesSelector';
import {ContructionSelector} from '../../redux/selectors/ContructionSelector/ContructionSelector';
import {PackageSelector} from '../../redux/selectors/PackageSelector/PackageSelector';
import {createProject} from '../../api/Project/project';
import axios from 'axios';
import {getProfile} from '../../api/Account/Account';
import CustomButton from '../../components/CustomButton';
import {useNavigation} from '@react-navigation/native';
import {AppStackNavigationProp} from '../../types/TypeScreen';
import Dialog from 'react-native-dialog';
import {FONTFAMILY} from '../../theme/theme';
import {
  resetDataConstruction,
  resetDataDetailConstruction,
  resetDataDetailUltilities,
  resetDataPackage,
  resetDataUltilities,
} from '../../redux/actions/reset/resetData';
import {PromotionSelector} from '../../redux/selectors/Promotion/PromotionSelector';
import Checkbox from '../../components/Checkbox';
import Separator from '../../components/Separator';

const ConfirmInformation: React.FC = () => {
  const navigationApp = useNavigation<AppStackNavigationProp>();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [projectName, setProjectName] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [addressError, setAddressError] = useState('');
  const [projectNameError, setProjectNameError] = useState('');
  const [hasDrawing, setHasDrawing] = useState<boolean>(false);

  const ultilitiesData = useSelector(UltilitiesSelector);
  const constructionData = useSelector(ContructionSelector);
  const packageData = useSelector(PackageSelector);
  const promotionData = useSelector(PromotionSelector);
  const detailUltilities = useSelector(
    (state: any) => state.detailUltilities || [],
  );

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
    setErrorMessage('');
    setAddressError('');
    setProjectNameError('');

    if (!address) {
      setAddressError('Địa chỉ không được để trống');
    }
    if (!projectName) {
      setProjectNameError('Tên dự án không được để trống');
    }
    if (!address || !projectName) {
      setLoading(false);
      return;
    }

    const initialQuotationItemRequests = constructionData.checkedItems.map(
      (item: any) => {
        const requestItem: any = {
          constructionItemId: item.id,
          area: item.area,
          pirce: item.totalPrice,
        };
        if (item.checkedItems !== 'undefined') {
          requestItem.subConstructionId = item.checkedItems;
        }
        return requestItem;
      },
    );

    const quotationUtilitiesRequest = ultilitiesData.checkedItems.map(
      (item: any) => ({
        utilitiesItemId: item.checkedItems ?? item.id,
        name: item.checkedItemName ?? item.name,
        price: item.totalPrice,
      }),
    );

    let projectType = 'ROUGH';
    if (packageData.selectedRough && packageData.selectedComplete) {
      projectType = 'ALL';
    } else if (packageData.selectedComplete) {
      projectType = 'FINISHED';
    } else if (hasDrawing === true) {
      projectType = 'HAVE_DRAWING';
    }

    const projectData = {
      customerId: customerId,
      name: projectName,
      type: projectType,
      address: address,
      area: constructionData.constructionArea,
      packageQuotations: [
        ...(packageData.selectedRough
          ? [
              {
                packageId: packageData.selectedRough,
                type: packageData.selectedRoughType,
              },
            ]
          : []),
        ...(packageData.selectedComplete
          ? [
              {
                packageId: packageData.selectedComplete,
                type: packageData.selectedCompleteType,
              },
            ]
          : []),
      ],
      initialQuotation: {
        initialQuotationItemRequests,
      },
      promotion: {
        id: promotionData.promotionId,
        discount: promotionData.discount,
      },
      quotationUtilitiesRequest,
      isDrawing: hasDrawing,
    };

    console.log('projectData', JSON.stringify(projectData, null, 2));

    projectData.initialQuotation.initialQuotationItemRequests.forEach(
      (item: any, index: number) => {
        console.log(
          `initialQuotationItemRequests[${index}]`,
          JSON.stringify(item, null, 2),
        );
      },
    );

    try {
      await createProject(projectData);
      dispatch(resetDataPackage());
      dispatch(resetDataUltilities());
      dispatch(resetDataDetailUltilities());
      dispatch(resetDataConstruction());
      dispatch(resetDataDetailConstruction());
      setLoading(false);
      setVisible(true);
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        console.log('Full error data:', errorData);
        if (errorData && typeof errorData === 'object') {
          console.log('error', errorData.Error);
          setErrorMessage(errorData.Error || 'Đã xảy ra lỗi không xác định');
        } else {
          setErrorMessage('Đã xảy ra lỗi không xác định');
        }
      } else {
        setErrorMessage('Đã xảy ra lỗi không xác định');
      }
      setVisible(true);
    }
  }, [
    customerId,
    projectName,
    address,
    constructionData,
    packageData,
    detailUltilities,
    dispatch,
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

        <InputField
          name="Tên dự án"
          value={projectName}
          onChangeText={setProjectName}
          placeholder="Nhập tên dự án"
        />
        <Checkbox
          id="hasDrawing"
          label="Đã có bản vẽ"
          isChecked={hasDrawing}
          onCheck={() => setHasDrawing(!hasDrawing)}
          isRequired={true}
        />
        {addressError ? (
          <Text style={styles.errorText}>{addressError}</Text>
        ) : null}
        {projectNameError ? (
          <Text style={styles.errorText}>{projectNameError}</Text>
        ) : null}
        <Separator />
        <View style={styles.noteContainer}>
          <View style={styles.noteTitleContainer}>
            <Text style={styles.noteTitle}>* </Text>
            <Text style={styles.noteText}>Chú thích</Text>
          </View>
          <Text style={styles.noteDescription}>
            Nếu khách hàng đã có bản vẽ sẵn, vui lòng chọn {'\n'}'Đã có bản vẽ'
          </Text>
        </View>
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
        <Dialog.Title style={styles.dialogTitle}>
          {errorMessage ? 'Lỗi' : 'Thành công'}
        </Dialog.Title>
        <Dialog.Description style={styles.dialogDescription}>
          {errorMessage || 'Dự án đã được tạo thành công!'}
        </Dialog.Description>
        <Dialog.Button
          label="Danh sách dự án"
          onPress={() => {
            setVisible(false);
            if (!errorMessage) {
              navigationApp.navigate('HistoryScreen');
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
  errorText: {
    color: 'red',
    fontFamily: FONTFAMILY.montserat_semibold,
    marginTop: 5,
  },
  noteContainer: {
    marginTop: 10,
  },
  noteTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  noteTitle: {
    color: 'red',
  },
  noteText: {
    color: 'black',
    fontFamily: FONTFAMILY.montserat_semibold,
    fontSize: 14,
  },
  noteDescription: {
    color: '#333',
    fontFamily: FONTFAMILY.montserat_regular,
    fontSize: 14,
    marginLeft: 10,
  },
});

export default ConfirmInformation;
