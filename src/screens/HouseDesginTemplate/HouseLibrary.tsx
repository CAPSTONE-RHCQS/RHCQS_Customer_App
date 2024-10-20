import {View, Text, Image} from 'react-native';
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
        // Đảm bảo response có thuộc tính Items và nó là một mảng
        const templates = response.Items || [];
        setImages(Array.isArray(templates) ? templates : []);
      } catch (error) {
        console.error('Error fetching templates:', error);
        setImages([]); 
      }
    };

    fetchTemplates();
  }, []);

  return (
    <View>
      <AppBar nameScreen="Thư viện mẫu nhà" />
      {images.map((image, index) => (
        <Image
          key={index}
          source={{ uri: image.ImgUrl }}
          style={{width: 100, height: 100}}
        />
      ))}
    </View>
  );
};

export default HouseLibrary;