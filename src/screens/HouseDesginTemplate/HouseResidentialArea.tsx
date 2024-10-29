import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  AppStackNavigationProp,
  AppStackParamList,
} from '../../types/TypeScreen';
import {getHouseTemplateById} from '../../api/HouseTemplate/HouseTemplate';
import AppBar from '../../components/Appbar';
import {FONTFAMILY} from '../../theme/theme';
import CustomButton from '../../components/CustomButton';
import {useDispatch} from 'react-redux';
import {pushSubTemplate} from '../../redux/actions/HouseTemplate/SubTemplate';

const HouseResidentialArea: React.FC = () => {
  const route =
    useRoute<RouteProp<AppStackParamList, 'HouseResidentialArea'>>();
  const {houseId, name} = route.params;

  const dispatch = useDispatch();
  const navigationApp = useNavigation<AppStackNavigationProp>();
  const [subTemplates, setSubTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<{
    id: string;
    url: string;
  } | null>(null);

  useEffect(() => {
    const fetchHouseTemplate = async () => {
      const data = await getHouseTemplateById(houseId);
      setSubTemplates(data.SubTemplates);
      if (data.SubTemplates.length > 0) {
        setCurrentTemplate({
          id: data.SubTemplates[0].Id,
          url: data.SubTemplates[0].Url,
        });
      }
    };
    fetchHouseTemplate();
  }, [houseId]);

  const handleContinue = () => {
    navigationApp.navigate('HousePackageTemplate', {houseId});
    dispatch(pushSubTemplate({subTemplateId: currentTemplate?.id}));
  };

  const handleTemplateSelect = (template: any) => {
    setCurrentTemplate({id: template.Id, url: template.Url});
    console.log('Selected SubTemplate Id:', template.Id);
  };

  return (
    <View style={styles.container}>
      <AppBar nameScreen={name} />
      <View style={styles.content}>
        <View style={styles.ImageSize}>
          {currentTemplate?.url && (
            <Image source={{uri: currentTemplate.url}} style={styles.image} />
          )}
        </View>
        <Text style={styles.sectionTitle}>Diện tích</Text>
        <View style={styles.sizeContainer}>
          {subTemplates.map((template, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.sizeButton,
                currentTemplate?.url === template.Url &&
                  styles.activeSizeButton,
              ]}
              onPress={() => handleTemplateSelect(template)}>
              <Text
                style={[
                  styles.sizeText,
                  currentTemplate?.url === template.Url &&
                    styles.activeSizeText,
                ]}>
                {template.Size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          title="Tiếp tục"
          colors={['#53A6A8', '#3C9597', '#1F7F81']}
          onPress={handleContinue}
          loading={loading}
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  ImageSize: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: FONTFAMILY.montserat_bold,
    color: 'black',
    marginBottom: 15,
  },
  sizeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sizeButton: {
    width: '32%',
    height: 35,
    padding: 6,
    borderWidth: 1.2,
    borderColor: 'black',
    borderRadius: 6,
  },
  activeSizeButton: {
    borderColor: '#53A6A8',
  },
  sizeText: {
    fontFamily: FONTFAMILY.montserat_regular,
    textAlign: 'center',
    fontSize: 14,
    color: 'black',
  },
  activeSizeText: {
    color: '#53A6A8',
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 20,
  },
});

export default HouseResidentialArea;
