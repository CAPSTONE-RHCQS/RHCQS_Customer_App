import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import AppBar from '../../../components/Appbar';
import {AppStackNavigationProp, UltilitiesStackParamList} from '@/types/TypeScreen';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {getUltilitiesSectionById} from '../../../api/Ultilities/Ultilities';
import {Section} from '../../../types/screens/Ultilities/UltilitiesType';
import Checkbox from '../../../components/Checkbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FONTFAMILY} from '../../../theme/theme';
import Separator from '../../../components/Separator';
import { useDispatch, useSelector } from 'react-redux';
import { ContructionSelector } from '../../../redux/selectors/ContructionSelector/ContructionSelector';
import CustomButton from '../../../components/CustomButton';
import storage from '../../../utils/storage';
import { pushSmallArea } from '../../../redux/actions/Ultilities/DetailUltilitiesAction';


const SmallAreaConstructionCost: React.FC = () => {
  // route
  const route =
    useRoute<
      RouteProp<UltilitiesStackParamList, 'SmallAreaConstructionCost'>
    >();
  const navigationUltilities = useNavigation<AppStackNavigationProp>();
  const dispatch = useDispatch();
  const {Id} = route.params;

  const constructionData = useSelector(ContructionSelector);
  console.log('constructionData', constructionData);
  const [sectionData, setSectionData] = useState<Section | null>(null);
  const [coefficients, setCoefficients] = useState<{[key: string]: number}>({});
  const [coefficient, setCoefficient] = useState(0)
  const [checkedItems, setCheckedItems] = useState<{[key: string]: boolean}>(
    {},
  );
  const totalPriceContact = constructionData.totalPrice;
  const totalPriceSmallArea = totalPriceContact * coefficient;
  useEffect(() => {
    const fetchUltilitiesOption = async () => {
      const data = await getUltilitiesSectionById(Id);
      setSectionData(data);
      const initialCoefficients =
        data?.Items?.reduce((acc, item) => {
          acc[item.Id] = item.Coefficient;
          return acc;
        }, {} as {[key: string]: number}) || {};
      setCoefficients(initialCoefficients);

      // Lấy checkedItems từ AsyncStorage
      const savedCheckedItems = await AsyncStorage.getItem(
        'checkedItemsSmallAreaConstructionCost',
      );
      if (savedCheckedItems) {
        const parsedCheckedItems = JSON.parse(savedCheckedItems);
        setCheckedItems(parsedCheckedItems);
      } else if (data?.Items && data.Items.length > 0) {
        const firstItemId = data.Items[0].Id;
        setCheckedItems({[firstItemId]: true});
      }
    };

    fetchUltilitiesOption();
  }, [Id]);

  useEffect(() => {
    // Cập nhật hệ số khi checkedItems thay đổi
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

    // Lưu các mục đã được check vào storage
    await AsyncStorage.setItem(
      'checkedItemsSmallAreaConstructionCost',
      JSON.stringify(newCheckedItems),
    );
  };

  const renderCheckboxOption = () => {
    return sectionData?.Items?.map((item, index) => (
      <Checkbox
        key={index}
        id={item.Id}
        label={item.Name}
        isChecked={checkedItems[item.Id]}
        onCheck={handleCheck}
      />
    ));
  };

  const handleContinuePress = async () => {
    await storage.setItem(
          'totalPriceSmallArea',
            totalPriceSmallArea.toString(),
        );

    navigationUltilities.navigate('UltilitiesScreen');

    const selectedItemId = Object.keys(checkedItems).find(id => checkedItems[id]);
    const checkedItemName = selectedItemId
      ? sectionData?.Items?.find((item: any) => item.Id === selectedItemId)?.Name || null
      : null;

    dispatch(
      pushSmallArea({
        id: Id,
        name: sectionData?.Name,
        totalPrice: totalPriceSmallArea,
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
          <View style={styles.checkboxGroup}>{renderCheckboxOption()}</View>
          <Separator />
          <View style={styles.titleGroup}>
            <Text style={styles.title}>Hệ số</Text>
            <Text style={styles.price}>{coefficient}</Text>
          </View>
          <View style={styles.titleGroup}>
            <Text style={styles.title}>Giá trị hợp đồng</Text>
            <Text style={styles.price}>{totalPriceContact.toLocaleString()} VNĐ</Text>
          </View>
          <View style={styles.titleGroup}>
            <Text style={styles.title}>Thành tiền</Text>
            <Text style={styles.totalPrice}>{totalPriceSmallArea.toLocaleString()} VNĐ</Text>
          </View>
          <Separator />
          <View style={styles.titleGroupDescription}>
            <Text style={styles.title}>Mô tả</Text>
            <Text style={styles.descriptionText}>{sectionData.Description}</Text>
          </View>
        </View>
      )}
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Tiếp tục"
          onPress={handleContinuePress}
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
  titleText: {
    marginTop: 20,
    marginBottom : 10,
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
    marginBottom: 20,
  },
});

export default SmallAreaConstructionCost;
