import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
};

export type AppStackParamList = {
  HomeScreen: undefined;
  ConstructionScreen: {
    //totalPrice
    totalPricePIT?: number; //hố pit
    totalPrice?: number; //mái che
    totalPriceSubRoof?: number; //mái phụ
    totalPriceStereobate?: number; // móng
    totalPriceBasement?: number; //trệt
    totalPriceYard?: number; //sân
    totalPriceElevatorTechnical?: number; //thang máy
    totalPriceGroundFloor?: number; //thông tầng
    totalPriceMezzanine?: number; //tầng lửng
    totalPriceMezzanineVoid?: number; //thông tầng lửng
    totalPriceOpenRooftop?: number; // tâng thượng mái che
    totalPriceCoveredRooftop?: number; //tầng thượng ko có mái che
    //totalPriceFloor
    totalPriceFirstFloor?: number; //lầu 1
    totalPriceSecondFloor?: number; //lầu 2
    totalPriceThirdFloor?: number; //lầu 3
    totalPriceFourthFloor?: number; //lầu 4
    totalPriceFifthFloor?: number; //lầu 5
    totalPriceSixthFloor?: number; //lầu 6
    //totalPriceFloorVoid
    totalPriceFirstFloorVoid?: number; //thông tầng lầu 1
    totalPriceSecondFloorVoid?: number; //thông tầng lầu 2
    totalPriceThirdFloorVoid?: number; //thông tầng lầu 3
    totalPriceFourthFloorVoid?: number; //thông tầng lầu 4
    totalPriceFifthFloorVoid?: number; //thông tầng lầu 5
    totalPriceSixthFloorVoid?: number; //thông tầng lầu 6


    //area
    area?: number; //mái che
    areaPIT?: number; //hố pit
    areaSubRoof?: number; //mái phụ
    areaStereobate?: number; //móng
    areaBasement?: number; //trệt
    areaYard?: number; //sân
    areaElevatorTechnical?: number; //thang máy
    areaGroundFloor?: number; //thông tầng
    areaMezzanine?: number; //tầng lửng
    areaMezzanineVoid?: number; //thông tầng lửng
    areaOpenRooftop?: number; //tầng thượng mái che
    areaCoveredRooftop?: number; //tầng thượng ko có mái che
    //areaFloor
    areaFirstFloor?: number; //lầu 1
    areaSecondFloor?: number; //lầu 2
    areaThirdFloor?: number; //lầu 3
    areaFourthFloor?: number; //lầu 4
    areaFifthFloor?: number; //lầu 5
    areaSixthFloor?: number; //lầu 6
    //areaFloorVoid 
    areaFirstFloorVoid?: number; //thông tầng lầu 1
    areaSecondFloorVoid?: number; //thông tầng lầu 2
    areaThirdFloorVoid?: number; //thông tầng lầu 3
    areaFourthFloorVoid?: number; //thông tầng lầu 4
    areaFifthFloorVoid?: number; //thông tầng lầu 5
    areaSixthFloorVoid?: number; //thông tầng lầu 6


    selectedRough?: string | null;
    selectedComplete?: string | null;
    roughPackagePrice?: number | null;
    completePackagePrice?: number | null;
    source?: 'Mái che' | 'Hố PIT' | 'Sân' | 'Hầm' | 'Trệt' | 'Tầng lửng' | 'Thông tầng lửng' | 'Sân thượng không có mái che' | 'Sân thượng có mái che' | 'Móng' | 'Mái che' | 'Mái phụ' | 'Lầu 1' | 'Lầu 2' | 'Lầu 3' | 'Lầu 4' | 'Lầu 5' | 'Lầu 6' | 'Thông Tầng lầu 1' | 'Thông Tầng lầu 2' | 'Thông Tầng lầu 3' | 'Thông Tầng lầu 4' | 'Thông Tầng lầu 5' | 'Thông Tầng lầu 6';
  };
  UltilitiesScreen: undefined;
  ConstructionStack: { screen: keyof ConstructionStackParamList; params: { Name: string } };
  Package: undefined;
};

export type ConstructionStackParamList = {
  // Construction
  ElevatorTechnical: { Name: string };
  PIT: { Name: string };
  Yard: { Name: string };
  Basement: { Name: string };
  GroundFloor: { Name: string };
  Mezzanine: { Name: string };
  MezzanineVoid: { Name: string };
  OpenRooftop: { Name: string };
  Rooftop: { Name: string };
  Stereobate: { Name: string };
  Roof: { Name: string };
  SubRoof: { Name: string };
  // Construction Floor
  FirstFloor: { Name: string };
  SecondFloor: { Name: string };
  ThirdFloor: { Name: string };
  FourthFloor: { Name: string };
  FifthFloor: { Name: string };
  SixthFloor: { Name: string };
  // Construction Floor Void
  FirstFloorVoid: { Name: string };
  SecondFloorVoid: { Name: string };
  ThirdFloorVoid: { Name: string };
  FourthFloorVoid: { Name: string };
  FifthFloorVoid: { Name: string };
  SixthFloorVoid: { Name: string };
};

export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type AppStackNavigationProp = NativeStackNavigationProp<AppStackParamList>;
export type ConstructionStackNavigationProp = NativeStackNavigationProp<ConstructionStackParamList>;