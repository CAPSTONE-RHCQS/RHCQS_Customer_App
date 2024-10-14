import { Dispatch, SetStateAction } from 'react';

export const updatePriceAndArea = (
    setTotalPrice: Dispatch<SetStateAction<any>>,
    setArea: Dispatch<SetStateAction<any>>,
    priceKey: string,
    areaKey: string,
    priceValue: number | undefined,
    areaValue: number | undefined
) => {
    setTotalPrice((prev: any) => ({
        ...prev,
        [priceKey]: priceValue ? Number(priceValue) : 0,
    }));
    setArea((prev: any) => ({
        ...prev,
        [areaKey]: areaValue ? Number(areaValue) : 0,
  }));
};

export default updatePriceAndArea;
