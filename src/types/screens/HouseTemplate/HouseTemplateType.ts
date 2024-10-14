export interface HouseTemplate {
    Size: number
    Page: number
    Total: number
    TotalPages: number
    Items: Item[]
  }
  
  export interface Item {
    Id: string
    Name: string
    Description: string
    NumberOfFloor: number
    NumberOfBed: number
    NumberOfFront: any
    ImgUrl: string
    InsDate: any
    SubTemplates: SubTemplate[]
    PackageHouses: PackageHouse[]
  }
  
  export interface SubTemplate {
    Id: string
    BuildingArea: number
    FloorArea: number
    InsDate: any
    Size: string
    TemplateItems: TemplateItem[]
  }
  
  export interface TemplateItem {
    Id: string
    ConstructionId: string
    SubConstructionId?: string
    Name: string
    Coefficient: number
    Area: number
    Unit: string
    InsDate: any
  }
  
  export interface PackageHouse {
    Id: string
    PackageId: string
    ImgUrl?: string
    InsDate?: string
  }
  