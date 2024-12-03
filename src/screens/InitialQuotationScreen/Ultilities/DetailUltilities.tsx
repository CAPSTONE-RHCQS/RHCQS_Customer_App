import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AppBar from '../../../components/Appbar';
import {AppStackNavigationProp, AppStackParamList} from '@/types/TypeScreen';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {getUltilitiesSectionById} from '../../../api/Ultilities/Ultilities';
import {Section} from '../../../types/screens/Ultilities/UltilitiesType';
import Checkbox from '../../../components/Checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FONTFAMILY} from '../../../theme/theme';
import Separator from '../../../components/Separator';
import {useDispatch, useSelector} from 'react-redux';
import {ContructionSelector} from '../../../redux/selectors/ContructionSelector/ContructionSelector';
import CustomButton from '../../../components/CustomButton';
import storage from '../../../utils/storage';
import {pushDetailUltilities} from '../../../redux/actions/Ultilities/DetailUltilitiesAction';
import InputField from '../../../components/InputField';
import {DetailUltilitiesSelector} from '../../../redux/selectors/UltilitiesSelector/DetailUltilitiesSelector/DetailUltilitiesSelector';

const DetailUltilities: React.FC = () => {
  // route
  const route = useRoute<RouteProp<AppStackParamList, 'DetailUltilities'>>();
  const navigationUltilities = useNavigation<AppStackNavigationProp>();
  const dispatch = useDispatch();
  const {Id} = route.params;

  const constructionData = useSelector(ContructionSelector);
  const detailUltilitiesData = useSelector(DetailUltilitiesSelector);
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

        // Kiểm tra trong detailUltilitiesData
        const existingItem = detailUltilitiesData.find(
          (item: any) => item.id === Id,
        );

        if (existingItem) {
          setCheckedItems({[existingItem.checkedItems]: true});
          setCoefficient(initialCoefficients[existingItem.checkedItems]);
        } else {
          const firstItemId = data.Items[0].Id;
          setCheckedItems({[firstItemId]: true});
          setCoefficient(initialCoefficients[firstItemId]);
        }
      } else {
        setUnitPrice(data?.UnitPrice || 0);
      }
    };

    fetchUltilitiesOption();
  }, [Id, detailUltilitiesData]);

  useEffect(() => {
    // Update coefficient when checkedItems change
    const checkedId = Object.keys(checkedItems).find(id => checkedItems[id]);
    if (checkedId) {
      setCoefficient(coefficients[checkedId]);
    }
  }, [checkedItems, coefficients]);

  const handleCheck = (id: string) => {
    const newCheckedItems = {...checkedItems};
    Object.keys(newCheckedItems).forEach(key => {
      newCheckedItems[key] = false;
    });
    newCheckedItems[id] = true;
    setCheckedItems(newCheckedItems);
    setCoefficient(coefficients[id]);
  };

  const handleContinuePress = async () => {
    const totalPrice = sectionData?.Items?.length
      ? totalPriceContact * coefficient
      : quantity && unitPrice
      ? parseFloat(quantity) * unitPrice
      : 0;

    await storage.setItem('totalPrice', totalPrice.toString());

    navigationUltilities.navigate('UltilitiesScreen');

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

  const isContinueDisabled = sectionData?.Items?.length
    ? !Object.values(checkedItems).some(isChecked => isChecked)
    : !quantity;

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
                'Chi phí bản vẽ hoàn công',
                'Combo Hạch Toán',
                'Combo giấy phép',
                'Chi phí bản vẽ xin phép xây dựng',
              ].includes(sectionData.Name) ? (
                <>
                  <Text style={styles.fixedQuantityText}>Số lượng: 1</Text>
                  <Separator />
                </>
              ) : (
                <InputField
                  placeholder="Nhập diện tích"
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
          colors={
            isContinueDisabled
              ? ['#d3d3d3', '#d3d3d3', '#d3d3d3']
              : ['#53A6A8', '#3C9597', '#1F7F81']
          }
          loading={loading}
          disabled={isContinueDisabled}
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
  },
  titleDescription: {
    fontFamily: FONTFAMILY.montserat_bold,
    color: 'black',
  },
  price: {
    fontFamily: FONTFAMILY.montserat_semibold,
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
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 30,
  },
  fixedQuantityText: {
    fontFamily: FONTFAMILY.montserat_medium,
    marginTop: 10,
    marginHorizontal: 10,
    color: 'black',
  },
});

export default DetailUltilities;
