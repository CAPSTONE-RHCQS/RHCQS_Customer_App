import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AppBar from '../../components/Appbar';
import {AppStackNavigationProp, AppStackParamList} from '@/types/TypeScreen';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {getUltilitiesSectionById} from '../../api/Ultilities/Ultilities';
import {Section} from '../../types/screens/Ultilities/UltilitiesType';
import Checkbox from '../../components/Checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FONTFAMILY} from '../../theme/theme';
import Separator from '../../components/Separator';
import {useDispatch, useSelector} from 'react-redux';
import {ContructionSelector} from '../../redux/selectors/ContructionSelector/ContructionSelector';
import CustomButton from '../../components/CustomButton';
import storage from '../../utils/storage';
import {pushDetailUltilities} from '../../redux/actions/Ultilities/DetailUltilitiesAction';
import InputField from '../../components/InputField';

const DetailUltilitiesHouse: React.FC = () => {
  // route
  const route = useRoute<RouteProp<AppStackParamList, 'DetailUltilities'>>();
  const navigationUltilities = useNavigation<AppStackNavigationProp>();
  const dispatch = useDispatch();
  const {Id} = route.params;

  const constructionData = useSelector(ContructionSelector);
  const [quantity, setQuantity] = useState('1');
  const [sectionData, setSectionData] = useState<Section | null>(null);
  const [coefficients, setCoefficients] = useState<{[key: string]: number}>({});
  const [coefficient, setCoefficient] = useState(0);
  const [checkedItems, setCheckedItems] = useState<{[key: string]: boolean}>(
    {},
  );
  const totalPriceContact = constructionData.totalPrice;
  const [unitPrice, setUnitPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUltilitiesOption = async () => {
      const data = await getUltilitiesSectionById(Id);
      setSectionData(data);
      if (data?.Items && data.Items.length > 0) {
        const initialCoefficients = data.Items.reduce((acc, item) => {
          acc[item.Id] = item.Coefficient;
          return acc;
        }, {} as {[key: string]: number});
        setCoefficients(initialCoefficients);

        // Get checked items from AsyncStorage
        const savedCheckedItems = await AsyncStorage.getItem(
          'checkedItemsDetailUltilities',
        );
        if (savedCheckedItems) {
          setCheckedItems(JSON.parse(savedCheckedItems));
        } else {
          const firstItemId = data.Items[0].Id;
          setCheckedItems({[firstItemId]: true});
        }

        // Set quantity to 1 if item name matches specific combos
        const firstItemName = data.Items[0].Name;
        if (
          ['Combo Hạch Toán', 'Combo Điện Nước', 'Combo Giấy Phép'].includes(
            firstItemName,
          )
        ) {
          setQuantity('1');
        }
      } else {
        setUnitPrice(data?.UnitPrice || 0);
      }
    };

    fetchUltilitiesOption();
  }, [Id]);

  useEffect(() => {
    // Update coefficient when checkedItems change
    const checkedId = Object.keys(checkedItems).find(id => checkedItems[id]);
    if (checkedId) {
      setCoefficient(coefficients[checkedId]);
    }
  }, [checkedItems, coefficients]);

  const handleCheck = async (id: string) => {
    const newCheckedItems = {...checkedItems};
    Object.keys(newCheckedItems).forEach(key => {
      newCheckedItems[key] = false;
    });
    newCheckedItems[id] = true;
    setCheckedItems(newCheckedItems);
    setCoefficient(coefficients[id]);

    // Save checked items to storage
    await AsyncStorage.setItem(
      'checkedItemsDetailUltilities',
      JSON.stringify(newCheckedItems),
    );
  };

  const handleContinuePress = async () => {
    const totalPrice = sectionData?.Items?.length
      ? totalPriceContact * coefficient
      : quantity && unitPrice
      ? parseFloat(quantity) * unitPrice
      : 0;

    await storage.setItem('totalPrice', totalPrice.toString());

    navigationUltilities.navigate('UltilitiesHouse');

    const selectedItemId = Object.keys(checkedItems).find(
      id => checkedItems[id],
    );
    const checkedItemName = selectedItemId
      ? sectionData?.Items?.find((item: any) => item.Id === selectedItemId)
          ?.Name || null
      : null;

    dispatch(
      pushDetailUltilities({
        id: Id,
        area: quantity,
        name: sectionData?.Name,
        totalPrice: totalPrice,
        checkedItemName: checkedItemName,
        checkedItems: selectedItemId,
      }),
    );
  };

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Tính chi phí xây dựng thô" />
      {sectionData && (
        <View style={styles.bodyContainer}>
          <Text style={styles.titleText}>{sectionData.Name}</Text>

          {sectionData.Items && sectionData.Items.length > 0 ? (
            <>
              {/* Render checkboxes for sections with items */}
              <View style={styles.checkboxGroup}>
                {sectionData.Items.map((item, index) => (
                  <Checkbox
                    key={index}
                    id={item.Id}
                    label={item.Name}
                    isChecked={checkedItems[item.Id]}
                    onCheck={handleCheck}
                  />
                ))}
              </View>
              <Separator />
              <View style={styles.titleGroup}>
                <Text style={styles.title}>Hệ số</Text>
                <Text style={styles.price}>{coefficient}</Text>
              </View>
              <View style={styles.titleGroup}>
                <Text style={styles.title}>Giá trị hợp đồng</Text>
                <Text style={styles.price}>
                  {totalPriceContact.toLocaleString()} VNĐ
                </Text>
              </View>
            </>
          ) : (
            <>
              {[
                'Combo Hạch Toán',
                'Combo Điện Nước',
                'Combo Giấy Phép',
              ].includes(sectionData.Name) ? (
                <>
                  <View style={styles.titleGroup}>
                    <Text style={styles.title}>Số lượng</Text>
                    <Text style={styles.price}>1</Text>
                  </View>
                  <Separator />
                </>
              ) : (
                <InputField
                  placeholder="Nhập số lượng"
                  value={quantity}
                  onChangeText={setQuantity}
                  name=""
                />
              )}
              <View style={styles.titleGroup}>
                <Text style={styles.title}>Đơn giá</Text>
                <Text style={styles.price}>
                  {unitPrice?.toLocaleString()} VNĐ
                </Text>
              </View>
              <View style={styles.titleGroup}>
                <Text style={styles.title}>Số lượng</Text>
                <Text style={styles.price}>{quantity}</Text>
              </View>
            </>
          )}

          <View style={styles.titleGroup}>
            <Text style={styles.title}>Thành tiền</Text>
            <Text style={styles.totalPrice}>
              {(sectionData.Items?.length
                ? totalPriceContact * coefficient
                : quantity && unitPrice
                ? parseFloat(quantity) * unitPrice
                : 0
              ).toLocaleString()}{' '}
              VNĐ
            </Text>
          </View>

          <Separator />
          <View style={styles.titleGroupDescription}>
            <Text style={styles.titleDescription}>Mô tả</Text>
            <Text style={styles.descriptionText}>
              {sectionData.Description}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <CustomButton
          title="Tiếp tục"
          onPress={handleContinuePress}
          colors={['#53A6A8', '#3C9597', '#1F7F81']}
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
  titleText: {
    marginTop: 20,
    marginBottom: 10,
    fontFamily: FONTFAMILY.montserat_bold,
    fontSize: 16,
    color: 'black',
  },
  bodyContainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  checkboxGroup: {
    marginHorizontal: 10,
  },
  titleGroup: {
    marginHorizontal: 10,
    marginTop: 10,
    flexDirection: 'row',
  },
  titleGroupDescription: {
    marginHorizontal: 10,
    marginTop: 10,
    flexDirection: 'column',
  },
  title: {
    fontFamily: FONTFAMILY.montserat_medium,
    color: 'black',
  },
  titleDescription: {
    fontFamily: FONTFAMILY.montserat_bold,
    color: 'black',
  },
  price: {
    fontFamily: FONTFAMILY.montserat_semibold,
    color: 'black',
    position: 'absolute',
    right: 0,
    marginRight: 10,
  },
  totalPrice: {
    fontFamily: FONTFAMILY.montserat_semibold,
    position: 'absolute',
    right: 0,
    marginRight: 10,
    color: 'red',
  },
  descriptionText: {
    fontFamily: FONTFAMILY.montserat_medium,
    marginTop: 10,
    color: 'black',
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 30,
  },
});

export default DetailUltilitiesHouse;
