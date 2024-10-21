export interface Item {
    Id: string;
    SectionId: string;
    Name: string;
    Coefficient: number;
    InsDate: string;
    UpsDate: string;
}

export interface Section {
    Id: string;
    Name: string;
    Deflag: boolean;
    InsDate: string;
    UpsDate: string;
    Description?: string;
    Items?: Item[] | null;
}

export interface Ultilities {
    Id: string;
    Name: string;
    Type: string;
    Deflag: boolean;
    InsDate: string;
    UpsDate: string;
    Sections: Section[];
}
