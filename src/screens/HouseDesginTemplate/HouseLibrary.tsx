import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppBar from '../../components/Appbar';
import {getHouseTemplate} from '../../api/HouseTemplate/HouseTemplate';
import {HouseTemplate} from '../../types/screens/HouseTemplate/HouseTemplateType';
import {useNavigation} from '@react-navigation/native';
import {AppStackNavigationProp} from '../../types/TypeScreen';

const HouseLibrary: React.FC = () => {
  const [images, setImages] = useState<HouseTemplate[]>([]);
  const navigationApp = useNavigation<AppStackNavigationProp>();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await getHouseTemplate();
        const templates = response || [];
        setImages(Array.isArray(templates) ? templates : []);
      } catch (error) {
        console.error('Error fetching templates:', error);
        setImages([]);
      }
    };

    fetchTemplates();
  }, []);

  const handleImagePress = (item: HouseTemplate) => {
    navigationApp.navigate('HouseExternalView', {
      houseId: item.Id,
      name: item.Name,
    });
  };

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Thư viện mẫu nhà" />
      <View style={styles.flatListContent}>
        <FlatList
          data={images}
          numColumns={2}
          keyExtractor={(item) => item.Id}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.image}
              onPress={() => handleImagePress(item)}>
              <Image source={{uri: item.ImgUrl}} style={styles.image} />
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.flatListContent}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  flatListContent: {
    flex: 1,
    position: 'relative',
    marginVertical: '1%',
    marginHorizontal: '0.3%',
  },
  image: {
    flex: 1,
    width: '100%',
    height: 150,
    marginTop: '1%',
    marginHorizontal: '1%',
    borderRadius: 10,
  },
});

export default HouseLibrary;
