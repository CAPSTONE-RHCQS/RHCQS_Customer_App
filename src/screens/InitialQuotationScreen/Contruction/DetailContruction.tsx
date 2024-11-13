import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';
import {RouteProp} from '@react-navigation/native';
import {AppStackParamList} from '../../../types/TypeScreen';
import {FONTFAMILY} from '../../../theme/theme';
import AppBar from '../../../components/Appbar';
import InputField from '../../../components/InputField';
import Separator from '../../../components/Separator';
import CustomButton from '../../../components/CustomButton';
import {getConstructionByName} from '../../../api/Contruction/Contruction';
import {SubConstructionItem} from '../../../types/screens/Contruction/ContructionType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from '../../../components/Checkbox';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {pushDetailConstruction} from '../../../redux/actions/Contruction/DetailContructionAction';
import {PackageSelector} from '../../../redux/selectors/PackageSelector/PackageSelector';
import {DetailContructionSelector} from '../../../redux/selectors/ContructionSelector/DetailContructionSelector/DetailContructionSelector';

const DetailContruction: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'DetailContruction'>>();
  const {Name} = route.params;
  const navigationContruction =
    useNavigation<NativeStackNavigationProp<AppStackParamList>>();
  const dispatch = useDispatch();

  const detailConstructionData = useSelector(DetailContructionSelector);
  const packageData = useSelector(PackageSelector);
  const [area, setArea] = useState('');
  const [coefficient, setCoefficient] = useState(0);
  const [constructionData, setConstructionData] = useState<
    SubConstructionItem[]
  >([]);
  const [coefficients, setCoefficients] = useState<{[key: string]: number}>({});
  const [checkedItems, setCheckedItems] = useState<{[key: string]: boolean}>(
    {},
  );
  const [constructionId, setConstructionId] = useState('');
  const [loading, setLoading] = useState(false);
  const roughPackagePrice = packageData.roughPackagePrice;
  const hasSubConstructionItems = constructionData.length > 0;
  const constructionArea = area ? parseFloat(area) * coefficient : 0;
  const unitPrice = hasSubConstructionItems
    ? roughPackagePrice
    : roughPackagePrice;
  const totalPrice = constructionArea * unitPrice || 0;

  useEffect(() => {
    const fetchConstructionOption = async () => {
      const data = await getConstructionByName(Name);
      if (data) {
        setConstructionId(data.Id);
        setConstructionData(data.SubConstructionItems || []);
        if (data.SubConstructionItems && data.SubConstructionItems.length > 0) {
          // Lấy hệ số của các item
          const initialCoefficients =
            data.SubConstructionItems.reduce((acc, item) => {
              acc[item.Id] = item.Coefficient;
              return acc;
            }, {} as {[key: string]: number}) || {};
          setCoefficients(initialCoefficients);

          // Kiểm tra xem có checkedItems đã lưu không
          const savedCheckedItems = await AsyncStorage.getItem(
            'checkedItemsStereobate',
          );
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
          } else {
            // Nếu không có checkedItems đã lưu, chọn checkbox đầu tiên
            const firstItemId = data.SubConstructionItems[0].Id;
            setCheckedItems({[firstItemId]: true});
            setCoefficient(initialCoefficients[firstItemId]);
          }
        } else {
          setCoefficient(1);
        }
      } else {
        console.error('No data returned from API');
      }
    };

    // Khôi phục dữ liệu từ detailConstructionData
    const restoreData = () => {
      const existingData = detailConstructionData.find(
        (item: any) => item.name === Name,
      );
      if (existingData) {
        setArea(existingData.area);
        setCheckedItems({[existingData.checkedItems]: true});
        setCoefficient(existingData.coefficient);
      }
    };

    fetchConstructionOption();
    restoreData();
  }, [Name, detailConstructionData]);

  const handleContinuePress = async () => {
    await AsyncStorage.setItem('totalPrice', totalPrice.toString());
    await AsyncStorage.setItem('area', area.toString());

    navigationContruction.navigate('ConstructionScreen');

    const selectedItemId = Object.keys(checkedItems).find(
      id => checkedItems[id],
    );
    const checkedItemName = selectedItemId
      ? constructionData.find(item => item.Id === selectedItemId)?.Name || null
      : null;

    dispatch(
      pushDetailConstruction({
        id: constructionId,
        name: Name,
        totalPrice: totalPrice,
        area: area,
        ...(checkedItemName && {checkedItemName}),
        ...(selectedItemId && {checkedItems: selectedItemId}),
        coefficient: coefficient,
      }),
    );
  };

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
      'checkedItemsStereobate',
      JSON.stringify(newCheckedItems),
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

  const formatCurrency = (value: number | undefined): string => {
    return value ? value.toLocaleString() : '0';
  };

  const isContinueDisabled = hasSubConstructionItems
    ? !Object.values(checkedItems).some(isChecked => isChecked) || !area
    : !area;

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Tính chi phí xây dựng thô" />
      <Text style={styles.titleText}>{Name}</Text>
      <View style={styles.bodyContainer}>
        <InputField
          name=""
          value={area}
          onChangeText={setArea}
          placeholder="Nhập diện tích"
          keyboardType="numeric"
          isRequired={true}
        />
        {hasSubConstructionItems && (
          <>
            <Separator />

            <View style={styles.checkboxGroup}>{renderCheckboxOption()}</View>
          </>
        )}
        <Separator />
        <View style={styles.titleGroup}>
          <Text style={styles.title}>Hệ số</Text>
          <Text style={styles.price}>{coefficient}</Text>
        </View>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>Diện tích xây dựng</Text>
          <Text style={styles.price}>{area} m²</Text>
        </View>
        <View style={styles.titleGroup}>
          <Text style={styles.title}>Đơn giá</Text>
          <Text style={styles.price}>{unitPrice.toLocaleString()} VNĐ/m²</Text>
        </View>
        <Separator />
        <View style={styles.titleGroup}>
          <Text style={styles.title}>Thành tiền</Text>
          <Text style={styles.total}>{totalPrice.toLocaleString()} VNĐ</Text>
        </View>
      </View>
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
    color: 'black',
  },
  price: {
    fontFamily: FONTFAMILY.montserat_semibold,
    position: 'absolute',
    right: 0,
    marginRight: 10,
    color: 'black',
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

export default DetailContruction;
