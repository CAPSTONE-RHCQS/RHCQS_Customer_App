import {FONTFAMILY} from '../../theme/theme';
import AppBar from '../../components/Appbar';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Ultilities from '../../components/Ultilities';
import Separator from '../../components/Separator';
import {
  getAllUltilities,
  getRoughUltilities,
  getFinishedUltilities,
} from '../../api/Ultilities/Ultilities';
import {Ultilities as UltilitiesType} from '../../types/screens/Ultilities/UltilitiesType';
import {ScrollView} from 'react-native-gesture-handler';
import CustomButton from '../../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PackageSelector} from '../../redux/selectors/PackageSelector/PackageSelector';
import {useSelector} from 'react-redux';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import {UltilitiesScreenMap} from '../../types/screens/Ultilities/UltilitiesScreenMap';
import {AppStackNavigationProp, UltilitiesStackParamList} from '../../types/TypeScreen';

const UltilitiesScreen: React.FC = () => {
  const navigationApp = useNavigation<AppStackNavigationProp>();
  // State để lưu trữ ID các mục đã check
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  // State để lưu trữ dữ liệu các mục tiện ích
  const [ultilities, setUltilities] = useState<UltilitiesType[]>([]);

  const packageData = useSelector(PackageSelector);

  useEffect(() => {
    const fetchUltilities = async () => {
      const selectedRoughType = packageData.selectedRoughType;
      const selectedCompleteType = packageData.selectedCompleteType;

      switch (true) {
        case selectedRoughType === 'ROUGH' &&
          selectedCompleteType === 'FINISHED':
          const allData = await getAllUltilities();
          setUltilities(allData);
          break;
        case selectedRoughType === 'ROUGH' &&
          selectedCompleteType === undefined:
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

    fetchUltilities();
  }, []);



  const handleDetailPress = (Id: string) => {
    const screenId = UltilitiesScreenMap[Id];
    if (screenId) {
      navigationApp.navigate('UltilitiesStack', {
        screen: 'NarrowAlleyConstructionCost',
        params: {Id: '8d94e702-1a40-4316-815c-1668ab01d7d6'},
      });
    } else {
      console.warn('Không tìm thấy hạn mục:', Id);
    }
  };

  const handleCheckBoxPress = (id: string) => {
    console.log('Checkbox pressed for:', id);
  };

  const handleContinuePress = () => {};

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Tính chi phí xây dựng thô" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.titleText}>Tùy chọn & tiện ích</Text>

        <View style={styles.body}>
          {ultilities.map(utility => (
            <Ultilities
              key={utility.Id}
              title={utility.Name}
              ultilities={utility.Sections.map(section => ({
                id: section.Id,
                title: section.Name,
                price: '100,000,000',
                area: '0',
                unit: '',
                isChecked: false,
              }))}
              onDetailPress={handleDetailPress}
              onCheckBoxPress={handleCheckBoxPress}
            />
          ))}
        </View>
      </ScrollView>
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
  buttonContainer: {
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 20,
  },
});

export default UltilitiesScreen;
