import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {AppStackParamList} from '../../types/TypeScreen';
import AppBar from '../../components/Appbar';
import {getHouseTemplateById} from '../../api/HouseTemplate/HouseTemplate';
import {FONTFAMILY} from '../../theme/theme';
import CustomButton from '../../components/CustomButton';

const HousePackageTemplate: React.FC = () => {
  const route =
    useRoute<RouteProp<AppStackParamList, 'HousePackageTemplate'>>();
  const {houseId} = route.params;

  const [packageName, setPackageName] = useState<string>('');
  const [packageHouse, setPackageHouse] = useState<any[]>([]);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchHouseTemplate = async () => {
      const data = await getHouseTemplateById(houseId);

      if (data.PackageHouses.length > 0) {
        setCurrentImage(data.PackageHouses[0].ImgUrl);
        setPackageHouse(data.PackageHouses);
        setPackageName(data.PackageHouses[0].PackageName);
      }
    };
    fetchHouseTemplate();
  }, [houseId]);

  const handleContinue = () => {};

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
          <Text style={styles.packageNoteTitle}>Chú thích</Text>
          <Text style={styles.packageNote}>
            - Đơn giá này áp dụng cho công trình nhà phố, biệt thự tiêu chuẩn
          </Text>
          <Text style={styles.packageNote}>
            - Tổng diện tích thi công trên 280m2
          </Text>
          <Text style={styles.packageNote}>
            - Có diện tích mỗi tầng từ 70m2 - 100m2
          </Text>
          <Text style={styles.packageNote}>
            - 2 phòng ngủ + 2 nhà vệ sinh mỗi lầu
          </Text>
          <Text style={styles.packageNote}>
            - Đơn giá trên chưa bao gồm VAT
          </Text>
          </View>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Tiếp tục"
          colors={['#53A6A8', '#3C9597', '#1F7F81']}
          onPress={handleContinue}
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
    marginTop: 40,
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
});

export default HousePackageTemplate;
