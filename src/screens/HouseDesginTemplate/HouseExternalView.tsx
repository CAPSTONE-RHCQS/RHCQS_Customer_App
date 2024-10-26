import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {AppStackNavigationProp, AppStackParamList} from '@/types/TypeScreen';
import {getHouseTemplateById} from '../../api/HouseTemplate/HouseTemplate';
import AppBar from '../../components/Appbar';
import Carousel from 'react-native-reanimated-carousel';
import {FONTFAMILY} from '../../theme/theme';
import ExteriorsSlider from '../../components/ExteriorsSlider';
import CustomButton from '../../components/CustomButton';

const {width} = Dimensions.get('window');

const HouseExternalView: React.FC = () => {
  const navigationApp = useNavigation<AppStackNavigationProp>();

  const route = useRoute<RouteProp<AppStackParamList, 'HouseExternalView'>>();
  const {houseId, name} = route.params;
  const [exteriorImages, setExteriorImages] = useState<string[]>([]);
  const [designDrawings, setDesignDrawings] = useState<string[]>([]);
  const [description, setDescription] = useState('');

  useEffect(() => {
    const fetchHouseTemplate = async () => {
      const data = await getHouseTemplateById(houseId);
      console.log('data', houseId);
      setExteriorImages(data.ExteriorsUrls.map((item: any) => item.Url));
      setDesignDrawings(
        data.SubTemplates[0].Designdrawings.map((item: any) => item.Url),
      );
      setDescription(data.Description);
      console.log('description', data.Description);
    };
    fetchHouseTemplate();
  }, [houseId]);

  const renderItem = ({item}: {item: string}) => {
    return <ExteriorsSlider data={{image: {uri: item}}} />;
  };

  return (
    <View style={styles.container}>
      <AppBar nameScreen={name} />
      <View style={styles.contentContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Ngoại cảnh</Text>
        </View>
        <View style={styles.carouselContainer}>
          <Carousel
            data={exteriorImages}
            renderItem={renderItem}
            width={width}
            height={220}
            loop={true}
          />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Bản vẽ</Text>
        </View>
        <View style={styles.carouselContainer}>
          <Carousel
            data={designDrawings}
            renderItem={renderItem}
            width={width}
            height={220}
            loop={true}
          />
        </View>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Ý tưởng thiết kế</Text>
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Tiếp tục"
          colors={['#53A6A8', '#3C9597', '#1F7F81']}
          onPress={() => {
            navigationApp.navigate('HouseResidentialArea', {
              houseId: houseId,
              name: name,
            });
          }}
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
  contentContainer: {
    flex: 1,
  },
  titleContainer: {
    marginTop: 10,
    marginHorizontal: 24,
  },
  title: {
    fontSize: 16,
    fontFamily: FONTFAMILY.montserat_bold,
    color: 'black',
  },
  carouselContainer: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 24,
  },
  descriptionContainer: {
    flex: 1,
    marginHorizontal: 24,
    marginBottom: 20,
  },
  description: {
    marginLeft: 10,
    marginTop: 10,
    fontSize: 13,
    fontFamily: FONTFAMILY.montserat_regular,
    color: 'black',
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 20,
  },
});

export default HouseExternalView;
