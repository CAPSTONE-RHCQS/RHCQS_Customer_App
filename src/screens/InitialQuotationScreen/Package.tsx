import {View, Text, StyleSheet, Button, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {getPackages} from '../../api/Package/Package';
import Checkbox from '../../components/Checkbox';
import {FONTFAMILY} from '../../theme/theme';
import AppBar from '../../components/Appbar';
import CustomButton from '../../components/CustomButton';
import Separator from '../../components/Separator';
import {AppStackNavigationProp} from '../../types/TypeScreen';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Package: React.FC = () => {
  const navigationApp = useNavigation<AppStackNavigationProp>();

  const [packages, setPackages] = useState<
    {Id: string; PackageName: string; Price: number}[]
  >([]);
  const [selectedRough, setSelectedRough] = useState<string | null>(null);
  const [selectedComplete, setSelectedComplete] = useState<string | null>(null);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const cachedData = await AsyncStorage.getItem('packages');
        if (cachedData) {
          console.log('Using cached package data');
          setPackages(JSON.parse(cachedData));
        } else {
          const data = await getPackages();
          setPackages(data);
          await AsyncStorage.setItem('packages', JSON.stringify(data));
        }
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    fetchPackages();
  }, []);

  const handleRoughCheck = (id: string) => {
    setSelectedRough(id);
  };

  const handleCompleteCheck = (id: string) => {
    setSelectedComplete(prev => (prev === id ? null : id));
  };

  const handleNext = async () => {
    if (!selectedRough && !selectedComplete) {
      Alert.alert('Thông báo', 'Bạn phải chọn ít nhất một gói.');
      return;
    }

    const roughPackagePrice =
      packages.find(pkg => pkg.PackageName === selectedRough)?.Price || 0;
    const completePackagePrice =
      packages.find(pkg => pkg.PackageName === selectedComplete)?.Price || 0;

    await AsyncStorage.setItem('selectedRough', selectedRough || '');
    await AsyncStorage.setItem('selectedComplete', selectedComplete || '');
    await AsyncStorage.setItem(
      'roughPackagePrice',
      roughPackagePrice.toString(),
    );
    await AsyncStorage.setItem(
      'completePackagePrice',
      completePackagePrice.toString(),
    );

    navigationApp.navigate('ConstructionScreen', {
      selectedRough: selectedRough || '',
      selectedComplete: selectedComplete || '',
      roughPackagePrice,
      completePackagePrice,
    });
  };

  const renderRoughPackages = () => {
    return packages
      .filter(pkg => pkg.PackageName.includes('Gói thô'))
      .map(pkg => (
        <>
          <Checkbox
            key={pkg.Id}
            id={pkg.PackageName}
            label={`${pkg.PackageName} - ${pkg.Price.toLocaleString()} VND`}
            isChecked={selectedRough === pkg.PackageName}
            onCheck={handleRoughCheck}
          />
          <Separator />
        </>
      ));
  };

  const renderCompletePackages = () => {
    return packages
      .filter(pkg => pkg.PackageName.includes('Gói hoàn thiện'))
      .map(pkg => (
        <>
          <Checkbox
            key={pkg.Id}
            id={pkg.PackageName}
            label={`${pkg.PackageName} - ${pkg.Price.toLocaleString()} VND`}
            isChecked={selectedComplete === pkg.PackageName}
            onCheck={handleCompleteCheck}
          />
          <Separator />
        </>
      ));
  };

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Chọn gói thi công" />
      <View style={styles.packageContainer}>
        <View>
          <Text style={styles.sectionTitle}>Gói thô</Text>
          {renderRoughPackages()}
        </View>
        <View>
          <Text style={styles.sectionTitle2}>Gói hoàn thiện</Text>
          {renderCompletePackages()}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Tiếp tục"
          onPress={handleNext}
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
  packageContainer: {
    marginVertical: 14,
    marginHorizontal: 20,
    flex: 1,
  },
  sectionTitle: {
    fontFamily: FONTFAMILY.montserat_bold,
    fontSize: 20,
    color: 'black',
    marginVertical: 10,
  },
  sectionTitle2: {
    marginTop: 40,
    fontFamily: FONTFAMILY.montserat_bold,
    fontSize: 20,
    color: 'black',
    marginVertical: 10,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 20,
  },
});

export default Package;
