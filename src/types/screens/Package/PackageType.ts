export interface Package {
    Size: number
    Page: number
    Total: number
    TotalPages: number
    Items: Item[]
  }
  
  export interface Item {
    Id: string
    PackageTypeId: string
    PackageName: string
    Unit: string
    Price: number
    Status: string
    InsDate: string
    UpsDate: string
    PackageDetails: PackageDetail[]
    PackageHouses: PackageHouse[]
    PackageType: PackageType
  }
  
  export interface PackageDetail {
    Id: string
    Action: any
    Type: string
    InsDate: any
    PackageLabors: PackageLabor[]
    PackageMaterials: PackageMaterial[]
  }
  
  export interface PackageLabor {
    Id: string
    LaborId: string
    NameOfLabor: string
    TotalPrice: number
    Quantity: number
    InsDate: any
  }
  
  export interface PackageMaterial {
    Id: string
    MaterialSectionId: string
    MaterialSectionName: string
    MaterialnName: string
    InventoryQuantity: number
    Price: number
    Unit: string
    Size: string
    Shape: string
    ImgUrl: any
    Description: any
    InsDate: any
  }
  
  export interface PackageHouse {
    Id: string
    DesignTemplateId: string
    ImgUrl: any
    InsDate: any
  }
  
  export interface PackageType {
    Id: string
    Name: string
    InsDate: any
  }
  