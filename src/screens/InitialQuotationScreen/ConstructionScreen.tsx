import React, {useState, useEffect} from 'react';
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
import {COLORS, FONTFAMILY} from '../../theme/theme';
import Construction from '../../components/Construction';
import CustomButton from '../../components/CustomButton';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {AppStackNavigationProp} from '../../types/TypeScreen';
import {constructionScreenMap} from '../../types/screens/Contruction/ContructionScreenMap';
import {getConstructionOption} from '../../api/Contruction/Contruction';
import {Item} from '../../types/screens/Contruction/ContructionType';
import Separator from '../../components/Separator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {PackageSelector} from '../../redux/selectors/PackageSelector/PackageSelector';
import {pushConstruction} from '../../redux/actions/Contruction/ContructionAction';

const ConstructionScreen: React.FC = () => {
  // Navigation
  const navigationApp = useNavigation<AppStackNavigationProp>();
  const dispatch = useDispatch();

  // Lấy dữ liệu từ Redux
  const detailConstructionData = useSelector(
    (state: any) => state.detailConstruction,
  );
  console.log('detailConstructionData', detailConstructionData);

  const packageData = useSelector(PackageSelector);
  console.log('packageData', packageData);

  // State để lưu trữ diện tích đất và diện tích xây dựng
  const [landArea, setLandArea] = useState('');
  const [constructionArea, setConstructionArea] = useState('');
  // State để lưu trữ số tầng lầu đã chọn
  const [selectedFloors, setSelectedFloors] = useState<number | null>(1);
  // State để lưu trữ ID các mục đã check
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  // State để lưu trữ dữ liệu các mục xây dựng
  const [modalVisible, setModalVisible] = useState(false);
  // State để lưu trữ dữ liệu các mục xây dựng
  const [buildOptionsData, setBuildOptionsData] = useState<Item[]>([]);
  // State để lưu trữ tổng tiền
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const fetchConstructionOption = async () => {
      try {
        const cachedData = await AsyncStorage.getItem('constructionOptions');
        if (cachedData) {
          console.log('Using cached construction options');
          setBuildOptionsData(JSON.parse(cachedData));
        } else {
          const data = await getConstructionOption();
          setBuildOptionsData(data);
          await AsyncStorage.setItem(
            'constructionOptions',
            JSON.stringify(data),
          );
        }
      } catch (error) {
        console.error('Error fetching construction options:', error);
      }
    };

    fetchConstructionOption();
  }, []);

  const handleDetailPress = (Name: string) => {
    const screenName = constructionScreenMap[Name];
    if (screenName) {
      navigationApp.navigate('ConstructionStack', {
        screen: screenName,
        params: {Name},
      });
    } else {
      console.warn('Không tìm thấy hạn mục:', Name);
    }
  };

  const handleCheckBoxPress = async (id: string, price: number) => {
    setCheckedItems(prevState => {
      const isChecked = prevState.includes(id);
      const newCheckedItems = isChecked
        ? prevState.filter(item => item !== id)
        : [...prevState, id];

      // Cập nhật tổng tiền
      setTotalPrice(prevTotal =>
        isChecked ? prevTotal - price : prevTotal + price,
      );

      // Lưu hoặc xóa ID trong AsyncStorage
      if (isChecked) {
        AsyncStorage.setItem(
          'checkedItemsConstruction',
          JSON.stringify(newCheckedItems),
        );
      } else {
        AsyncStorage.removeItem('checkedItemsConstruction');
      }

      return newCheckedItems;
    });
  };

  const handleContinuePress = () => {
    navigationApp.navigate('UltilitiesScreen');

    const detailedCheckedItems = checkedItems
      .map(id =>
        Object.values(detailConstructionData).find(
          (detail: any) => detail.id === id,
        ),
      )
      .filter(Boolean);

    dispatch(
      pushConstruction({
        constructionArea: constructionArea,
        checkedItems: detailedCheckedItems,
        totalPrice: totalPrice,
      }),
    );
  };

  // Hàm để cập nhật diện tích đất và tính toán diện tích xây dựng
  const handleLandAreaChange = (value: string) => {
    setLandArea(value);

    const landAreaValue = parseFloat(value);
    if (!isNaN(landAreaValue)) {
      let calculatedConstructionArea;
      if (landAreaValue <= 50) {
        calculatedConstructionArea = landAreaValue;
      } else if (landAreaValue > 50) {
        calculatedConstructionArea = 50 + 0.9 * (landAreaValue - 50);
      } else if (landAreaValue > 100) {
        calculatedConstructionArea = landAreaValue * 0.9;
      } else {
        calculatedConstructionArea = 0;
      }
      setConstructionArea(calculatedConstructionArea.toFixed(2));
    } else {
      setConstructionArea('');
    }
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

      switch (option.Name) {
        case 'Hầm':
          displayPrice = detailConstructionData.basement?.totalPrice || 0;
          displayArea = parseFloat(detailConstructionData.basement?.area || '0');
          break;
        case 'Móng':
          displayPrice = detailConstructionData.stereobate?.totalPrice || 0;
          displayArea = parseFloat(detailConstructionData.stereobate?.area || '0');
          break;

        default:
          displayPrice = 0;
          displayArea = 0;
          break;
      }

      const formattedPrice = displayPrice.toLocaleString();
      const formattedArea = displayArea.toLocaleString();

      return (
        <Construction
          key={index}
          id={option.Id}
          title={option.Name}
          price={formattedPrice}
          area={formattedArea}
          unit={option.Unit}
          onDetailPress={() => handleDetailPress(option.Name)}
          isChecked={checkedItems.includes(option.Id)}
          onCheckBoxPress={() => handleCheckBoxPress(option.Id, displayPrice)}
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
            onChangeText={handleLandAreaChange}
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
              style={{width: 20, height: 20}}
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
            {packageData.selectedRough && (
              <Text style={styles.packageText}>
                {packageData.roughPackagePrice} - {packageData.roughPackageName}
              </Text>
            )}
            {packageData.selectedComplete && (
              <Text style={styles.packageText}>
                {packageData.completePackagePrice} -{' '}
                {packageData.completePackageName}
              </Text>
            )}
          </View>
        </View>
        <Separator />
        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPriceText}>Tổng tiền: </Text>
          <Text style={styles.totalPrice}>
            {totalPrice.toLocaleString()} VND
          </Text>
        </View>
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
  totalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  totalPriceText: {
    fontFamily: FONTFAMILY.montserat_semibold,
    fontSize: 14,
    color: 'black',
    textAlign: 'right',
    marginBottom: 10,
  },
  totalPrice: {
    fontFamily: FONTFAMILY.montserat_semibold,
    fontSize: 14,
    color: COLORS.primary,
    textAlign: 'right',
    marginBottom: 10,
  },
});

export default ConstructionScreen;
