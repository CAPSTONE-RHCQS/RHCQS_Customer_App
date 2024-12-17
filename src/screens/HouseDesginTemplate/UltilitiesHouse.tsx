import {COLORS, FONTFAMILY} from '../../theme/theme';
import AppBar from '../../components/Appbar';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Ultilities from '../../components/Ultilities';
import Separator from '../../components/Separator';
import {
  getFinishedUltilities,
  getHouseTemplateUltilities,
} from '../../api/Ultilities/Ultilities';
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
import {selectTotalRough} from '../../redux/selectors/HouseTemplate/SubTemplateSelector';

const UltilitiesHouse: React.FC = () => {
  const navigationApp = useNavigation<AppStackNavigationProp>();
  const dispatch = useDispatch();

  const detailUltilitiesData = useSelector(DetailUltilitiesSelector);
  const packageData = useSelector(PackageSelector);
  const totalRough = useSelector(selectTotalRough);

  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [ultilities, setUltilities] = useState<UltilitiesType[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(totalRough);
  const [loading, setLoading] = useState(false);
  const fetchUltilities = async () => {
    const selectedCompleteType = packageData.selectedCompleteType;

    if (selectedCompleteType === 'FINISHED') {
      const finishedData = await getHouseTemplateUltilities();
      setUltilities(finishedData);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUltilities();
      const calculateTotalPrice = () => {
        let newTotalPrice = totalRough;
        checkedItems.forEach(id => {
          const detail = detailUltilitiesData.find(
            (detail: any) => detail.id === id,
          );
          if (detail) {
            newTotalPrice += detail.totalPrice;
          }
        });
        setTotalPrice(newTotalPrice);
      };
      calculateTotalPrice();
    }, [packageData, checkedItems, detailUltilitiesData]),
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

      setTotalPrice(prevTotal =>
        isChecked ? prevTotal - price : prevTotal + price,
      );

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
    setLoading(true);
    navigationApp.navigate('ConfirmInformationHouseTemplate');

    const detailedCheckedItems = checkedItems
      .map(id =>
        Object.values(detailUltilitiesData).find(
          (detail: any) => detail.id === id,
        ),
      )
      .filter(Boolean);

    dispatch(pushUltilities({checkedItems: detailedCheckedItems}));
    setLoading(false);
  };

  const formatPrice = (price: number): string => {
    return price.toLocaleString();
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

            return {
              id: section.Id,
              title: section.Name,
              price: price,
              area: area,
              unit: '',
              isChecked: checkedItems.includes(section.Id),
              onCheckBoxPress: () => handleCheckBoxPress(section.Id, price),
            };
          })}
          onDetailPress={handleDetailPress}
          onCheckBoxPress={handleCheckBoxPress}
          formatPrice={formatPrice}
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
          <Text style={styles.totalPrice}>{formatPrice(totalPrice)} VNĐ</Text>
        </View>
        <CustomButton
          title="Tiếp tục"
          onPress={handleContinuePress}
          colors={['#53A6A8', '#3C9597', '#1F7F81']}
          disabled={false}
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
    fontSize: 16,
    color: 'black',
    textAlign: 'right',
    marginBottom: 10,
  },
  totalPrice: {
    fontFamily: FONTFAMILY.montserat_semibold,
    fontSize: 16,
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
