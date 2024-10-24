import {View, Text, Image, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import AppBar from '../../components/Appbar';
import {getHouseTemplate} from '../../api/HouseTemplate/HouseTemplate';
import {Item} from '../../types/screens/HouseTemplate/HouseTemplateType';

const HouseLibrary: React.FC = () => {
  const [images, setImages] = useState<Item[]>([]);

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

  const handleImagePress = (item: Item) => {
    console.log('Image pressed:', item);
  };

  return (
    <View style={styles.container}>
      <AppBar nameScreen="Thư viện mẫu nhà" />
      <View style={styles.flatListContent}> 
        <FlatList
          data={images}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity onPress={() => handleImagePress(item)}>
            <Image
              source={{uri: item.ImgUrl}}
              style={styles.image}
            />
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
    paddingHorizontal: 8,
    paddingVertical: 10,
  },
  image: {
    flex: 1,
    width: '48%',
    height: 200,
    margin: '1%',
    borderRadius: 10,
  },
});

export default HouseLibrary;
