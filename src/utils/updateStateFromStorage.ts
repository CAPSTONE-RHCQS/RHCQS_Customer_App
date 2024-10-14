import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dispatch, SetStateAction } from "react";

export const updateStateFromStorage = async (
    key: string,
    setState: React.Dispatch<React.SetStateAction<any>>,
    stateKey: string
) => {
    const storedValue = await AsyncStorage.getItem(key);
    if (storedValue) {
        setState((prev: any) => ({
            ...prev,
            [stateKey]: parseFloat(storedValue),
        }));
    }
};

export const loadConstructionData = async (
    setTotalPrice: Dispatch<SetStateAction<any>>,
    setArea: Dispatch<SetStateAction<any>>
) => {
    const keys = [
        'totalPriceRoof', 'areaRoof',
        'totalPricePIT', 'areaPIT',
        'totalPriceSubRoof', 'areaSubRoof',
        'totalPriceOpenRooftop', 'areaOpenRooftop',
        'totalPriceMezzanine', 'areaMezzanine',
        'totalPriceYard', 'areaYard',
        'totalPriceElevatorTechnical', 'areaElevatorTechnical',
        'totalPriceBasement', 'areaBasement',
        'totalPriceGroundFloor', 'areaGroundFloor',
        'totalPriceMezzanineVoid', 'areaMezzanineVoid',
        'totalPriceRooftop', 'areaRooftop',
        'totalPriceStereobate', 'areaStereobate',
        'totalPriceFirstFloor', 'areaFirstFloor',
        'totalPriceSecondFloor', 'areaSecondFloor',
        'totalPriceThirdFloor', 'areaThirdFloor',
        'totalPriceFourthFloor', 'areaFourthFloor',
        'totalPriceFifthFloor', 'areaFifthFloor',
        'totalPriceSixthFloor', 'areaSixthFloor',
        'totalPriceFirstFloorVoid', 'areaFirstFloorVoid',
        'totalPriceSecondFloorVoid', 'areaSecondFloorVoid',
        'totalPriceThirdFloorVoid', 'areaThirdFloorVoid',
        'totalPriceFourthFloorVoid', 'areaFourthFloorVoid',
        'totalPriceFifthFloorVoid', 'areaFifthFloorVoid',
        'totalPriceSixthFloorVoid', 'areaSixthFloorVoid',
    ];

    for (let i = 0; i < keys.length; i += 2) {
        await updateStateFromStorage(keys[i], setTotalPrice, keys[i]);
        await updateStateFromStorage(keys[i + 1], setArea, keys[i + 1]);
    }
};