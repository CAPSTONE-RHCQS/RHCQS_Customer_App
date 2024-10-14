import React, {useEffect, useState} from 'react';
import {Text, View, ActivityIndicator, StyleSheet} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import AppBar from '../../../../components/Appbar';
import {
  AppStackNavigationProp,
  ConstructionStackParamList,
} from '@/types/TypeScreen';
import {getConstructionByName} from '../../../../api/Contruction/Contruction';
import {SubConstructionItem} from '@/types/screens/Contruction/ContructionType';
import {FONTFAMILY} from '../../../../theme/theme';
import Separator from '../../../../components/Separator';
import InputField from '../../../../components/InputField';
import CustomButton from '../../../../components/CustomButton';
import storage from '../../../../utils/storage';

const SecondFloor: React.FC = () => {
  const navigationContruction = useNavigation<AppStackNavigationProp>();
  const route =
    useRoute<RouteProp<ConstructionStackParamList, 'SecondFloor'>>();
  const {Name} = route.params;

  const [areaSecondFloor, setAreaSecondFloor] = useState('');
  const [constructionData, setConstructionData] =
    useState<SubConstructionItem | null>(null);
  const [coefficient, setCoefficient] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [roughPackagePrice, setRoughPackagePrice] = useState<number>(0);

  const constructionArea = areaSecondFloor
    ? Number(areaSecondFloor) * coefficient
    : 0;
  const unitPrice = roughPackagePrice;
  const totalPriceSecondFloor = constructionArea * unitPrice || 0;

  useEffect(() => {
    const loadArea = async () => {
      const savedArea = await storage.getItem('areaPIT');
      if (savedArea) {
        setAreaSecondFloor(savedArea);
      }
    };
    loadArea();
  }, []);

  useEffect(() => {
    const saveArea = async () => {
      await storage.setItem('areaSecondFloor', areaSecondFloor);
    };
    saveArea();
  }, [areaSecondFloor]);

  useEffect(() => {
    const loadRoughPackagePrice = async () => {
      const price = await storage.getItem('roughPackagePrice');
      if (price) {
        setRoughPackagePrice(parseFloat(price));
      }
    };
    loadRoughPackagePrice();
  }, []);

  useEffect(() => {
    const fetchConstructionData = async () => {
      try {
        const data = await getConstructionByName(Name);
        setConstructionData(data);
        if (data && data.Coefficient) {
          setCoefficient(data.Coefficient);
        }
      } catch (err) {
        setError('Error fetching construction data.');
      }
    };

    fetchConstructionData();
  }, [Name]);

  const handleContinuePress = async () => {
    // Lưu giá trị vào AsyncStorage
    await storage.setItem(
      'totalPriceSecondFloor',
      totalPriceSecondFloor.toString(),
    );
    await storage.setItem('areaSecondFloor', areaSecondFloor.toString());

    navigationContruction.navigate('ConstructionScreen', {
      totalPriceSecondFloor,
      areaSecondFloor: Number(areaSecondFloor),
      source: 'Lầu 2',
    });
  };

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Tính chi phí xây dựng thô" />
      <Text style={styles.titleText}>{Name}</Text>
      <View style={styles.bodyContainer}>
        <InputField
          name=""
          value={areaSecondFloor}
          onChangeText={setAreaSecondFloor}
          placeholder="Nhập diện tích"
          keyboardType="numeric"
        />
        <Separator />
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
          <Text style={styles.price}>{unitPrice.toLocaleString()} VNĐ/m²</Text>
        </View>
        <Separator />
        <View style={styles.titleGroup}>
          <Text style={styles.title}>Thành tiền</Text>
          <Text style={styles.total}>
            {totalPriceSecondFloor.toLocaleString()} VNĐ
          </Text>
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

export default SecondFloor;
