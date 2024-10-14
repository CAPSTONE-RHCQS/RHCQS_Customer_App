import {FONTFAMILY} from '../../theme/theme';
import AppBar from '../../components/Appbar';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Ultilities from '../../components/Ultilities';
import Separator from '../../components/Separator';
import {getUltilities} from '../../api/Ultilities/Ultilities';
import {Ultilities as UltilitiesType} from '../../types/screens/Ultilities/UltilitiesType';
import {ScrollView} from 'react-native-gesture-handler';
import CustomButton from '../../components/CustomButton';

const UltilitiesScreen: React.FC = () => {
  const [ultilities, setUltilities] = useState<UltilitiesType[]>([]);

  const handleContinuePress = () => {};

  useEffect(() => {
    const fetchUltilities = async () => {
      const data = await getUltilities();
      setUltilities(data);
    };

    fetchUltilities();
  }, []);

  const handleDetailPress = (id: string) => {
    console.log('Detail pressed for:', id);
  };

  const handleCheckBoxPress = (id: string) => {
    console.log('Checkbox pressed for:', id);
  };

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
