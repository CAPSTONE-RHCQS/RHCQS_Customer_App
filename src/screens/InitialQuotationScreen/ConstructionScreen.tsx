import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import InputField from '../../components/InputField';
import AppBar from '../../components/Appbar';
import FloorSelection from '../../components/FloorSelection';
import { FONTFAMILY } from '../../theme/theme';
import Construction from '../../components/Construction';
import CustomButton from '../../components/CustomButton';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import {
  AppStackNavigationProp,
  AppStackParamList,
} from '../../types/TypeScreen';
import { constructionScreenMap } from '../../types/screens/Contruction/ContructionScreenMap';
import { getConstructionOption } from '../../api/Contruction/Contruction';
import { Item } from '../../types/screens/Contruction/ContructionType';
import Separator from '../../components/Separator';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ConstructionScreenRouteProp = RouteProp<
  AppStackParamList,
  'ConstructionScreen'
>;

const ConstructionScreen: React.FC = () => {
  const navigationApp = useNavigation<AppStackNavigationProp>();
  const route = useRoute<ConstructionScreenRouteProp>();

  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [totalPricePIT, setTotalPricePIT] = useState<number>(0);
  const [area, setArea] = useState<number>(0);
  const [areaPIT, setAreaPIT] = useState<number>(0); 

  const [selectedRough, setSelectedRough] = useState<string>('');
  const [selectedComplete, setSelectedComplete] = useState<string>('');
  const [roughPackagePrice, setRoughPackagePrice] = useState<number>(0);
  const [completePackagePrice, setCompletePackagePrice] = useState<number>(0);

  const [landArea, setLandArea] = useState('');
  const [constructionArea, setConstructionArea] = useState('');
  const [selectedFloors, setSelectedFloors] = useState<number | null>(1);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [buildOptionsData, setBuildOptionsData] = useState<Item[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedTotalPrice = await AsyncStorage.getItem('totalPrice');
        const storedArea = await AsyncStorage.getItem('area');

        if (storedTotalPrice) {
          setTotalPrice(parseFloat(storedTotalPrice));
        }
        if (storedArea) {
          setArea(parseFloat(storedArea));
        } 

        const storedSelectedRough = await AsyncStorage.getItem('selectedRough');
        const storedSelectedComplete = await AsyncStorage.getItem('selectedComplete');
        const storedRoughPackagePrice = await AsyncStorage.getItem('roughPackagePrice');
        const storedCompletePackagePrice = await AsyncStorage.getItem('completePackagePrice');

        if (storedSelectedRough) {
          setSelectedRough(storedSelectedRough);
        }
        if (storedSelectedComplete) {
          setSelectedComplete(storedSelectedComplete);
        }
        if (storedRoughPackagePrice) {
          setRoughPackagePrice(parseFloat(storedRoughPackagePrice));
        }
        if (storedCompletePackagePrice) {
          setCompletePackagePrice(parseFloat(storedCompletePackagePrice));
        }

        const storedTotalPricePIT = await AsyncStorage.getItem('totalPricePIT'); 
        const storedAreaPIT = await AsyncStorage.getItem('areaPIT'); 

        if (storedTotalPricePIT) setTotalPricePIT(parseFloat(storedTotalPricePIT)); 
        if (storedAreaPIT) setAreaPIT(parseFloat(storedAreaPIT)); 
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const { source, totalPrice, totalPricePIT } = route.params;

    switch (source) {
      case 'Mái che':
        setTotalPrice(totalPrice ? Number(totalPrice) : 0);
        setArea(route.params.area ? Number(route.params.area) : 0);
        break;
      case 'Hố PIT':
        setTotalPricePIT(totalPricePIT ? Number(totalPricePIT) : 0);
        setAreaPIT(route.params.areaPIT ? Number(route.params.areaPIT) : 0);
        break;
      default:
        break;
    }
  }, [route.params]);

  useEffect(() => {
    const fetchConstructionOption = async () => {
      const data = await getConstructionOption();
      setBuildOptionsData(data);
    };
    fetchConstructionOption();
  }, []);

  const handleDetailPress = (Name: string) => {
    const screenName = constructionScreenMap[Name];
    if (screenName) {
      navigationApp.navigate('ConstructionStack', {
        screen: screenName,
        params: { Name },
      });
    } else {
      console.warn('Không tìm thấy hạn mục:', Name);
    }
  };

  const handleCheckBoxPress = (id: string) => {
    setCheckedItems(prevState =>
      prevState.includes(id)
        ? prevState.filter(item => item !== id)
        : [...prevState, id],
    );
  };

  const handleContinuePress = () => {
    navigationApp.navigate('UltilitiesScreen');
  };

  const renderBuildOptions = () => {
    return buildOptionsData.map((option, index) => {
      const isFloorOption =
        option.Name.includes('Lầu') || option.Name.includes('Thông Tầng');
      const floorNumber = isFloorOption
        ? parseInt(option.Name.match(/\d+/)?.[0] || '0')
        : 0;

      if (isFloorOption && selectedFloors && floorNumber > selectedFloors) {
        return null;
      }

      let displayPrice = 0;
      let displayArea = 0;

      // Sử dụng state khác nhau cho từng loại Mái che và Hố PIT
      if ( option.Name === 'Mái che') {
        displayPrice = totalPrice; 
        displayArea = area;
      } else if ( option.Name === 'Hố PIT') {
        displayPrice = totalPricePIT; 
        displayArea = areaPIT; 
      }

      return (
        <Construction
          key={index}
          id={option.Id}
          title={option.Name}
          price={displayPrice.toLocaleString()}
          area={displayArea.toLocaleString()}
          unit={option.Unit}
          onDetailPress={() => handleDetailPress(option.Name)}
          isChecked={checkedItems.includes(option.Id)}
          onCheckBoxPress={handleCheckBoxPress}
        />
      );
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E4E1E1FF" />
      <AppBar nameScreen="Tính chi phí xây dựng thô" />
      <View style={styles.bodyContainer}>
        <View>
          <InputField
            name="Diện tích đất"
            value={landArea}
            onChangeText={setLandArea}
            placeholder="100"
            keyboardType="numeric"
          />
          <InputField
            name="Diện tích xây dựng"
            value={constructionArea}
            onChangeText={setConstructionArea}
            placeholder="90"
            keyboardType="numeric"
          />
          <Text style={styles.noteText}>Đơn vị tính: m²</Text>
        </View>

        <View style={styles.floorsSelection}>
          <Text style={styles.floorsText}>Số tầng lầu</Text>
          <TouchableOpacity
            style={styles.selectionBox}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.selectedText}>
              {selectedFloors ? `${selectedFloors} tầng lầu` : 'Chọn số tầng'}
            </Text>
            <Image
              source={require('../../assets/image/icon/chevron/chevron-down.png')}
              style={{ width: 20, height: 20 }}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.buildOptionGroup}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderBuildOptions()}
          </ScrollView>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <View style={styles.separator}></View>
        <View style={styles.selectedPackagesContainer}>
          <View style={styles.modalTitleContainer}>
            <Text style={styles.modalTitlePackage}>Gói xây dựng</Text>
          </View>

          <View style={styles.selectedPackages}>
            {selectedRough && (
              <Text style={styles.packageText}>
                {roughPackagePrice} - {selectedRough}
              </Text>
            )}
            {selectedComplete && (
              <Text style={styles.packageText}>
                {completePackagePrice} - {selectedComplete}
              </Text>
            )}
          </View>
        </View>
        <Separator />
        <CustomButton
          title="Tiếp tục"
          onPress={handleContinuePress}
          colors={['#53A6A8', '#3C9597', '#1F7F81']}
        />
      </View>

      {/* Modal cho FloorSelection */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalContainer}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}>
          <TouchableOpacity style={styles.modalContent} activeOpacity={1}>
            <Text style={styles.modalTitle}>Chọn số tầng lầu</Text>
            <FloorSelection
              selectedFloor={selectedFloors}
              onSelect={floor => {
                setSelectedFloors(floor);
                setModalVisible(false);
              }}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  bodyContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginTop: 20,
  },
  noteText: {
    fontFamily: FONTFAMILY.montserat_semibold,
    position: 'absolute',
    fontSize: 12,
    right: 0,
  },
  floorsSelection: {
    marginTop: 10,
    flexDirection: 'row',
  },
  floorsText: {
    fontFamily: FONTFAMILY.montserat_semibold,
    color: 'black',
    fontSize: 14,
  },

  selectedPackagesContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  selectedPackages: {
    position: 'absolute',
    right: 0,
    alignItems: 'flex-end',
  },
  packageText: {
    fontFamily: FONTFAMILY.montserat_medium,
    fontSize: 14,
    marginRight: 20,
    color: 'black',
  },
  selectionBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    right: 0,
    alignItems: 'center',
    marginLeft: 5,
  },
  selectedText: {
    fontSize: 14,
    fontFamily: FONTFAMILY.montserat_medium,
    color: 'black',
    marginRight: 21,
  },
  buildOptionGroup: {
    flex: 1,
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontFamily: FONTFAMILY.montserat_bold,
    fontSize: 16,
  },
  modalTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitlePackage: {
    fontFamily: FONTFAMILY.montserat_semibold,
    fontSize: 14,
    color: 'black',
  },
  separator: {
    height: 1,
    backgroundColor: '#5E5D5DFF',
    marginBottom: 20,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 20,
  },
});

export default ConstructionScreen;