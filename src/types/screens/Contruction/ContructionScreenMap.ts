import { ConstructionStackParamList } from "../../TypeScreen";

export const constructionScreenMap: Record<string, keyof ConstructionStackParamList> = {
  'Phòng kỹ thuật thang máy': 'ElevatorTechnical',
  'Hố PIT': 'PIT',
  'Sân': 'Yard',
  'Hầm': 'Basement',
  'Trệt': 'GroundFloor',
  'Tầng lửng': 'Mezzanine',
  'Thông tầng lửng': 'MezzanineVoid',
  'Sân thượng không có mái che': 'OpenRooftop',
  'Sân thượng có mái che': 'Rooftop',
  'Móng': 'Stereobate',
  'Mái che': 'Roof',
  'Mái phụ': 'SubRoof',
  'Lầu 1': 'FirstFloor',
  'Lầu 2': 'SecondFloor',
  'Lầu 3': 'ThirdFloor',
  'Lầu 4': 'FourthFloor',
  'Lầu 5': 'FifthFloor',
  'Lầu 6': 'SixthFloor',
  'Thông Tầng lầu 1': 'FirstFloorVoid',
  'Thông Tầng lầu 2': 'SecondFloorVoid',
  'Thông Tầng lầu 3': 'ThirdFloorVoid',
  'Thông Tầng lầu 4': 'FourthFloorVoid',
  'Thông Tầng lầu 5': 'FifthFloorVoid',
  'Thông Tầng lầu 6': 'SixthFloorVoid',
};


export const priceAreaMap = {
  'Mái che': { priceKey: 'totalPriceRoof', areaKey: 'areaRoof' },
  'Hố PIT': { priceKey: 'totalPricePIT', areaKey: 'areaPIT' },
  'Mái phụ': { priceKey: 'totalPriceSubRoof', areaKey: 'areaSubRoof' },
  'Sân thượng không có mái che': { priceKey: 'totalPriceOpenRooftop', areaKey: 'areaOpenRooftop' },
  'Phòng kỹ thuật thang máy': { priceKey: 'totalPriceElevatorTechnical', areaKey: 'areaElevatorTechnical' },
  'Hầm': { priceKey: 'totalPriceBasement', areaKey: 'areaBasement' },
  'Tầng lửng': { priceKey: 'totalPriceMezzanine', areaKey: 'areaMezzanine' },
  'Thông Tầng lửng': { priceKey: 'totalPriceMezzanineVoid', areaKey: 'areaMezzanineVoid' },
  'Móng': { priceKey: 'totalPriceStereobate', areaKey: 'areaStereobate' },
  'Sân': { priceKey: 'totalPriceYard', areaKey: 'areaYard' },
  'Sân thượng có mái che': { priceKey: 'totalPriceRooftop', areaKey: 'areaRooftop' },
  'Trệt': { priceKey: 'totalPriceGroundFloor', areaKey: 'areaGroundFloor' },
  'Thông Tầng lầu 1': { priceKey: 'totalPriceFirstFloorVoid', areaKey: 'areaFirstFloorVoid' },
  'Thông Tầng lầu 2': { priceKey: 'totalPriceSecondFloorVoid', areaKey: 'areaSecondFloorVoid' },
  'Thông Tầng lầu 3': { priceKey: 'totalPriceThirdFloorVoid', areaKey: 'areaThirdFloorVoid' },
  'Thông Tầng lầu 4': { priceKey: 'totalPriceFourthFloorVoid', areaKey: 'areaFourthFloorVoid' },
  'Thông Tầng lầu 5': { priceKey: 'totalPriceFifthFloorVoid', areaKey: 'areaFifthFloorVoid' },
  'Thông Tầng lầu 6': { priceKey: 'totalPriceSixthFloorVoid', areaKey: 'areaSixthFloorVoid' },
  'Lầu 1': { priceKey: 'totalPriceFirstFloor', areaKey: 'areaFirstFloor' },
  'Lầu 2': { priceKey: 'totalPriceSecondFloor', areaKey: 'areaSecondFloor' },
  'Lầu 3': { priceKey: 'totalPriceThirdFloor', areaKey: 'areaThirdFloor' },
  'Lầu 4': { priceKey: 'totalPriceFourthFloor', areaKey: 'areaFourthFloor' },
  'Lầu 5': { priceKey: 'totalPriceFifthFloor', areaKey: 'areaFifthFloor' },
  'Lầu 6': { priceKey: 'totalPriceSixthFloor', areaKey: 'areaSixthFloor' },
};


// Phòng kỹ thuật thang máy
// Hố PIT
// Sân
// Hầm
// Trệt
// Tầng lửng
// Thông tầng lửng
// Sân thượng không có mái che
// Sân thượng có mái che
// Móng
// Mái che
// Mái phụ
// Lầu 1
// Lầu 2
// Lầu 3
// Lầu 4
// Lầu 5
// Lầu 6
// Thông Tầng lầu 1
// Thông Tầng lầu 2
// Thông Tầng lầu 3
// Thông Tầng lầu 4
// Thông Tầng lầu 5
// Thông Tầng lầu 6
