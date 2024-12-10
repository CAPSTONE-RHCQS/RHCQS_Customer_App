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
import {getConstructionById} from '../../../api/Contruction/Contruction';
import {SubConstructionItem} from '../../../types/screens/Contruction/ContructionType';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Checkbox from '../../../components/Checkbox';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';
import {pushDetailConstruction} from '../../../redux/actions/Contruction/DetailContructionAction';
import {PackageSelector} from '../../../redux/selectors/PackageSelector/PackageSelector';
import {DetailContructionSelector} from '../../../redux/selectors/ContructionSelector/DetailContructionSelector/DetailContructionSelector';
import {ScrollView} from 'react-native-gesture-handler';

const DetailContruction: React.FC = () => {
  const route = useRoute<RouteProp<AppStackParamList, 'DetailContruction'>>();
  const {Id} = route.params;
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
  const [checkedItemName, setCheckedItemName] = useState('');
  const roughPackagePrice = packageData.roughPackagePrice;
  const completePackagePrice = packageData.completePackagePrice;
  const roughPackageName = packageData.roughPackageName;
  const completePackageName = packageData.completePackageName;
  const hasSubConstructionItems = constructionData.length > 0;
  const constructionArea =
    isNaN(parseFloat(area)) || isNaN(coefficient)
      ? 0
      : parseFloat(area) * coefficient;
  const unitPrice = hasSubConstructionItems
    ? roughPackagePrice
    : roughPackagePrice;
  const unitCompletePrice = hasSubConstructionItems
    ? completePackagePrice
    : completePackagePrice;
  const totalRoughPrice = constructionArea * roughPackagePrice || 0;
  const totalCompletePrice = constructionArea * completePackagePrice || 0;
  const totalPrice = totalRoughPrice + totalCompletePrice;

  useEffect(() => {
    const fetchConstructionOption = async () => {
      const data = await getConstructionById(Id);
      if (data) {
        setConstructionId(data.Id);
        setCheckedItemName(data.Name);
        setConstructionData(data.SubConstructionItems || []);
        if (data.SubConstructionItems && data.SubConstructionItems.length > 0) {
          const initialCoefficients = data.SubConstructionItems.reduce(
            (acc, item) => {
              acc[item.Id] = item.Coefficient;
              return acc;
            },
            {} as {[key: string]: number},
          );
          setCoefficients(initialCoefficients);

          const savedCheckedItems = await AsyncStorage.getItem(
            `checkedItems_${Id}`,
          );
          if (savedCheckedItems) {
            const parsedCheckedItems = JSON.parse(savedCheckedItems);
            setCheckedItems(parsedCheckedItems);

            const checkedId = Object.keys(parsedCheckedItems).find(
              id => parsedCheckedItems[id],
            );
            if (checkedId) {
              setCoefficient(initialCoefficients[checkedId]);
            }
          } else {
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

    const restoreData = async () => {
      const existingData = detailConstructionData.find(
        (item: any) => item.id === Id,
      );
      if (existingData) {
        setArea(existingData.area);
        setCheckedItems({[existingData.checkedItems]: true});
        setCoefficient(existingData.coefficient);
      } else {
        const storedArea = await AsyncStorage.getItem('constructionArea');
        if (storedArea) {
          setArea(storedArea);
        }
      }
    };

    fetchConstructionOption();
    restoreData();
  }, [Id, detailConstructionData]);

  const handleContinuePress = async () => {
    await AsyncStorage.setItem('totalRoughPrice', totalRoughPrice.toString());
    await AsyncStorage.setItem(
      'totalCompletePrice',
      totalCompletePrice.toString(),
    );
    await AsyncStorage.setItem('area', area.toString());

    navigationContruction.navigate('ConstructionScreen');

    const selectedItemId = Object.keys(checkedItems).find(
      id => checkedItems[id],
    );
    const checkedItemName = selectedItemId
      ? constructionData.find(item => item.Id === selectedItemId)?.Name || null
      : null;

    const totalPriceToDispatch = roughPackageName
      ? totalRoughPrice
      : completePackageName
      ? totalCompletePrice
      : totalPrice;

    dispatch(
      pushDetailConstruction({
        id: constructionId,
        name: checkedItemName,
        totalPrice: totalPriceToDispatch,
        area: area,
        areaBuilding: constructionArea.toFixed(0),
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

    await AsyncStorage.setItem(
      `checkedItems_${Id}`,
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

  const isContinueDisabled = hasSubConstructionItems
    ? !Object.values(checkedItems).some(isChecked => isChecked) || !area
    : !area;

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Tính chi phí xây dựng thô" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.bodyContainer}>
        <View style={styles.noteContainer}>
          <Text style={styles.titleText}>{checkedItemName}</Text>
          <Text style={styles.noteText}> *</Text>
        </View>
        <InputField
          name=""
          value={area}
          onChangeText={setArea}
          placeholder="Nhập diện tích"
          keyboardType="numeric"
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
          <Text style={styles.price}>{constructionArea.toFixed(0)} m²</Text>
        </View>
        {roughPackageName && (
          <>
            <Separator />
            <View style={styles.titleGroup}>
              <Text style={styles.title}>Đơn giá thô</Text>
              <Text style={styles.price}>
                {unitPrice.toLocaleString()} VNĐ/m²
              </Text>
            </View>
            <View style={styles.titleGroup}>
              <Text style={styles.title}>Thành tiền thô</Text>
              <Text
                style={
                  roughPackageName && !completePackageName
                    ? styles.total
                    : styles.totalPrice
                }>
                {totalRoughPrice.toLocaleString()} VNĐ
              </Text>
            </View>
          </>
        )}
        {completePackageName && (
          <>
            <Separator />
            <View style={styles.titleGroup}>
              <Text style={styles.title}>Đơn giá hoàn thiện</Text>
              <Text style={styles.price}>
                {unitCompletePrice.toLocaleString()} VNĐ/m²
              </Text>
            </View>
            <View style={styles.titleGroup}>
              <Text style={styles.title}>Thành tiền hoàn thiện</Text>
              <Text
                style={
                  completePackageName && !roughPackageName
                    ? styles.total
                    : styles.totalPrice
                }>
                {totalCompletePrice.toLocaleString()} VNĐ
              </Text>
            </View>
          </>
        )}
        {roughPackageName && completePackageName && (
          <>
            <Separator />
            <View style={styles.titleGroup}>
              <Text style={styles.title}>Thành tiền</Text>
              <Text style={styles.total}>
                {totalPrice.toLocaleString()} VNĐ
              </Text>
            </View>
          </>
        )}
      </ScrollView>
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
    fontFamily: FONTFAMILY.montserat_bold,
    fontSize: 16,
    color: 'black',
  },
  noteContainer: {
    flexDirection: 'row',
  },
  noteText: {
    marginTop: 20,
    fontFamily: FONTFAMILY.montserat_bold,
    fontSize: 16,
    color: 'red',
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
  totalPrice: {
    fontFamily: FONTFAMILY.montserat_semibold,
    position: 'absolute',
    right: 0,
    marginRight: 10,
    color: '#1F7F81',
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 20,
  },
});

export default DetailContruction;
