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
import InputField from '../../../components/InputField';
import AppBar from '../../../components/Appbar';
import FloorSelection from '../../../components/FloorSelection';
import {COLORS, FONTFAMILY} from '../../../theme/theme';
import Construction from '../../../components/Construction';
import CustomButton from '../../../components/CustomButton';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation} from '@react-navigation/native';
import {AppStackNavigationProp} from '../../../types/TypeScreen';
import {getConstructionOption} from '../../../api/Contruction/Contruction';
import {Item} from '../../../types/screens/Contruction/ContructionType';
import Separator from '../../../components/Separator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {PackageSelector} from '../../../redux/selectors/PackageSelector/PackageSelector';
import {pushConstruction} from '../../../redux/actions/Contruction/ContructionAction';
import {DetailContructionSelector} from '../../../redux/selectors/ContructionSelector/DetailContructionSelector/DetailContructionSelector';
import {resetDataDetailConstruction} from '../../../redux/actions/reset/resetData';
import {resetDataConstruction} from '../../../redux/actions/reset/resetData';

const ConstructionScreen: React.FC = () => {
  // Navigation
  const navigationApp = useNavigation<AppStackNavigationProp>();
  const dispatch = useDispatch();
  const detailConstructionData = useSelector(DetailContructionSelector);
  const packageData = useSelector(PackageSelector);
  const [constructionArea, setConstructionArea] = useState('');
  const [selectedFloors, setSelectedFloors] = useState<number | null>(1);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [buildOptionsData, setBuildOptionsData] = useState<Item[]>([]);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchConstructionOption = async () => {
      try {
        const data = await getConstructionOption();
        setBuildOptionsData(data);
      } catch (error) {
        console.error('Error fetching construction options:', error);
      }
    };

    fetchConstructionOption();
  }, []);

  useEffect(() => {
    const autoCheckedItems = detailConstructionData
      .filter((detail: any) => detail.totalPrice > 0)
      .map((detail: any) => detail.id);

    setCheckedItems(autoCheckedItems);

    const updatedTotalPrice = autoCheckedItems.reduce((acc: number, id: string) => {
      const detail = detailConstructionData.find(
        (detail: any) => detail.id === id,
      );
      return acc + (detail ? detail.totalPrice : 0);
    }, 0);
    setTotalPrice(updatedTotalPrice);
  }, [detailConstructionData]);

  const handleAreaChange = (value: string) => {
    setConstructionArea(value);
    AsyncStorage.setItem('constructionArea', value);
  };

  const handleDetailPress = (Id: string) => {
    navigationApp.navigate('DetailContruction', {Id});
  };

  const handleCheckBoxPress = async (id: string, price: number) => {
    setCheckedItems(prevState => {
      const isChecked = prevState.includes(id);
      const newCheckedItems = isChecked
        ? prevState.filter(item => item !== id)
        : [...prevState, id];

      const updatedTotalPrice = newCheckedItems.reduce((acc, itemId) => {
        const detail = detailConstructionData.find(
          (detail: any) => detail.id === itemId,
        );
        return acc + (detail ? detail.totalPrice : 0);
      }, 0);
      setTotalPrice(updatedTotalPrice);

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

  const handleBack = () => {
    AsyncStorage.removeItem('constructionArea');
    dispatch(resetDataDetailConstruction());
    dispatch(resetDataConstruction());
    navigationApp.goBack();
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
      const detail = detailConstructionData.find(
        (detail: any) => detail.id === option.Id,
      );

      const displayPrice = detail ? detail.totalPrice : 0;
      const displayArea = detail ? parseFloat(detail.area) : 0;
      const displayAreaBuilding = detail ? parseFloat(detail.areaBuilding) : 0;
      const formattedPrice = displayPrice.toLocaleString();
      const formattedArea = displayArea.toLocaleString();
      const formattedAreaBuilding = displayAreaBuilding.toLocaleString();
      return (
        <Construction
          key={index}
          id={option.Id}
          title={option.Name}
          price={formattedPrice}
          area={formattedAreaBuilding}
          unit={option.Unit}
          onDetailPress={() => handleDetailPress(option.Id)}
          isChecked={checkedItems.includes(option.Id)}
          onCheckBoxPress={() => handleCheckBoxPress(option.Id, displayPrice)}
        />
      );
    });
  };

  const isContinueButtonEnabled =
    parseFloat(constructionArea) >= 36 &&
    checkedItems.length > 0 &&
    checkedItems.every(id => {
      const detail = detailConstructionData.find(
        (detail: any) => detail.id === id,
      );
      return detail && detail.totalPrice > 0;
    });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#E4E1E1FF" />
      <AppBar nameScreen="Tính chi phí xây dựng thô" onBackPress={handleBack} />
      <View style={styles.bodyContainer}>
        <View>
          <InputField
            name="Diện tích đất"
            value={constructionArea}
            onChangeText={handleAreaChange}
            placeholder="90"
            keyboardType="numeric"
            isRequired={true}
          />
          <Text style={styles.noteText}>Đơn vị tính: m²</Text>
        </View>
        <Text style={styles.noteTextArea}>
          Lưu ý: Diện tích xây dựng phải lớn hơn hoặc bằng 36 m²
        </Text>

        <View style={styles.floorsSelection}>
          <Text style={styles.floorsText}>Số tầng lầu</Text>
          <TouchableOpacity
            style={styles.selectionBox}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.selectedText}>
              {selectedFloors ? `${selectedFloors} tầng lầu` : 'Chọn số tầng'}
            </Text>
            <Image
              source={require('../../../assets/image/icon/chevron/chevron-down.png')}
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
                {packageData.roughPackageName} -{' '}
                {packageData.roughPackagePrice.toLocaleString()}
              </Text>
            )}
            {packageData.selectedComplete && (
              <Text style={styles.packageText}>
                {packageData.completePackageName} -{' '}
                {packageData.completePackagePrice.toLocaleString()}
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
          colors={
            isContinueButtonEnabled
              ? ['#53A6A8', '#3C9597', '#1F7F81']
              : ['#A9A9A9', '#A9A9A9', '#A9A9A9']
          }
          disabled={!isContinueButtonEnabled}
          loading={loading}
        />
      </View>

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
    color: '#808080FF',
  },
  noteTextArea: {
    fontFamily: FONTFAMILY.montserat_semibold,
    fontSize: 12,
    color: '#808080FF',
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
