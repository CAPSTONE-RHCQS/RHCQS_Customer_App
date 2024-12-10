export interface Package {
  Id: string;
  PackageName: string;
  PackageType: string;
  Unit: string;
  Price: number;
  Status: string;
  InsDate: string;
  UpsDate: string;
  PackageLabors: any[];
  PackageMaterials: PackageMaterial[];
  PackageMapPromotions: any[];
  WorkTemplates: WorkTemplate[];
}

export interface PackageLabor {
  Id: string;
  LaborId: string;
  NameOfLabor: string;
  Type: string;
  Price: number;
  InsDate: string;
}

export interface PackageMaterial {
  Id: string;
  MaterialId: string;
  MaterialSectionId: string;
  MaterialSectionName: string;
  MaterialName: string;
  Type: string;
  Price: number;
  Unit: string;
}

export interface WorkTemplate {
  Id: string;
  ConstructionWorkId: string;
  ConstructionWorkName: string;
  LaborCost: number;
  MaterialCost: number;
  MaterialFinishedCost: number;
}
