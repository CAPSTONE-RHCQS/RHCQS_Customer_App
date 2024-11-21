import {COLORS, FONTFAMILY} from '../../theme/theme';
import AppBar from '../../components/Appbar';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Ultilities from '../../components/Ultilities';
import Separator from '../../components/Separator';
import {getFinishedUltilities} from '../../api/Ultilities/Ultilities';
import {Ultilities as UltilitiesType} from '../../types/screens/Ultilities/UltilitiesType';
import {ScrollView} from 'react-native-gesture-handler';
import CustomButton from '../../components/CustomButton';
import {PackageSelector} from '../../redux/selectors/PackageSelector/PackageSelector';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {AppStackNavigationProp} from '../../types/TypeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {pushUltilities} from '../../redux/actions/Ultilities/UltilitiesAction';
import {DetailUltilitiesSelector} from '../../redux/selectors/UltilitiesSelector/DetailUltilitiesSelector/DetailUltilitiesSelector';
import {useFocusEffect} from '@react-navigation/native';

const UltilitiesHouse: React.FC = () => {
  const navigationApp = useNavigation<AppStackNavigationProp>();
  const dispatch = useDispatch();

  // Lấy dữ liệu chi tiết các mục tiện ích
  const detailUltilitiesData = useSelector(DetailUltilitiesSelector);
  console.log('detailUltilitiesData', detailUltilitiesData);
  // Lấy dữ liệu package
  const packageData = useSelector(PackageSelector);
  console.log('packageData', packageData);

  // State để lưu trữ ID các mục đã check
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  // State để lưu trữ dữ liệu các mục tiện ích
  const [ultilities, setUltilities] = useState<UltilitiesType[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const fetchUltilities = async () => {
    const selectedCompleteType = packageData.selectedCompleteType;

    if (selectedCompleteType === 'FINISHED') {
      const finishedData = await getFinishedUltilities();
      console.log('finishedData', finishedData);
      setUltilities(finishedData);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUltilities();
    }, [packageData]),
  );

  const handleDetailPress = (Id: string) => {
    navigationApp.navigate('DetailUltilitiesHouse', {Id});
  };

  const handleCheckBoxPress = async (id: string, price: number) => {
    setCheckedItems(prevState => {
      const isChecked = prevState.includes(id);
      const newCheckedItems = isChecked
        ? prevState.filter(item => item !== id)
        : [...prevState, id];

      // Cập nhật tổng tiền
      setTotalPrice(prevTotal =>
        isChecked ? prevTotal - price : prevTotal + price,
      );

      // Lưu hoặc xóa ID trong AsyncStorage
      if (isChecked) {
        AsyncStorage.setItem(
          'checkedItemsUltilities',
          JSON.stringify(newCheckedItems),
        );
      } else {
        AsyncStorage.removeItem('checkedItemsUltilities');
      }

      return newCheckedItems;
    });
  };

  const handleContinuePress = () => {
    if (checkedItems.length === 0) return;
    navigationApp.navigate('ConfirmInformationHouseTemplate');

    const detailedCheckedItems = checkedItems
      .map(id =>
        Object.values(detailUltilitiesData).find(
          (detail: any) => detail.id === id,
        ),
      )
      .filter(Boolean);

    dispatch(pushUltilities({checkedItems: detailedCheckedItems}));
  };

  const renderUltilities = () => {
    return ultilities.map((utility, index) => {
      return (
        <Ultilities
          key={index}
          id={utility.Id}
          title={`${index + 1} - ${utility.Name}`}
          ultilities={utility.Sections.map(section => {
            const detail = detailUltilitiesData.find(
              (detail: any) => detail.id === section.Id,
            );

            const price = detail ? detail.totalPrice : 0;
            const area = detail ? detail.checkedItemName : '';

            const formattedPrice = price.toLocaleString();
            return {
              id: section.Id,
              title: section.Name,
              price: formattedPrice,
              area: area,
              unit: '',
              isChecked: checkedItems.includes(section.Id),
              onCheckBoxPress: () =>
                handleCheckBoxPress(section.Id, parseFloat(price)),
            };
          })}
          onDetailPress={handleDetailPress}
          onCheckBoxPress={handleCheckBoxPress}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Tính chi phí xây dựng" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.titleText}>Tùy chọn & tiện ích</Text>

        <View style={styles.body}>{renderUltilities()}</View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Separator />
        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPriceText}>Tổng tiền: </Text>
          <Text style={styles.totalPrice}>
            {totalPrice.toLocaleString()} VND
          </Text>
        </View>
        <CustomButton
          title="Tiếp tục"
          onPress={handleContinuePress}
          colors={
            checkedItems.length > 0
              ? ['#53A6A8', '#3C9597', '#1F7F81']
              : ['#d3d3d3', '#d3d3d3', '#d3d3d3']
          }
          disabled={checkedItems.length === 0}
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
  body: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 20,
  },
  titleText: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    fontFamily: FONTFAMILY.montserat_bold,
    fontSize: 18,
    color: 'black',
  },
  totalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalPriceText: {
    fontFamily: FONTFAMILY.montserat_semibold,
    fontSize: 14,
    color: 'black',
    textAlign: 'right',
    marginBottom: 10,
  },
  totalPrice: {
    fontFamily: FONTFAMILY.montserat_semibold,
    fontSize: 14,
    color: COLORS.primary,
    textAlign: 'right',
    marginBottom: 10,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 20,
  },
});

export default UltilitiesHouse;
