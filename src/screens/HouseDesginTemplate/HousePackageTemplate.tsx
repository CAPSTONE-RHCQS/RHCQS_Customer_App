import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  AppStackNavigationProp,
  AppStackParamList,
} from '../../types/TypeScreen';
import AppBar from '../../components/Appbar';
import {getHouseTemplateById} from '../../api/HouseTemplate/HouseTemplate';
import {COLORS, FONTFAMILY} from '../../theme/theme';
import CustomButton from '../../components/CustomButton';
import {useDispatch, useSelector} from 'react-redux';
import {pushPackage} from '../../redux/actions/Package/PackageAction';
import {
  selectArea,
  selectTotalRough,
} from '../../redux/selectors/HouseTemplate/SubTemplateSelector';
import {pushSubTemplate} from '../../redux/actions/HouseTemplate/SubTemplate';

const HousePackageTemplate: React.FC = () => {
  const route =
    useRoute<RouteProp<AppStackParamList, 'HousePackageTemplate'>>();
  const {houseId} = route.params;
  const totalArea = useSelector(selectArea);
  const totalRough = useSelector(selectTotalRough);
  const dispatch = useDispatch();
  const navigationApp = useNavigation<AppStackNavigationProp>();
  const [packageName, setPackageName] = useState<string>('');
  const [packageHouse, setPackageHouse] = useState<any[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('');
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [packagePrice, setPackagePrice] = useState<number>(0);

  useEffect(() => {
    const fetchHouseTemplate = async () => {
      try {
        const data = await getHouseTemplateById(houseId);
        if (data.PackageHouses.length > 0) {
          setCurrentImage(data.PackageHouses[0].ImgUrl);
          setPackageHouse(data.PackageHouses);
          setPackageName(data.PackageHouses[0].PackageName);
          setDescription(data.PackageHouses[0].Description);
          setSelectedPackageId(data.PackageHouses[0].PackageId);
          setPackagePrice(data.PackageHouses[0].Price);
          setTotalPrice(totalArea * data.PackageHouses[0].Price);
        }
      } catch (error) {
        console.error('Error fetching house template:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHouseTemplate();
  }, [houseId, totalArea]);

  const handleContinue = () => {
    if (selectedPackageId) {
      navigationApp.navigate('UltilitiesHouse');
      const totalCost = totalRough + totalPrice;
      dispatch(
        pushPackage({
          selectedRoughType: undefined,
          completePackageName: packageName,
          selectedComplete: selectedPackageId,
          selectedCompleteType: 'FINISHED',
        }),
      );
      dispatch(
        pushSubTemplate({
          totalPrice: totalCost,
        }),
      );
    }
  };

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Chọn gói thi công hoàn thiện" />

      <View style={styles.content}>
        {/* Image */}
        <View style={styles.imageContainer}>
          {currentImage && (
            <Image source={{uri: currentImage}} style={styles.image} />
          )}
        </View>

        {/* Package */}
        <View style={styles.packageContainer}>
          <Text style={styles.packageTitle}>Chọn gói thi công hoàn thiện</Text>
          {packageHouse.map((pkg, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.packageButton,
                packageName === pkg.PackageName && styles.activePackageButton,
              ]}
              onPress={() => {
                setCurrentImage(pkg.ImgUrl);
                setPackageName(pkg.PackageName);
                setSelectedPackageId(pkg.PackageId);
                setPackagePrice(pkg.Price);
                setTotalPrice(totalArea * pkg.Price);
              }}>
              <Text
                style={[
                  styles.packageText,
                  packageName === pkg.PackageName && styles.activePackageText,
                ]}>
                {pkg.PackageName}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={styles.packageNoteContainer}>
            <Text style={styles.packagePriceText}>
              Giá gói hoàn thiện:{' '}
              <Text style={styles.packagePrice}>
                {packagePrice.toLocaleString()} VNĐ
              </Text>
            </Text>
            <Text style={styles.packagePriceText}>
              Diện tích xây dựng mãu đã chọn:{' '}
              <Text style={styles.packagePrice}>{totalArea} m2</Text>
            </Text>
            <Text style={styles.packageNoteContent}>
              Công thức tính tổng tiền: Diện tích x Giá gói
            </Text>
            <Text style={styles.packageNoteTitle}>Chú thích</Text>
            <Text style={styles.packageNote}>{description}</Text>
          </View>
        </View>
      </View>
      <View style={styles.totalPriceContainer}>
        <Text style={styles.totalPriceText}>Tổng tiền thô: </Text>
        <Text style={styles.totalPrice}>{totalRough.toLocaleString()} VNĐ</Text>
      </View>
      <View style={styles.totalPriceContainer}>
        <Text style={styles.totalPriceText}>Tổng tiền hoàn thiện: </Text>
        <Text style={styles.totalPrice}>{totalPrice.toLocaleString()} VNĐ</Text>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Tiếp tục"
          colors={
            selectedPackageId && !loading
              ? ['#53A6A8', '#3C9597', '#1F7F81']
              : ['#d3d3d3', '#d3d3d3', '#d3d3d3']
          }
          onPress={handleContinue}
          loading={loading}
          disabled={!selectedPackageId || loading}
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
  content: {
    flex: 1,
  },
  packageTitle: {
    fontSize: 16,
    fontFamily: FONTFAMILY.montserat_bold,
    color: 'black',
    marginBottom: 16,
  },
  packageNoteContainer: {
    marginTop: 10,
  },
  packageNoteTitle: {
    fontSize: 16,
    fontFamily: FONTFAMILY.montserat_bold,
    color: 'black',
    marginBottom: 5,
  },
  packageNote: {
    marginBottom: 5,
    fontSize: 12,
    fontFamily: FONTFAMILY.montserat_regular,
    color: 'black',
  },
  packageNoteContent: {
    marginBottom: 5,
    fontSize: 12,
    fontFamily: FONTFAMILY.montserat_bold,
    color: 'red',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  packageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  packageButton: {
    width: '48%',
    padding: 10,
    borderWidth: 1.2,
    borderColor: 'black',
    borderRadius: 6,
    marginBottom: 10,
    alignItems: 'center',
  },
  activePackageButton: {
    borderColor: '#53A6A8',
  },
  packageText: {
    fontSize: 13,
    color: 'black',
    fontFamily: FONTFAMILY.montserat_regular,
  },
  activePackageText: {
    color: '#53A6A8',
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  totalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  totalPriceText: {
    fontFamily: FONTFAMILY.montserat_semibold,
    fontSize: 16,
    color: 'black',
    textAlign: 'right',
  },
  totalPrice: {
    fontFamily: FONTFAMILY.montserat_semibold,
    fontSize: 16,
    color: COLORS.primary,
    textAlign: 'right',
  },
  packagePriceText: {
    fontSize: 12,
    fontFamily: FONTFAMILY.montserat_bold,
    color: 'black',
    marginBottom: 5,
  },
  packagePrice: {
    color: COLORS.primary,
  },
});

export default HousePackageTemplate;
