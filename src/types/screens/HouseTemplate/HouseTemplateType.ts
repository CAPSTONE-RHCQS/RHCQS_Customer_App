export interface HouseTemplate {
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
  ExteriorsUrls: ExteriorsUrl[]
}

export interface SubTemplate {
  Id: string
  BuildingArea: number
  FloorArea: number
  InsDate: any
  Size: string
  Url: string
  TemplateItems: TemplateItem[]
  Designdrawings: Designdrawing[]
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

export interface Designdrawing {
  Id: string
  Name: string
  Url: string
  InsDate: string
  UpsDate: string
}

export interface PackageHouse {
  Id: string
  PackageId: string
  PackageName: string
  ImgUrl: string
  InsDate: string
}

export interface ExteriorsUrl {
  Id: string
  Name: string
  Url: string
  InsDate: string
  UpsDate: string
}
