export interface Construction {
    Items: Item[]
  }
  
  export interface Item {
    Id: string
    Name: string
    Coefficient: number
    Unit: string
    InsDate: string
    UpsDate: string
    Type: string
    SubConstructionItems: SubConstructionItem[]
  }
  
  export interface SubConstructionItem {
    Id: string
    Name: string
    Coefficient: number
    Unit: string
    InsDate: string
  }
  