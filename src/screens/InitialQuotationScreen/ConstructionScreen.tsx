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
import {FONTFAMILY} from '../../theme/theme';
import Construction from '../../components/Construction';
import CustomButton from '../../components/CustomButton';
import {ScrollView} from 'react-native-gesture-handler';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {
  AppStackNavigationProp,
  AppStackParamList,
} from '../../types/TypeScreen';
import {
  constructionScreenMap,
  priceAreaMap,
} from '../../types/screens/Contruction/ContructionScreenMap';
import {getConstructionOption} from '../../api/Contruction/Contruction';
import {Item} from '../../types/screens/Contruction/ContructionType';
import Separator from '../../components/Separator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useConstructionState} from '../../hooks/useContructionState';

type ConstructionScreenRouteProp = RouteProp<
  AppStackParamList,
  'ConstructionScreen'
>;

const ConstructionScreen: React.FC = () => {
  // Navigation
  const navigationApp = useNavigation<AppStackNavigationProp>();
  const route = useRoute<ConstructionScreenRouteProp>();

  const {totalPrice, setTotalPrice, area, setArea} = useConstructionState();

  // Gói xây dựng
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

  //Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        //Mái che
        const storedTotalPriceRoof = await AsyncStorage.getItem(
          'totalPriceRoof',
        );
        const storedAreaRoof = await AsyncStorage.getItem('areaRoof');

        if (storedTotalPriceRoof) {
          setTotalPrice(prev => ({
            ...prev,
            totalPriceRoof: parseFloat(storedTotalPriceRoof),
          }));
        }
        if (storedAreaRoof) {
          setArea(prev => ({...prev, areaRoof: parseFloat(storedAreaRoof)}));
        }

        // Hố PIT
        const storedTotalPricePIT = await AsyncStorage.getItem('totalPricePIT');
        const storedAreaPIT = await AsyncStorage.getItem('areaPIT');

        if (storedTotalPricePIT) {
          setTotalPrice(prev => ({
            ...prev,
            totalPricePIT: parseFloat(storedTotalPricePIT),
          }));
        }
        if (storedAreaPIT) {
          setArea(prev => ({...prev, areaPIT: parseFloat(storedAreaPIT)}));
        }

        // Mái phụ
        const storedTotalPriceSubRoof = await AsyncStorage.getItem(
          'totalPriceSubRoof',
        );
        const storedAreaSubRoof = await AsyncStorage.getItem('areaSubRoof');

        if (storedTotalPriceSubRoof) {
          setTotalPrice(prev => ({
            ...prev,
            totalPriceSubRoof: parseFloat(storedTotalPriceSubRoof),
          }));
        }
        if (storedAreaSubRoof) {
          setArea(prev => ({
            ...prev,
            areaSubRoof: parseFloat(storedAreaSubRoof),
          }));
        }

        // Sân thượng không có mái che
        const storedTotalPriceOpenRooftop = await AsyncStorage.getItem(
          'totalPriceOpenRooftop',
        );
        const storedAreaOpenRooftop = await AsyncStorage.getItem(
          'areaOpenRooftop',
        );

        if (storedTotalPriceOpenRooftop) {
          setTotalPrice(prev => ({
            ...prev,
            totalPriceOpenRooftop: parseFloat(storedTotalPriceOpenRooftop),
          }));
        }
        if (storedAreaOpenRooftop) {
          setArea(prev => ({
            ...prev,
            areaOpenRooftop: parseFloat(storedAreaOpenRooftop),
          }));
        }

        // Tầng lửng
        const storedTotalPriceMezzanine = await AsyncStorage.getItem(
          'totalPriceMezzanine',
        );
        const storedAreaMezzanine = await AsyncStorage.getItem('areaMezzanine');

        if (storedTotalPriceMezzanine) {
          setTotalPrice(prev => ({
            ...prev,
            totalPriceMezzanine: parseFloat(storedTotalPriceMezzanine),
          }));
        }
        if (storedAreaMezzanine) {
          setArea(prev => ({
            ...prev,
            areaMezzanine: parseFloat(storedAreaMezzanine),
          }));
        }

        // Sân
        const storedTotalYard = await AsyncStorage.getItem('totalPriceYard');
        const storedAreaYard = await AsyncStorage.getItem('areaYard');

        if (storedTotalYard) {
          setTotalPrice(prev => ({
            ...prev,
            totalPriceYard: parseFloat(storedTotalYard),
          }));
        }
        if (storedAreaYard) {
          setArea(prev => ({...prev, areaYard: parseFloat(storedAreaYard)}));
        }

        // Phòng kỹ thuật thang máy
        const storedTotalPriceElevatorTechnical = await AsyncStorage.getItem(
          'totalPriceElevatorTechnical',
        );
        const storedAreaElevatorTechnical = await AsyncStorage.getItem(
          'areaElevatorTechnical',
        );

        if (storedTotalPriceElevatorTechnical) {
          setTotalPrice(prev => ({
            ...prev,
            totalPriceElevatorTechnical: parseFloat(
              storedTotalPriceElevatorTechnical,
            ),
          }));
        }
        if (storedAreaElevatorTechnical) {
          setArea(prev => ({
            ...prev,
            areaElevatorTechnical: parseFloat(storedAreaElevatorTechnical),
          }));
        }

        //Hầm
        const storedTotalPriceBasement = await AsyncStorage.getItem(
          'totalPriceBasement',
        );
        const storedAreaBasement = await AsyncStorage.getItem('areaBasement');

        if (storedTotalPriceBasement) {
          setTotalPrice(prev => ({
            ...prev,
            totalPriceBasement: parseFloat(storedTotalPriceBasement),
          }));
        }
        if (storedAreaBasement) {
          setArea(prev => ({
            ...prev,
            areaBasement: parseFloat(storedAreaBasement),
          }));
        }

        //Trệt
        const storedTotalPriceGroundFloor = await AsyncStorage.getItem(
          'totalPriceGroundFloor',
        );
        const storedAreaGroundFloor = await AsyncStorage.getItem(
          'areaGroundFloor',
        );

        if (storedTotalPriceGroundFloor) {
          setTotalPrice(prev => ({
            ...prev,
            totalPriceGroundFloor: parseFloat(storedTotalPriceGroundFloor),
          }));
        }
        if (storedAreaGroundFloor) {
          setArea(prev => ({
            ...prev,
            areaGroundFloor: parseFloat(storedAreaGroundFloor),
          }));
        }

        // Thông tầng lửng
        const storedTotalPriceMezzanineVoid = await AsyncStorage.getItem(
          'totalPriceMezzanineVoid',
        );
        const storedAreaMezzanineVoid = await AsyncStorage.getItem(
          'areaMezzanineVoid',
        );

        if (storedTotalPriceMezzanineVoid) {
          setTotalPrice(prev => ({
            ...prev,
            totalPriceMezzanineVoid: parseFloat(storedTotalPriceMezzanineVoid),
          }));
        }
        if (storedAreaMezzanineVoid) {
          setArea(prev => ({
            ...prev,
            areaMezzanineVoid: parseFloat(storedAreaMezzanineVoid),
          }));
        }

        // Sân thượng có mái che
        const storedTotalPriceRooftop = await AsyncStorage.getItem(
          'totalPriceRooftop',
        );
        const storedAreaRooftop = await AsyncStorage.getItem('areaRooftop');

        if (storedTotalPriceRooftop) {
          setTotalPrice(prev => ({
            ...prev,
            totalPriceRooftop: parseFloat(storedTotalPriceRooftop),
          }));
        }
        if (storedAreaRooftop) {
          setArea(prev => ({
            ...prev,
            areaRooftop: parseFloat(storedAreaRooftop),
          }));
        }

        // Móng
        const storedTotalStereobate = await AsyncStorage.getItem(
          'totalPriceStereobate',
        );
        const storedAreaStereobate = await AsyncStorage.getItem(
          'areaStereobate',
        );

        if (storedTotalStereobate) {
          setTotalPrice(prev => ({
            ...prev,
            totalPriceStereobate: parseFloat(storedTotalStereobate),
          }));
        }
        if (storedAreaStereobate) {
          setArea(prev => ({
            ...prev,
            areaStereobate: parseFloat(storedAreaStereobate),
          }));
        }

        // Tầng 1
        const storedTotalFirstFloor = await AsyncStorage.getItem(
          'totalPriceFirstFloor',
        );
        const storedAreaFirstFloor = await AsyncStorage.getItem(
          'areaFirstFloor',
        );

        if (storedTotalFirstFloor) {
          setTotalPrice(prev => ({
            ...prev,
            totalPriceFirstFloor: parseFloat(storedTotalFirstFloor),
          }));
        }
        if (storedAreaFirstFloor) {
          setArea(prev => ({
            ...prev,
            areaFirstFloor: parseFloat(storedAreaFirstFloor),
          }));
        }

        // Tầng 2
        const storedTotalSecondFloor = await AsyncStorage.getItem(
          'totalPriceSecondFloor',
        );
        const storedAreaSecondFloor = await AsyncStorage.getItem(
          'areaSecondFloor',
        );

        if (storedTotalSecondFloor) {
          setTotalPrice(prev => ({
            ...prev,
            totalPriceSecondFloor: parseFloat(storedTotalSecondFloor),
          }));
        }
        if (storedAreaSecondFloor) {
          setArea(prev => ({
            ...prev,
            areaSecondFloor: parseFloat(storedAreaSecondFloor),
          }));
        }

        // Tầng 3
        const storedTotalThirdFloor = await AsyncStorage.getItem(
          'totalPriceThirdFloor',
        );
        const storedAreaThirdFloor = await AsyncStorage.getItem(
          'areaThirdFloor',
        );

        if (storedTotalThirdFloor) {
          setTotalPrice(prev => ({
            ...prev,
            totalPriceThirdFloor: parseFloat(storedTotalThirdFloor),
          }));
        }
        if (storedAreaThirdFloor) {
          setArea(prev => ({
            ...prev,
            areaThirdFloor: parseFloat(storedAreaThirdFloor),
          }));
        }

        // Tầng 4
        const storedTotalFourthFloor = await AsyncStorage.getItem(
          'totalPriceFourthFloor',
        );
        const storedAreaFourthFloor = await AsyncStorage.getItem(
          'areaFourthFloor',
        );

        if (storedTotalFourthFloor) {
          setTotalPrice(prev => ({
            ...prev,
            totalPriceFourthFloor: parseFloat(storedTotalFourthFloor),
          }));
        }
        if (storedAreaFourthFloor) {
          setArea(prev => ({
            ...prev,
            areaFourthFloor: parseFloat(storedAreaFourthFloor),
          }));
        }

        // Tầng 5
        const storedTotalFifthFloor = await AsyncStorage.getItem(
          'totalPriceFifthFloor',
        );
        const storedAreaFifthFloor = await AsyncStorage.getItem(
          'areaFifthFloor',
        );

        if (storedTotalFifthFloor) {
          setTotalPrice(prev => ({
            ...prev,
            totalPriceFifthFloor: parseFloat(storedTotalFifthFloor),
          }));
        }
        if (storedAreaFifthFloor) {
          setArea(prev => ({
            ...prev,
            areaFifthFloor: parseFloat(storedAreaFifthFloor),
          }));
        }

        // Tầng 6
        const storedTotalSixthFloor = await AsyncStorage.getItem(
          'totalPriceSixthFloor',
        );
        const storedAreaSixthFloor = await AsyncStorage.getItem(
          'areaSixthFloor',
        );

        if (storedTotalSixthFloor) {
          setTotalPrice(prev => ({
            ...prev,
            totalPriceSixthFloor: parseFloat(storedTotalSixthFloor),
          }));
        }
        if (storedAreaSixthFloor) {
          setArea(prev => ({
            ...prev,
            areaSixthFloor: parseFloat(storedAreaSixthFloor),
          }));
        }

        // Thông tầng 1
        const storedTotalFirstFloorVoid = await AsyncStorage.getItem(
          'totalPriceFirstFloorVoid',
        );
        const storedAreaFirstFloorVoid = await AsyncStorage.getItem(
          'areaFirstFloorVoid',
        );

        if (storedTotalFirstFloorVoid) {
          setTotalPrice(prev => ({
            ...prev,
            totalPriceFirstFloorVoid: parseFloat(storedTotalFirstFloorVoid),
          }));
        }
        if (storedAreaFirstFloorVoid) {
          setArea(prev => ({
            ...prev,
            areaFirstFloorVoid: parseFloat(storedAreaFirstFloorVoid),
          }));
        }

        // Thông tầng 2
        const storedTotalSecondFloorVoid = await AsyncStorage.getItem(
          'totalPriceSecondFloorVoid',
        );
        const storedAreaSecondFloorVoid = await AsyncStorage.getItem(
          'areaSecondFloorVoid',
        );

        if (storedTotalSecondFloorVoid) {
          setTotalPrice(prev => ({
            ...prev,
            totalPriceSecondFloorVoid: parseFloat(storedTotalSecondFloorVoid),
          }));
        }
        if (storedAreaSecondFloorVoid) {
          setArea(prev => ({
            ...prev,
            areaSecondFloorVoid: parseFloat(storedAreaSecondFloorVoid),
          }));
        }

        // Thông tầng 3
        const storedTotalThirdFloorVoid = await AsyncStorage.getItem(
          'totalPriceThirdFloorVoid',
        );
        const storedAreaThirdFloorVoid = await AsyncStorage.getItem(
          'areaThirdFloorVoid',
        );

        if (storedTotalThirdFloorVoid) {
          setTotalPrice(prev => ({
            ...prev,
            totalPriceThirdFloorVoid: parseFloat(storedTotalThirdFloorVoid),
          }));
        }
        if (storedAreaThirdFloorVoid) {
          setArea(prev => ({
            ...prev,
            areaThirdFloorVoid: parseFloat(storedAreaThirdFloorVoid),
          }));
        }

        // Thông tầng 4
        const storedTotalFourthFloorVoid = await AsyncStorage.getItem(
          'totalPriceFourthFloorVoid',
        );
        const storedAreaFourthFloorVoid = await AsyncStorage.getItem(
          'areaFourthFloorVoid',
        );

        if (storedTotalFourthFloorVoid) {
          setTotalPrice(prev => ({
            ...prev,
            totalPriceFourthFloorVoid: parseFloat(storedTotalFourthFloorVoid),
          }));
        }
        if (storedAreaFourthFloorVoid) {
          setArea(prev => ({
            ...prev,
            areaFourthFloorVoid: parseFloat(storedAreaFourthFloorVoid),
          }));
        }

        // Thông tầng 5
        const storedTotalFifthFloorVoid = await AsyncStorage.getItem(
          'totalPriceFifthFloorVoid',
        );
        const storedAreaFifthFloorVoid = await AsyncStorage.getItem(
          'areaFifthFloorVoid',
        );

        if (storedTotalFifthFloorVoid) {
          setTotalPrice(prev => ({
            ...prev,
            totalPriceFifthFloorVoid: parseFloat(storedTotalFifthFloorVoid),
          }));
        }
        if (storedAreaFifthFloorVoid) {
          setArea(prev => ({
            ...prev,
            areaFifthFloorVoid: parseFloat(storedAreaFifthFloorVoid),
          }));
        }

        // Thông tầng 6
        const storedTotalSixthFloorVoid = await AsyncStorage.getItem(
          'totalPriceSixthFloorVoid',
        );
        const storedAreaSixthFloorVoid = await AsyncStorage.getItem(
          'areaSixthFloorVoid',
        );

        if (storedTotalSixthFloorVoid) {
          setTotalPrice(prev => ({
            ...prev,
            totalPriceSixthFloorVoid: parseFloat(storedTotalSixthFloorVoid),
          }));
        }
        if (storedAreaSixthFloorVoid) {
          setArea(prev => ({
            ...prev,
            areaSixthFloorVoid: parseFloat(storedAreaSixthFloorVoid),
          }));
        }

        const storedSelectedRough = await AsyncStorage.getItem('selectedRough');
        const storedSelectedComplete = await AsyncStorage.getItem(
          'selectedComplete',
        );
        const storedRoughPackagePrice = await AsyncStorage.getItem(
          'roughPackagePrice',
        );
        const storedCompletePackagePrice = await AsyncStorage.getItem(
          'completePackagePrice',
        );

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
      } catch (error) {
        console.error('Error loading data from AsyncStorage:', error);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const {
      source,
      totalPricePIT,
      areaPIT,
      totalPriceRoof,
      areaRoof,
      totalPriceSubRoof,
      areaSubRoof,
      totalPriceOpenRooftop,
      areaOpenRooftop,
      totalPriceMezzanine,
      areaMezzanine,
      totalPriceMezzanineVoid,
      areaMezzanineVoid,
      totalPriceBasement,
      areaBasement,
      totalPriceStereobate,
      areaStereobate,
      totalPriceElevatorTechnical,
      areaElevatorTechnical,
      totalPriceYard,
      areaYard,
      totalPriceGroundFloor,
      areaGroundFloor,
      totalPriceRooftop,
      areaRooftop,
      totalPriceFirstFloor,
      areaFirstFloor,
      totalPriceSecondFloor,
      areaSecondFloor,
      totalPriceThirdFloor,
      areaThirdFloor,
      totalPriceFourthFloor,
      areaFourthFloor,
      totalPriceFifthFloor,
      areaFifthFloor,
      totalPriceSixthFloor,
      areaSixthFloor,
      totalPriceFirstFloorVoid,
      areaFirstFloorVoid,
      totalPriceSecondFloorVoid,
      areaSecondFloorVoid,
      totalPriceThirdFloorVoid,
      areaThirdFloorVoid,
      totalPriceFourthFloorVoid,
      areaFourthFloorVoid,
      totalPriceFifthFloorVoid,
      areaFifthFloorVoid,
      totalPriceSixthFloorVoid,
      areaSixthFloorVoid,
    } = route.params;

    switch (source) {
      case 'Mái che':
        setTotalPrice(prev => ({
          ...prev,
          totalPriceRoof: totalPriceRoof ? Number(totalPriceRoof) : 0,
        }));
        setArea(prev => ({...prev, areaRoof: areaRoof ? Number(areaRoof) : 0}));
        break;
      case 'Hố PIT':
        setTotalPrice(prev => ({
          ...prev,
          totalPricePIT: totalPricePIT ? Number(totalPricePIT) : 0,
        }));
        setArea(prev => ({...prev, areaPIT: areaPIT ? Number(areaPIT) : 0}));
        break;
      case 'Mái phụ':
        setTotalPrice(prev => ({
          ...prev,
          totalPriceSubRoof: totalPriceSubRoof ? Number(totalPriceSubRoof) : 0,
        }));
        setArea(prev => ({
          ...prev,
          areaSubRoof: areaSubRoof ? Number(areaSubRoof) : 0,
        }));
        break;
      case 'Tầng lửng':
        setTotalPrice(prev => ({
          ...prev,
          totalPriceMezzanine: totalPriceMezzanine
            ? Number(totalPriceMezzanine)
            : 0,
        }));
        setArea(prev => ({
          ...prev,
          areaMezzanine: areaMezzanine ? Number(areaMezzanine) : 0,
        }));
        break;
      case 'Thông tầng lửng':
        setTotalPrice(prev => ({
          ...prev,
          totalPriceMezzanineVoid: totalPriceMezzanineVoid
            ? Number(totalPriceMezzanineVoid)
            : 0,
        }));
        setArea(prev => ({
          ...prev,
          areaMezzanineVoid: areaMezzanineVoid ? Number(areaMezzanineVoid) : 0,
        }));
        break;
      case 'Phòng kỹ thuật thang máy':
        setTotalPrice(prev => ({
          ...prev,
          totalPriceElevatorTechnical: totalPriceElevatorTechnical
            ? Number(totalPriceElevatorTechnical)
            : 0,
        }));
        setArea(prev => ({
          ...prev,
          areaElevatorTechnical: areaElevatorTechnical
            ? Number(areaElevatorTechnical)
            : 0,
        }));
        break;
      case 'Sân thượng không có mái che':
        setTotalPrice(prev => ({
          ...prev,
          totalPriceOpenRooftop: totalPriceOpenRooftop
            ? Number(totalPriceOpenRooftop)
            : 0,
        }));
        setArea(prev => ({
          ...prev,
          areaOpenRooftop: areaOpenRooftop ? Number(areaOpenRooftop) : 0,
        }));
        break;
      case 'Hầm':
        setTotalPrice(prev => ({
          ...prev,
          totalPriceBasement: totalPriceBasement
            ? Number(totalPriceBasement)
            : 0,
        }));
        setArea(prev => ({
          ...prev,
          areaBasement: areaBasement ? Number(areaBasement) : 0,
        }));
        break;
      case 'Móng':
        setTotalPrice(prev => ({
          ...prev,
          totalPriceStereobate: totalPriceStereobate
            ? Number(totalPriceStereobate)
            : 0,
        }));
        setArea(prev => ({
          ...prev,
          areaStereobate: areaStereobate ? Number(areaStereobate) : 0,
        }));
        break;
      case 'Sân':
        setTotalPrice(prev => ({
          ...prev,
          totalPriceYard: totalPriceYard ? Number(totalPriceYard) : 0,
        }));
        setArea(prev => ({
          ...prev,
          areaYard: areaYard ? Number(areaYard) : 0,
        }));
        break;
      case 'Sân thượng có mái che':
        setTotalPrice(prev => ({
          ...prev,
          totalPriceRooftop: totalPriceRooftop ? Number(totalPriceRooftop) : 0,
        }));
        setArea(prev => ({
          ...prev,
          areaRooftop: areaRooftop ? Number(areaRooftop) : 0,
        }));
        break;
      case 'Trệt':
        setTotalPrice(prev => ({
          ...prev,
          totalPriceGroundFloor: totalPriceGroundFloor
            ? Number(totalPriceGroundFloor)
            : 0,
        }));
        setArea(prev => ({
          ...prev,
          areaGroundFloor: areaGroundFloor ? Number(areaGroundFloor) : 0,
        }));
        break;
      case 'Thông Tầng lầu 1':
        setTotalPrice(prev => ({
          ...prev,
          totalPriceFirstFloorVoid: totalPriceFirstFloorVoid
            ? Number(totalPriceFirstFloorVoid)
            : 0,
        }));
        setArea(prev => ({
          ...prev,
          areaFirstFloorVoid: areaFirstFloorVoid
            ? Number(areaFirstFloorVoid)
            : 0,
        }));
        break;
      case 'Thông Tầng lầu 2':
        setTotalPrice(prev => ({
          ...prev,
          totalPriceSecondFloorVoid: totalPriceSecondFloorVoid
            ? Number(totalPriceSecondFloorVoid)
            : 0,
        }));
        setArea(prev => ({
          ...prev,
          areaSecondFloorVoid: areaSecondFloorVoid
            ? Number(areaSecondFloorVoid)
            : 0,
        }));
        break;
      case 'Thông Tầng lầu 3':
        setTotalPrice(prev => ({
          ...prev,
          totalPriceThirdFloorVoid: totalPriceThirdFloorVoid
            ? Number(totalPriceThirdFloorVoid)
            : 0,
        }));
        setArea(prev => ({
          ...prev,
          areaThirdFloorVoid: areaThirdFloorVoid
            ? Number(areaThirdFloorVoid)
            : 0,
        }));
        break;
      case 'Thông Tầng lầu 4':
        setTotalPrice(prev => ({
          ...prev,
          totalPriceFourthFloorVoid: totalPriceFourthFloorVoid
            ? Number(totalPriceFourthFloorVoid)
            : 0,
        }));
        setArea(prev => ({
          ...prev,
          areaFourthFloorVoid: areaFourthFloorVoid
            ? Number(areaFourthFloorVoid)
            : 0,
        }));
        break;
      case 'Thông Tầng lầu 5':
        setTotalPrice(prev => ({
          ...prev,
          totalPriceFifthFloorVoid: totalPriceFifthFloorVoid
            ? Number(totalPriceFifthFloorVoid)
            : 0,
        }));
        setArea(prev => ({
          ...prev,
          areaFifthFloorVoid: areaFifthFloorVoid
            ? Number(areaFifthFloorVoid)
            : 0,
        }));
        break;
      case 'Thông Tầng lầu 6':
        setTotalPrice(prev => ({
          ...prev,
          totalPriceSixthFloorVoid: totalPriceSixthFloorVoid
            ? Number(totalPriceSixthFloorVoid)
            : 0,
        }));
        setArea(prev => ({
          ...prev,
          areaSixthFloorVoid: areaSixthFloorVoid
            ? Number(areaSixthFloorVoid)
            : 0,
        }));
        break;

      case 'Lầu 1':
        setTotalPrice(prev => ({
          ...prev,
          totalPriceFirstFloor: totalPriceFirstFloor
            ? Number(totalPriceFirstFloor)
            : 0,
        }));
        setArea(prev => ({
          ...prev,
          areaFirstFloor: areaFirstFloor ? Number(areaFirstFloor) : 0,
        }));
        break;
      case 'Lầu 2':
        setTotalPrice(prev => ({
          ...prev,
          totalPriceSecondFloor: totalPriceSecondFloor
            ? Number(totalPriceSecondFloor)
            : 0,
        }));
        setArea(prev => ({
          ...prev,
          areaSecondFloor: areaSecondFloor ? Number(areaSecondFloor) : 0,
        }));
        break;
      case 'Lầu 3':
        setTotalPrice(prev => ({
          ...prev,
          totalPriceThirdFloor: totalPriceThirdFloor
            ? Number(totalPriceThirdFloor)
            : 0,
        }));
        setArea(prev => ({
          ...prev,
          areaThirdFloor: areaThirdFloor ? Number(areaThirdFloor) : 0,
        }));
        break;
      case 'Lầu 4':
        setTotalPrice(prev => ({
          ...prev,
          totalPriceFourthFloor: totalPriceFourthFloor
            ? Number(totalPriceFourthFloor)
            : 0,
        }));
        setArea(prev => ({
          ...prev,
          areaFourthFloor: areaFourthFloor ? Number(areaFourthFloor) : 0,
        }));
        break;
      case 'Lầu 5':
        setTotalPrice(prev => ({
          ...prev,
          totalPriceFifthFloor: totalPriceFifthFloor
            ? Number(totalPriceFifthFloor)
            : 0,
        }));
        setArea(prev => ({
          ...prev,
          areaFifthFloor: areaFifthFloor ? Number(areaFifthFloor) : 0,
        }));
        break;
      case 'Lầu 6':
        setTotalPrice(prev => ({
          ...prev,
          totalPriceSixthFloor: totalPriceSixthFloor
            ? Number(totalPriceSixthFloor)
            : 0,
        }));
        setArea(prev => ({
          ...prev,
          areaSixthFloor: areaSixthFloor ? Number(areaSixthFloor) : 0,
        }));
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
        params: {Name},
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

      const mapping = priceAreaMap[option.Name as keyof typeof priceAreaMap];
      if (mapping) {
        displayPrice = totalPrice[mapping.priceKey as keyof typeof totalPrice];
        displayArea = area[mapping.areaKey as keyof typeof area];
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
