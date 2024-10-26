import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppStackParamList } from '../types/TypeScreen';
import TabNavigation from './TabNavigation';
import UltilitiesScreen from '../screens/InitialQuotationScreen/Ultilities/UltilitiesScreen';
import ConstructionScreen from '../screens/InitialQuotationScreen/Contruction/ConstructionScreen';
import Package from '../screens/Package/Package';
import HouseLibrary from '../screens/HouseDesginTemplate/HouseLibrary';
import ConfirmInformation from '../screens/InitialQuotationScreen/ConfirmInformation';
import HistoryScreen from '../screens/HistoryScreen/HistoryScreen';
import TrackingScreen from '../screens/HistoryScreen/TrackingScreen';
import VersionScreen from '../screens/HistoryScreen/InitialQuotation/VersionScreen';
import VersionDetail from '../screens/HistoryScreen/InitialQuotation/VersionDetail';
import DetailContruction from '../screens/InitialQuotationScreen/Contruction/DetailContruction';
import DetailUltilities from '../screens/InitialQuotationScreen/Ultilities/DetailUltilities';
import HouseExternalView from '../screens/HouseDesginTemplate/HouseExternalView';
import HouseResidentialArea from '../screens/HouseDesginTemplate/HouseResidentialArea';
import HousePackageTemplate from '../screens/HouseDesginTemplate/HousePackageTemplate';
import BlogList from '../screens/Blog/BlogList';
import BlogDetail from '../screens/Blog/BlogDetail';
import TrackingDesignContact from '../screens/HistoryScreen/HouseDesignDrawing/TrackingDesignContact';
import ContactDesignScreen from '../screens/HistoryScreen/HouseDesignDrawing/ContactDesign/ContactDesignScreen';
import DetailVersionDesign from '../screens/HistoryScreen/HouseDesignDrawing/HouseDesignDetail/DetailVersionDesign';
import TrackingVersionDesign from '../screens/HistoryScreen/HouseDesignDrawing/HouseDesignDetail/TrackingVersionDesign';
import UltilitiesHouse from '../screens/HouseDesginTemplate/UltilitiesHouse';
import ConfirmInformationHouseTemplate from '../screens/HouseDesginTemplate/ConfirmInformationHouseTempalte';
import DetailUltilitiesHouse from '../screens/HouseDesginTemplate/DetailUltilitiesHouse';

const Stack = createNativeStackNavigator<AppStackParamList>();

const AppStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Home */}
      <Stack.Screen name="HomeScreen" component={TabNavigation} />
      {/* Initial Quotation */}
      {/* Construction */}  
      <Stack.Screen name="ConstructionScreen" component={ConstructionScreen} />
      <Stack.Screen name="DetailContruction" component={DetailContruction} />
      {/* Ultilities */}
      <Stack.Screen name="UltilitiesScreen" component={UltilitiesScreen} />
      <Stack.Screen name="DetailUltilities" component={DetailUltilities} />
      <Stack.Screen name="ConfirmInformation" component={ConfirmInformation} />
      {/* Package */}
      <Stack.Screen name="Package" component={Package} />
      {/* House Library */}
      <Stack.Screen name="HouseLibrary" component={HouseLibrary} />
      <Stack.Screen name="HouseExternalView" component={HouseExternalView} />
      <Stack.Screen name="HouseResidentialArea" component={HouseResidentialArea} />
      <Stack.Screen name="HousePackageTemplate" component={HousePackageTemplate} />
      <Stack.Screen name="UltilitiesHouse" component={UltilitiesHouse} />
      <Stack.Screen name="ConfirmInformationHouseTemplate" component={ConfirmInformationHouseTemplate} />
      <Stack.Screen name="DetailUltilitiesHouse" component={DetailUltilitiesHouse} />
      {/* History */}
      <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
      <Stack.Screen name="TrackingScreen" component={TrackingScreen} />
      <Stack.Screen name="VersionScreen" component={VersionScreen} />
      <Stack.Screen name="VersionDetail" component={VersionDetail} />
      <Stack.Screen name="TrackingDesignContact" component={TrackingDesignContact} />
      <Stack.Screen name="ContactDesignScreen" component={ContactDesignScreen} />
      <Stack.Screen name="DetailVersionDesign" component={DetailVersionDesign} />
      <Stack.Screen name="TrackingVersionDesign" component={TrackingVersionDesign} />

      {/* Blog */}
      <Stack.Screen name="BlogList" component={BlogList} />
      <Stack.Screen name="BlogDetail" component={BlogDetail} />

    </Stack.Navigator>
  );
};

export default AppStack;