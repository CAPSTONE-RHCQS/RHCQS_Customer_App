// export const getElevatorTechnical = (state: any) => state.detailConstruction.elevatorTechnical;
// export const getPIT = (state: any) => state.detailConstruction.PIT;
// export const getYard = (state: any) => state.detailConstruction.Yard;
// export const getBasement = (state: any) => state.detailConstruction.basement;
// export const getGroundFloor = (state: any) => state.detailConstruction.GroundFloor;
// export const getMezzanine = (state: any) => state.detailConstruction.Mezzanine;
// export const getMezzanineVoid = (state: any) => state.detailConstruction.MezzanineVoid;
// export const getOpenRooftop = (state: any) => state.detailConstruction.OpenRooftop;
// export const getRooftop = (state: any) => state.detailConstruction.Rooftop;
// export const getStereobate = (state: any) => state.detailConstruction.stereobate;
// export const getRoof = (state: any) => state.detailConstruction.Roof;
// export const getSubRoof = (state: any) => state.detailConstruction.SubRoof;
// export const getFirstFloor = (state: any) => state.detailConstruction.FirstFloor;
// export const getSecondFloor = (state: any) => state.detailConstruction.SecondFloor;
// export const getThirdFloor = (state: any) => state.detailConstruction.ThirdFloor;
// export const getFourthFloor = (state: any) => state.detailConstruction.FourthFloor;
// export const getFifthFloor = (state: any) => state.detailConstruction.FifthFloor;
// export const getSixthFloor = (state: any) => state.detailConstruction.SixthFloor;
// export const getFirstFloorVoid = (state: any) => state.detailConstruction.FirstFloorVoid;
// export const getSecondFloorVoid = (state: any) => state.detailConstruction.SecondFloorVoid;
// export const getThirdFloorVoid = (state: any) => state.detailConstruction.ThirdFloorVoid;
// export const getFourthFloorVoid = (state: any) => state.detailConstruction.FourthFloorVoid;
// export const getFifthFloorVoid = (state: any) => state.detailConstruction.FifthFloorVoid;
// export const getSixthFloorVoid = (state: any) => state.detailConstruction.SixthFloorVoid;


// export const DetailContructionSelector = [getBasement, getStereobate, getElevatorTechnical, getPIT, getYard, getGroundFloor, getMezzanine, getMezzanineVoid, getOpenRooftop, getRooftop, getRoof, getSubRoof, getFirstFloor, getSecondFloor, getThirdFloor, getFourthFloor, getFifthFloor, getSixthFloor, getFirstFloorVoid, getSecondFloorVoid, getThirdFloorVoid, getFourthFloorVoid, getFifthFloorVoid, getSixthFloorVoid];


export const DetailContructionSelector = (state: any) => state.detailContruction.detailConstructions;

// 'Phòng kỹ thuật thang máy': 'ElevatorTechnical',
// 'Hố PIT': 'PIT',
// 'Sân': 'Yard',
// 'Hầm': 'Basement',
// 'Trệt': 'GroundFloor',
// 'Tầng lửng': 'Mezzanine',
// 'Thông tầng lửng': 'MezzanineVoid',
// 'Sân thượng không có mái che': 'OpenRooftop',
// 'Sân thượng có mái che': 'Rooftop',
// 'Móng': 'Stereobate',
// 'Mái che': 'Roof',
// 'Mái phụ': 'SubRoof',
// 'Lầu 1': 'FirstFloor',
// 'Lầu 2': 'SecondFloor',
// 'Lầu 3': 'ThirdFloor',
// 'Lầu 4': 'FourthFloor',
// 'Lầu 5': 'FifthFloor',
// 'Lầu 6': 'SixthFloor',
// 'Thông Tầng lầu 1': 'FirstFloorVoid',
// 'Thông Tầng lầu 2': 'SecondFloorVoid',
// 'Thông Tầng lầu 3': 'ThirdFloorVoid',
// 'Thông Tầng lầu 4': 'FourthFloorVoid',
// 'Thông Tầng lầu 5': 'FifthFloorVoid',
// 'Thông Tầng lầu 6': 'SixthFloorVoid',