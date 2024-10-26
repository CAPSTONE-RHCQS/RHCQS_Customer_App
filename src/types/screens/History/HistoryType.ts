// Project History
export interface ProjectHistory {
  Id: string
  AccountName: string
  Name: string
  Type: string
  Status: string
  InsDate: string
  UpsDate: string
  ProjectCode: string
}

// Response Status
type ResponseStatus = 'Pending' | 'Processing' | 'Finalized' | 'Canceled';

interface Response {
  Status: ResponseStatus;
}

// Tracking Response
export interface TrackingType {
  InitialResponse: Response;
  ContractDesignResponse: Response | null;
  FinalAppResponse: Response | null;
  ContractProcessingResponse: Response | null;
}

// Contact Design Response
export interface ContactDesignType {
  Id: string;
  File: string;
}

// Version Initial Quotation Response
export interface VersionType {
  Status: string;
  Id: string;
  Version: string;
  File: string;
}

// Version Design Detail Response
export interface TrackingVersionDesignType {
  Id: string
  ProjectId: string
  Name: string
  Step: number
  Status: string
  Type: string
  IsCompany: boolean
  InsDate: string;
  Versions: Version[];
}
// Version Design Detail Response
export interface Version {
  Id: string
  Name: string
  Version: number
  FileUrl: string
  Status: string
  InsDate: string
  PreviousDrawingId: any
  NamePrevious: any
  Note?: string
}


