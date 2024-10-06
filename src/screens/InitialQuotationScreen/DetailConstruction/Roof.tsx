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

const Roof: React.FC = () => {
  const navigationContruction = useNavigation<AppStackNavigationProp>();
  const route = useRoute<RouteProp<ConstructionStackParamList, 'Roof'>>();
  const {Name} = route.params;

  const [area, setArea] = useState('');
  const [checkedItems, setCheckedItems] = useState<{[key: string]: boolean}>(
    {},
  );
  const [coefficients, setCoefficients] = useState<{[key: string]: number}>({});
  const [coefficient, setCoefficient] = useState(0);
  const [constructionData, setConstructionData] = useState<
    SubConstructionItem[]
  >([]);

  

  const constructionArea = area ? parseFloat(area) * coefficient : 0;
  const unitPrice = 200000;
  const totalPrice = constructionArea * unitPrice || 0;

  useEffect(() => {
    const loadArea = async () => {
      const savedArea = await AsyncStorage.getItem('area');
      if (savedArea) {
        setArea(savedArea);
      }
    };
    loadArea();
  }, []);

  useEffect(() => {
    const saveArea = async () => {
      await AsyncStorage.setItem('area', area);
    };
    saveArea();
  }, [area]);

  useEffect(() => {
    const fetchConstructionOption = async () => {
      const data = await getConstructionByName(Name);
      if (data) {
        setConstructionData(data.SubConstructionItems || []);
        const initialCoefficients =
          data.SubConstructionItems?.reduce((acc, item) => {
            acc[item.Id] = item.Coefficient;
            return acc;
          }, {} as {[key: string]: number}) || {};
        setCoefficients(initialCoefficients);
      } else {
        console.error('No data returned from API');
      }
    };
    fetchConstructionOption();
  }, [Name]);

  const handleCheck = (id: string) => {
    const newCheckedItems = {...checkedItems};
    Object.keys(newCheckedItems).forEach(key => {
      newCheckedItems[key] = false;
    });
    newCheckedItems[id] = true;
    setCheckedItems(newCheckedItems);
    setCoefficient(coefficients[id]);
  };

  const handleContinuePress = () => {
    navigationContruction.navigate('ConstructionScreen', {totalPrice, area});
  };

  const renderCheckboxOption = () => {
    return constructionData.map((option: SubConstructionItem) => {
      return (
        <Checkbox
          key={option.Id}
          id={option.Id}
          label={option.Name}
          isChecked={!!checkedItems[option.Id]}
          onCheck={handleCheck}
        />
      );
    });
  };

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
            <Text style={styles.total}>{totalPrice.toLocaleString()} VNĐ</Text>
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

export default Roof;
