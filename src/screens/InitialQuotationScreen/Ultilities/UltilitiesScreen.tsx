import {COLORS, FONTFAMILY} from '../../../theme/theme';
import AppBar from '../../../components/Appbar';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Ultilities from '../../../components/Ultilities';
import Separator from '../../../components/Separator';
import {
  getAllUltilities,
  getRoughUltilities,
  getFinishedUltilities,
} from '../../../api/Ultilities/Ultilities';
import {
  Section,
  Ultilities as UltilitiesType,
} from '../../../types/screens/Ultilities/UltilitiesType';
import {ScrollView} from 'react-native-gesture-handler';
import CustomButton from '../../../components/CustomButton';
import {PackageSelector} from '../../../redux/selectors/PackageSelector/PackageSelector';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {AppStackNavigationProp} from '../../../types/TypeScreen';
import {ContructionSelector} from '../../../redux/selectors/ContructionSelector/ContructionSelector';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {pushUltilities} from '../../../redux/actions/Ultilities/UltilitiesAction';
import {DetailUltilitiesSelector} from '../../../redux/selectors/UltilitiesSelector/DetailUltilitiesSelector/DetailUltilitiesSelector';
import {useFocusEffect} from '@react-navigation/native';
import InputField from '../../../components/InputField';
import {pushConstruction} from '../../../redux/actions/Contruction/ContructionAction';
import {PromotionType} from '../../../types/screens/Promotion/Promotion';
import {getPromotion} from '../../../api/Promotion/Promotion';
import Promotion from '../../../components/Promotion';
import {pushPromotion} from '../../../redux/actions/Promotion/PromotionAction';

const UltilitiesScreen: React.FC = () => {
  const navigationApp = useNavigation<AppStackNavigationProp>();
  const dispatch = useDispatch();


  const detailUltilitiesData = useSelector(DetailUltilitiesSelector);
  const packageData = useSelector(PackageSelector);
  const constructionData = useSelector(ContructionSelector);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [constructionArea, setConstructionArea] = useState<string>(
    constructionData.constructionArea,
  );

  const [ultilities, setUltilities] = useState<UltilitiesType[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [promotion, setPromotion] = useState<PromotionType[]>([]);
  const [selectedPromotionValue, setSelectedPromotionValue] =
    useState<number>(0);
  const [selectedPromotionId, setSelectedPromotionId] = useState<string | null>(
    null,
  );

  const fetchUltilities = async () => {
    const selectedRoughType = packageData.selectedRoughType;
    const selectedCompleteType = packageData.selectedCompleteType;

    switch (true) {
      case selectedRoughType === 'ROUGH' && selectedCompleteType === 'FINISHED':
        const allData = await getAllUltilities();
        setUltilities(allData);
        break;
      case selectedRoughType === 'ROUGH' && selectedCompleteType === undefined:
        const roughData = await getRoughUltilities();
        setUltilities(roughData);
        break;
      case selectedRoughType === undefined &&
        selectedCompleteType === 'FINISHED':
        const finishedData = await getFinishedUltilities();
        setUltilities(finishedData);
        break;
      default:
        break;
    }
  };

  const fetchPromotion = async () => {
    const promotionData = await getPromotion();
    console.log('promotionData', JSON.stringify(promotionData, null, 2));

    const filteredPromotions = promotionData.filter(promo => {
      const completePackageName = packageData.completePackageName;
      const roughPackageName = packageData.roughPackageName;
      return (
        (completePackageName && promo.Name.includes(completePackageName)) ||
        (roughPackageName && promo.Name.includes(roughPackageName))
      );
    });

    setPromotion(filteredPromotions);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchUltilities();
      fetchPromotion();
    }, [packageData]),
  );

  const handleDetailPress = (Id: string) => {
    navigationApp.navigate('DetailUltilities', {Id});
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
    if (checkedItems.length === 0) return;
    navigationApp.navigate('ConfirmInformation');

    const detailedCheckedItems = checkedItems
      .map(id =>
        Object.values(detailUltilitiesData).find(
          (detail: any) => detail.id === id,
        ),
      )
      .filter(Boolean);

    dispatch(
      pushUltilities({
        checkedItems: detailedCheckedItems,
      }),
    );

    if (selectedPromotionId) {
      dispatch(
        pushPromotion({
          promotionId: selectedPromotionId,
          discount: discountAmount,
        }),
      );
    }

    if (
      !(
        packageData.selectedRoughType === 'ROUGH' &&
        (packageData.selectedCompleteType === 'FINISHED' ||
          packageData.selectedCompleteType === undefined)
      )
    ) {
      dispatch(
        pushConstruction({
          constructionArea: constructionArea,
        }),
      );
    }
  };

  const handlePromotionSelect = (promotionId: string) => {
    if (selectedPromotionId === promotionId) {
      return;
    }

    const selectedPromotion = promotion.find(promo => promo.Id === promotionId);
    if (selectedPromotion) {
      setSelectedPromotionValue(selectedPromotion.Value);
      setSelectedPromotionId(selectedPromotion.Id);
    }
  };

  const calculateDiscount = () => {
    const area = parseFloat(constructionArea) || 0;
    return area * selectedPromotionValue;
  };

  const discountAmount = calculateDiscount();
  const finalTotalPrice =
    constructionData.totalPrice + totalPrice - discountAmount;

  const renderUltilities = () => {
    return ultilities.map((utility, index) => {
      return (
        <Ultilities
          key={index} // Mỗi tiện ích được lặp qua sẽ có một key là index để React xác định các phần tử một cách duy nhất.
          id={utility.Id} // Truyền Id của tiện ích vào component Ultilities.
          title={`${index + 1} - ${utility.Name}`} // Truyền tên tiện ích vào component Ultilities.
          ultilities={utility.Sections.map(section => {
            // Mỗi section của tiện ích sẽ được xử lý.
            const detail = detailUltilitiesData.find(
              (detail: any) => detail.id === section.Id,
            );

            const price = detail ? detail.totalPrice : 0;
            const area = detail ? detail.checkedItemName : '';

            const formattedPrice = price.toLocaleString();
            // Trả về đối tượng section, bao gồm các thông tin và hàm xử lý checkbox cho từng mục trong Ultilities.
            return {
              id: section.Id, // Truyền Id của section.
              title: section.Name, // Truyền tên section.
              price: formattedPrice, // Truyền giá, được định dạng với dấu phân cách hàng nghìn.
              area: area, // Truyền thông tin area của section.
              unit: '', // Giá trị đơn vị để trống.
              isChecked: checkedItems.includes(section.Id), // Kiểm tra xem section này có nằm trong danh sách checkedItems không.

              // Hàm xử lý khi checkbox được nhấn, nó sẽ truyền Id của section và giá đã được convert từ chuỗi sang số.
              onCheckBoxPress: () =>
                handleCheckBoxPress(section.Id, parseFloat(price)),
            };
          })}
          onDetailPress={handleDetailPress} // Truyền hàm xử lý sự kiện khi người dùng nhấn vào chi tiết của tiện ích.
          // Truyền một hàm xử lý chung cho checkbox, nhưng ở cấp tiện ích, hàm này được định nghĩa ở component cha.
          onCheckBoxPress={handleCheckBoxPress}
        />
      );
    });
  };

  const renderPromotions = () => {
    return (
      <Promotion
        id="promotion-section"
        title="Khuyến mãi"
        promotions={promotion}
        onDetailPress={handlePromotionSelect}
      />
    );
  };

  const isContinueButtonEnabled = checkedItems.length > 0;

  useEffect(() => {
    if (promotion.length > 0 && !selectedPromotionId) {
      const firstPromotion = promotion[0];
      setSelectedPromotionValue(firstPromotion.Value);
      setSelectedPromotionId(firstPromotion.Id);
    }
  }, [promotion]);

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Tính chi phí xây dựng" />
      {packageData.selectedRoughType === undefined &&
        packageData.selectedCompleteType === 'FINISHED' && (
          <View style={styles.inputContainer}>
            <InputField
              name="Diện tích xây dựng"
              value={constructionArea}
              onChangeText={setConstructionArea}
              placeholder="90"
              keyboardType="numeric"
              isRequired={true}
            />
          </View>
        )}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.titleText}>Tùy chọn & tiện ích</Text>
        <View style={styles.body}>{renderUltilities()}</View>
        <View style={styles.promotionContainer}>{renderPromotions()}</View>
      </ScrollView>
      <View style={styles.buttonContainer}>
        <Separator />
        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPriceText}>Tổng tiền: </Text>
          <Text style={styles.totalPrice}>
            {finalTotalPrice.toLocaleString()} VND
          </Text>
        </View>
        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPriceText}>Đã giảm: </Text>
          <Text style={styles.totalPrice}>
            {discountAmount.toLocaleString()} VND
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
          disabled={!isContinueButtonEnabled}
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
  promotionContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  inputContainer: {
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

export default UltilitiesScreen;
