import { ConstructionStackParamList } from "../../TypeScreen";

const constructionScreenMap: Record<string, keyof ConstructionStackParamList> = {
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
  
  export default constructionScreenMap;

  
  