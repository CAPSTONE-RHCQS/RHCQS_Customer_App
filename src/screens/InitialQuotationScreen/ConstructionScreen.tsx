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
import { useNavigation } from '@react-navigation/native';
import { AppStackNavigationProp } from '@/types/TypeScreen';
import { getConstructionOption } from '../../api/Contruction/Contruction';
import { Item } from '../../types/screens/Contruction/ContructionType';

const ConstructionScreen: React.FC = () => {
  const navigationApp = useNavigation<AppStackNavigationProp>();

  const [landArea, setLandArea] = useState('');
  const [constructionArea, setConstructionArea] = useState('');
  const [selectedFloors, setSelectedFloors] = useState<number | null>(1);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [buildOptionsData, setBuildOptionsData] = useState<Item[]>([]);

  useEffect(() => {
    const fetchConstructionOption = async () => {
      const data = await getConstructionOption();
      setBuildOptionsData(data);
    };
    fetchConstructionOption();
  }, []);

  const handleDetailPress = (Name: string) => {
    switch (Name) {
      case 'Thông Tầng lầu 1':
        navigationApp.navigate('ElevatorTechnical', { Name });
        break;
      case 'PIT':
        navigationApp.navigate('PIT', { Name });
        break;
      default:
        console.log('Không tìm thấy màn hình cho ID:', Name);
        break;
    }
  };

  const handleCheckBoxPress = (id: string) => {
    setCheckedItems(prevState =>
      prevState.includes(id)
        ? prevState.filter(item => item !== id)
        : [...prevState, id]
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

      return (
        <Construction
          key={index}
          id={option.Id}
          title={option.Name}
          price="0"
          area="0"
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
  buttonContainer: {
    justifyContent: 'flex-end',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 14,
    color: '#53A6A8',
  },
});

export default ConstructionScreen;