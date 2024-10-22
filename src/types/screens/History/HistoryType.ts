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

type ResponseStatus = 'Pending' | 'Processing' | 'Finalized' | 'Canceled';

interface Response {
  Status: ResponseStatus;
}

export interface TrackingType {
  InitialResponse: Response;
  ContractDesignResponse: Response | null;
  FinalAppResponse: Response | null;
  ContractProcessingResponse: Response | null;
}

export interface VersionType {
  Id: string;
  Version: string;
  File: string;
}

