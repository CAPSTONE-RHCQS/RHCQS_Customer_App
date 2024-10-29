import {View, Text, StyleSheet, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getPackages} from '../../api/Package/Package';
import Checkbox from '../../components/Checkbox';
import {FONTFAMILY} from '../../theme/theme';
import AppBar from '../../components/Appbar';
import CustomButton from '../../components/CustomButton';
import Separator from '../../components/Separator';
import {AppStackNavigationProp} from '../../types/TypeScreen';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {pushPackage} from '../../redux/actions/Package/PackageAction';

const Package: React.FC = () => {
  const navigationApp = useNavigation<AppStackNavigationProp>();
  const dispatch = useDispatch();

  const [packages, setPackages] = useState<
    {Id: string; PackageType: string; PackageName: string; Price: number}[]
  >([]);
  const [checkedRoughItems, setCheckedRoughItems] = useState<{
    [key: string]: boolean;
  }>({});
  const [checkedCompleteItems, setCheckedCompleteItems] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedRough, setSelectedRough] = useState<string | null>(null);
  const [selectedComplete, setSelectedComplete] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Hàm fetch dữ liệu gói thi công từ API và lấy dữ liệu từ AsynStorage
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const cachedData = await AsyncStorage.getItem('packages');
        let data;
        if (cachedData) {
          data = JSON.parse(cachedData);
        } else {
          data = await getPackages();
          await AsyncStorage.setItem('packages', JSON.stringify(data));
        }
        setPackages(data);

        // Kiểm tra và đặt trạng thái cho các mục đã chọn
        const storedRoughId = await AsyncStorage.getItem('selectedRough');
        const storedCompleteId = await AsyncStorage.getItem('selectedComplete');
        // Nếu có dữ liệu trong AsyncStorage thì đặt checkbox dựa theo data trong AsyncStorage
        if (storedRoughId) {
          setSelectedRough(storedRoughId);
          setCheckedRoughItems({[storedRoughId]: true});
        } else {
          const firstRough = data.find((pkg: {PackageName: string}) =>
            pkg.PackageName.includes('Gói thô'),
          );
          if (firstRough) {
            setSelectedRough(firstRough.Id);
            setCheckedRoughItems({[firstRough.Id]: true});
          }
        }

        if (storedCompleteId) {
          setSelectedComplete(storedCompleteId);
          setCheckedCompleteItems({[storedCompleteId]: true});
        } else {
          const firstComplete = data.find((pkg: {PackageName: string}) =>
            pkg.PackageName.includes('Gói hoàn thiện'),
          );
          if (firstComplete) {
            setSelectedComplete(firstComplete.Id);
            setCheckedCompleteItems({[firstComplete.Id]: true});
          }
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    fetchPackages();
  }, []);

  // Hàm xử lý khi chọn gói thô
  const handleRoughCheck = async (id: string) => {
    const newCheckedRoughItems = {...checkedRoughItems};
    // Kiểm tra trạng thái hiện tại của mục
    if (newCheckedRoughItems[id]) {
      // Nếu đã được chọn, hủy chọn
      newCheckedRoughItems[id] = false;
      setSelectedRough(null); // Hủy chọn selectedRough
    } else {
      // Nếu chưa được chọn, chọn mục này và hủy chọn các mục khác
      Object.keys(newCheckedRoughItems).forEach(key => {
        newCheckedRoughItems[key] = false;
      });
      newCheckedRoughItems[id] = true;
      setSelectedRough(id); // Cập nhật selectedRough
    }

    setCheckedRoughItems(newCheckedRoughItems);

    // Lưu trạng thái các mục đã check vào storage
    await AsyncStorage.setItem(
      'checkedRoughItems',
      JSON.stringify(newCheckedRoughItems),
    );
  };

  // Hàm xử lý khi chọn gói hoàn thiện
  const handleCompleteCheck = async (id: string) => {
    const newCheckedCompleteItems = {...checkedCompleteItems};
    // Kiểm tra trạng thái hiện tại của mục
    if (newCheckedCompleteItems[id]) {
      // Nếu đã được chọn, hủy chọn
      newCheckedCompleteItems[id] = false;
      setSelectedComplete(null); // Hủy chọn selectedComplete
    } else {
      // Nếu chưa được chọn, chọn mục này và hủy chọn các mục khác
      Object.keys(newCheckedCompleteItems).forEach(key => {
        newCheckedCompleteItems[key] = false;
      });
      newCheckedCompleteItems[id] = true;
      setSelectedComplete(id); // Cập nhật selectedComplete
    }

    setCheckedCompleteItems(newCheckedCompleteItems);

    // Lưu trạng thái các mục đã check vào storage
    await AsyncStorage.setItem(
      'checkedCompleteItems',
      JSON.stringify(newCheckedCompleteItems),
    );
  };

  // Hàm xử lý khi nhấn nút tiếp tục
  const handleNext = async () => {
    // Tìm gói thô và gói hoàn thiện dựa trên ID đã chọn
    const roughPackage = packages.find(pkg => pkg.Id === selectedRough);
    const completePackage = packages.find(pkg => pkg.Id === selectedComplete);

    // Lưu ID và tên gói vào storage
    await AsyncStorage.setItem('selectedRough', roughPackage?.Id || '');
    await AsyncStorage.setItem('selectedComplete', completePackage?.Id || '');
    await AsyncStorage.setItem(
      'roughPackageName',
      roughPackage?.PackageName || '',
    );
    await AsyncStorage.setItem(
      'completePackageName',
      completePackage?.PackageName || '',
    );

    // Điều hướng màn hình dựa trên ROUGH PACKAGE có được chọn hay ko
    if (selectedRough) {
      navigationApp.navigate('ConstructionScreen');
    } else {
      navigationApp.navigate('UltilitiesScreen');
    }

    // Gửi dữ liệu về redux
    dispatch(
      pushPackage({
        selectedRoughType: roughPackage?.PackageType,
        selectedRough: roughPackage?.Id,
        selectedCompleteType: completePackage?.PackageType,
        selectedComplete: completePackage?.Id,
        roughPackageName: roughPackage?.PackageName,
        completePackageName: completePackage?.PackageName,
        roughPackagePrice: roughPackage?.Price || 0,
        completePackagePrice: completePackage?.Price || 0,
      }),
    );
  };

  // Hàm render gói thô
  const renderRoughPackages = () => {
    return packages
      .filter(pkg => pkg.PackageType === 'ROUGH')
      .map((pkg, index) => (
        <Checkbox
          key={`${pkg.Id}-${index}`}
          id={pkg.Id}
          label={`${pkg.PackageName} - ${pkg.Price.toLocaleString()} VND`}
          isChecked={!!checkedRoughItems[pkg.Id]}
          onCheck={handleRoughCheck}
        />
      ));
  };

  // Hàm render gói hoàn thiện
  const renderCompletePackages = () => {
    return packages
      .filter(pkg => pkg.PackageType === 'FINISHED')
      .map((pkg, index) => (
        <Checkbox
          key={`${pkg.Id}-${index}`}
          id={pkg.Id}
          label={`${pkg.PackageName} - ${pkg.Price.toLocaleString()} VND`}
          isChecked={!!checkedCompleteItems[pkg.Id]}
          onCheck={handleCompleteCheck}
        />
      ));
  };

  // Kiểm tra nút tiếp tục có vô hiệu hóa không
  const isButtonDisabled = !selectedRough && !selectedComplete;

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Chọn gói thi công" />
      <View style={styles.packageContainer}>
        <View>
          <Text style={styles.sectionTitle}>Gói thô</Text>
          {renderRoughPackages()}
        </View>
        <View>
          <Text style={styles.sectionTitle2}>Gói hoàn thiện</Text>
          {renderCompletePackages()}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Tiếp tục"
          onPress={handleNext}
          colors={
            isButtonDisabled
              ? ['#A9A9A9', '#A9A9A9', '#A9A9A9']
              : ['#53A6A8', '#3C9597', '#1F7F81']
          }
          disabled={isButtonDisabled}
          loading={loading}
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
  packageContainer: {
    marginVertical: 14,
    marginHorizontal: 20,
    flex: 1,
  },
  sectionTitle: {
    fontFamily: FONTFAMILY.montserat_bold,
    fontSize: 20,
    color: 'black',
    marginVertical: 10,
  },
  sectionTitle2: {
    marginTop: 40,
    fontFamily: FONTFAMILY.montserat_bold,
    fontSize: 20,
    color: 'black',
    marginVertical: 10,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 20,
  },
});

export default Package;
