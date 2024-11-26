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
import {ScrollView} from 'react-native-gesture-handler';

const HouseResidentialArea: React.FC = () => {
  const route =
    useRoute<RouteProp<AppStackParamList, 'HouseResidentialArea'>>();
  const {houseId, name} = route.params;

  const dispatch = useDispatch();
  const navigationApp = useNavigation<AppStackNavigationProp>();
  const [subTemplates, setSubTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTemplate, setCurrentTemplate] = useState<{
    id: string;
    url: string;
    totalRough: number;
  } | null>(null);

  useEffect(() => {
    const fetchHouseTemplate = async () => {
      try {
        const data = await getHouseTemplateById(houseId);
        setSubTemplates(data.SubTemplates);
        console.log(
          'data.SubTemplates',
          JSON.stringify(data.SubTemplates, null, 2),
        );
        if (data.SubTemplates.length > 0) {
          setCurrentTemplate({
            id: data.SubTemplates[0].Id,
            url: data.SubTemplates[0].Url,
            totalRough: data.SubTemplates[0].TotalRough,
          });
        }
      } catch (error) {
        console.error('Error fetching house template:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHouseTemplate();
  }, [houseId]);

  const handleContinue = () => {
    if (currentTemplate) {
      navigationApp.navigate('HousePackageTemplate', {houseId});
      dispatch(
        pushSubTemplate({
          subTemplateId: currentTemplate.id,
          totalRough: currentTemplate.totalRough,
        }),
      );
    }
  };

  const handleTemplateSelect = (template: any) => {
    setCurrentTemplate({
      id: template.Id,
      url: template.Url,
      totalRough: template.TotalRough,
    });
    console.log('Selected SubTemplate Id:', template.Id);
  };

  const renderTemplateDetails = () => {
    if (!currentTemplate) return null;

    const selectedTemplate = subTemplates.find(
      template => template.Id === currentTemplate.id,
    );

    if (!selectedTemplate) return null;

    return (
      <View style={styles.table}>
        <Text style={styles.sectionTitle}>Thông số</Text>
        <View style={styles.tableContainer}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Tên</Text>
            <Text style={styles.tableHeader}>Hệ số</Text>
            <Text style={styles.tableHeader}>Diện tích</Text>
            <Text style={styles.tableHeader}>Giá</Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {selectedTemplate.TemplateItems.map((item: any, index: number) => (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.Name}</Text>
                <Text style={styles.tableCell}>{item.Coefficient}</Text>
                <Text style={styles.tableCell}>{item.Area}</Text>
                <Text style={[styles.tableCell, styles.lastTableCell]}>
                  {item.Price.toLocaleString('vi-VN')}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    );
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
        {renderTemplateDetails()}
      </View>
      <View style={styles.buttonContainer}>
        {currentTemplate && (
          <Text style={styles.totalRough}>
            Tổng tiền:{' '}
            <Text style={styles.totalRoughPrimary}>
              {currentTemplate.totalRough.toLocaleString('vi-VN')}đ
            </Text>
          </Text>
        )}
        <CustomButton
          title="Tiếp tục"
          colors={
            currentTemplate && !loading
              ? ['#53A6A8', '#3C9597', '#1F7F81']
              : ['#d3d3d3', '#d3d3d3', '#d3d3d3']
          }
          onPress={handleContinue}
          loading={loading}
          disabled={!currentTemplate || loading}
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
  table: {
    marginTop: 20,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  tableHeader: {
    fontFamily: FONTFAMILY.montserat_bold,
    color: 'black',
    flex: 1,
    textAlign: 'center',
  },
  tableCell: {
    fontFamily: FONTFAMILY.montserat_regular,
    color: 'black',
    flex: 1,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  lastTableCell: {
    borderRightWidth: 0,
  },
  totalRough: {
    fontFamily: FONTFAMILY.montserat_bold,
    fontSize: 16,
    textAlign: 'right',
    marginTop: 10,
    color: 'black',
  },
  totalRoughPrimary: {
    color: '#53A6A8',
  },
});

export default HouseResidentialArea;
