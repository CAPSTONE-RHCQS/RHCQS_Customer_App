import { useState } from 'react';

export const useConstructionState = () => {
  const [totalPrice, setTotalPrice] = useState({
    totalPriceRoof: 0,
    totalPricePIT: 0,
    totalPriceSubRoof: 0,
    totalPriceOpenRooftop: 0,
    totalPriceMezzanine: 0,
    totalPriceMezzanineVoid: 0,
    totalPriceBasement: 0,
    totalPriceStereobate: 0,
    totalPriceElevatorTechnical: 0,
    totalPriceYard: 0,
    totalPriceGroundFloor: 0,
    totalPriceRooftop: 0,
    totalPriceFirstFloor: 0,
    totalPriceSecondFloor: 0,
    totalPriceThirdFloor: 0,
    totalPriceFourthFloor: 0,
    totalPriceFifthFloor: 0,
    totalPriceSixthFloor: 0,
    totalPriceFirstFloorVoid: 0,
    totalPriceSecondFloorVoid: 0,
    totalPriceThirdFloorVoid: 0,
    totalPriceFourthFloorVoid: 0,
    totalPriceFifthFloorVoid: 0,
    totalPriceSixthFloorVoid: 0,
  });

  const [area, setArea] = useState({
    areaRoof: 0,
    areaPIT: 0,
    areaSubRoof: 0,
    areaOpenRooftop: 0,
    areaMezzanine: 0,
    areaMezzanineVoid: 0,
    areaBasement: 0,
    areaStereobate: 0,
    areaElevatorTechnical: 0,
    areaYard: 0,
    areaGroundFloor: 0,
    areaRooftop: 0,
    areaFirstFloor: 0,
    areaSecondFloor: 0,
    areaThirdFloor: 0,
    areaFourthFloor: 0,
    areaFifthFloor: 0,
    areaSixthFloor: 0,
    areaFirstFloorVoid: 0,
    areaSecondFloorVoid: 0,
    areaThirdFloorVoid: 0,
    areaFourthFloorVoid: 0,
    areaFifthFloorVoid: 0,
    areaSixthFloorVoid: 0,
  });

  return { totalPrice, setTotalPrice, area, setArea };
};