import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useRoute, useNavigation, RouteProp} from '@react-navigation/native';
import AppBar from '../../../components/Appbar';
import {FONTFAMILY} from '../../../theme/theme';
import InputField from '../../../components/InputField';
import Checkbox from '../../../components/Checkbox';
import Separator from '../../../components/Separator';
import CustomButton from '../../../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AppStackNavigationProp,
  ConstructionStackParamList,
} from '@/types/TypeScreen';
import {getConstructionByName} from '../../../api/Contruction/Contruction';
import {SubConstructionItem} from '../../../types/screens/Contruction/ContructionType';
import storage from '../../../utils/storage';
import {pushBasement} from '../../../redux/actions/Contruction/DetailContructionAction';
import {useDispatch, useSelector} from 'react-redux';
import {PackageSelector} from '../../../redux/selectors/PackageSelector/PackageSelector';

const Basement: React.FC = () => {
  const navigationContruction = useNavigation<AppStackNavigationProp>();
  const route = useRoute<RouteProp<ConstructionStackParamList, 'Basement'>>();
  const {Name} = route.params;
  const dispatch = useDispatch();

  const [constructionId, setConstructionId] = useState('');
  // State để lưu trữ diện tích móng
  const [areaBasement, setAreaBasement] = useState('');
  // State để lưu trữ trạng thái các mục đã check
  const [checkedItems, setCheckedItems] = useState<{[key: string]: boolean}>(
    {},
  );
  const [coefficients, setCoefficients] = useState<{[key: string]: number}>({});
  const [coefficient, setCoefficient] = useState(0);
  const [constructionData, setConstructionData] = useState<
    SubConstructionItem[]
  >([]);
  const packageData = useSelector(PackageSelector);

  const constructionArea = areaBasement
    ? parseFloat(areaBasement) * coefficient
    : 0;
  const unitPrice = packageData.roughPackagePrice;
  const totalPriceBasement = constructionArea * unitPrice || 0;

  useEffect(() => {
    const loadArea = async () => {
      const savedArea = await storage.getItem('areaBasement');
      if (savedArea) {
        setAreaBasement(savedArea);
      }
    };
    loadArea();
  }, []);

  useEffect(() => {
    const saveArea = async () => {
      await storage.setItem('areaBasement', areaBasement);
    };
    saveArea();
  }, [areaBasement]);

  useEffect(() => {
    const fetchConstructionOption = async () => {
      const data = await getConstructionByName(Name);
      if (data) {
        setConstructionId(data.Id);
        setConstructionData(data.SubConstructionItems || []);
        const initialCoefficients =
          data.SubConstructionItems?.reduce((acc, item) => {
            acc[item.Id] = item.Coefficient;
            return acc;
          }, {} as {[key: string]: number}) || {};
        setCoefficients(initialCoefficients);

        // Kiểm tra xem có checkedItems đã lưu không
        const savedCheckedItems = await AsyncStorage.getItem('checkedItems');
        if (savedCheckedItems) {
          const parsedCheckedItems = JSON.parse(savedCheckedItems);
          setCheckedItems(parsedCheckedItems);

          // Tìm hệ số đầu tiên được check
          const checkedId = Object.keys(parsedCheckedItems).find(
            id => parsedCheckedItems[id],
          );
          if (checkedId) {
            setCoefficient(initialCoefficients[checkedId]);
          }
        } else if (
          data.SubConstructionItems &&
          data.SubConstructionItems.length > 0
        ) {
          // Nếu không có checkedItems đã lưu, chọn checkbox đầu tiên
          const firstItemId = data.SubConstructionItems[0].Id;
          setCheckedItems({[firstItemId]: true});
          setCoefficient(initialCoefficients[firstItemId]);
        }
      } else {
        console.error('No data returned from API');
      }
    };
    fetchConstructionOption();
  }, [Name]);

  useEffect(() => {
    const loadCheckedItems = async () => {
      const savedCheckedItems = await AsyncStorage.getItem('checkedItems');
      if (savedCheckedItems) {
        setCheckedItems(JSON.parse(savedCheckedItems));
      }
    };
    loadCheckedItems();
  }, []);

  const handleCheck = async (id: string) => {
    const newCheckedItems = {...checkedItems};
    Object.keys(newCheckedItems).forEach(key => {
      newCheckedItems[key] = false;
    });
    newCheckedItems[id] = true;
    setCheckedItems(newCheckedItems);
    setCoefficient(coefficients[id]);

    // Lưu các mục đã được check vào storage
    await AsyncStorage.setItem('checkedItems', JSON.stringify(newCheckedItems));
  };

  const handleContinuePress = async () => {
    await storage.setItem('totalPriceBasement', totalPriceBasement.toString());
    await storage.setItem('areaBasement', areaBasement.toString());

    navigationContruction.navigate('ConstructionScreen');


    const selectedItemId = Object.keys(checkedItems).find(id => checkedItems[id]);
    const checkedItemName = selectedItemId
      ? constructionData.find(item => item.Id === selectedItemId)?.Name || null
      : null;

    dispatch(
      pushBasement({
        id: constructionId,
        name: Name,
        totalPrice: totalPriceBasement,
        area: areaBasement,
        checkedItemName: checkedItemName,
        checkedItems: selectedItemId,
        coefficient: coefficient,
      }),
    );
  };

  const renderCheckboxOption = () => {
    return constructionData.map(
      (option: SubConstructionItem, index: number) => {
        return (
          <Checkbox
            key={`${option.Id}-${index}`}
            id={option.Id}
            label={option.Name}
            isChecked={!!checkedItems[option.Id]}
            onCheck={handleCheck}
          />
        );
      },
    );
  };

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Tính chi phí xây dựng thô" />
      <Text style={styles.titleText}>{Name}</Text>
      <View style={styles.bodyContainer}>
        <InputField
          name=""
          value={areaBasement}
          onChangeText={setAreaBasement}
          placeholder="Nhập diện tích"
          keyboardType="numeric"
        />
        <Separator />
        <View style={styles.checkboxGroup}>{renderCheckboxOption()}</View>
        <Separator />
        <View>
          <View style={styles.titleGroup}>
            <Text style={styles.title}>Hệ số</Text>
            <Text style={styles.price}>{coefficient}</Text>
          </View>
          <View style={styles.titleGroup}>
            <Text style={styles.title}>Diện tích xây dựng</Text>
            <Text style={styles.price}>{constructionArea.toFixed(2)} m²</Text>
          </View>
          <View style={styles.titleGroup}>
            <Text style={styles.title}>Đơn giá</Text>
            <Text style={styles.price}>
              {unitPrice.toLocaleString()} VNĐ/m²
            </Text>
          </View>
          <Separator />
          <View style={styles.titleGroup}>
            <Text style={styles.title}>Thành tiền</Text>
            <Text style={styles.total}>
              {totalPriceBasement.toLocaleString()} VNĐ
            </Text>
          </View>
        </View>
      </View>
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
    marginHorizontal: 20,
    marginTop: 20,
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
  title: {
    fontFamily: FONTFAMILY.montserat_medium,
  },
  price: {
    fontFamily: FONTFAMILY.montserat_semibold,
    position: 'absolute',
    right: 0,
    marginRight: 10,
  },
  total: {
    fontFamily: FONTFAMILY.montserat_semibold,
    position: 'absolute',
    right: 0,
    marginRight: 10,
    color: 'red',
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 20,
  },
});

export default Basement;
