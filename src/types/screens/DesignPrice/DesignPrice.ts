export interface DesignPrice {
  Id: string;
  AreaFrom: number;
  AreaTo: number;
  Price: number;
  InsDate: string;
  UpsDate: string;
}

export type DesignPriceResponse = DesignPrice[];
