export type atmType = 'withdrawal' | 'information' | 'all';

export interface IGovernmentData {
  help: string
  success: boolean
  result: IGovernmentResult
}

export interface IGovernmentResult {
  include_total: boolean
  limit: number
  records_format: string
  resource_id: string
  total_estimation_threshold: number
  records: IAtmRecord[]
  _links: {
    start: string
    next: string
  }
  total: number
  total_was_estimated: boolean
}

export interface IAtmRecord {
  _id: number
  Bank_Code: number
  Bank_Name: string
  Branch_Code: number
  Atm_Num: number
  ATM_Address: string
  ATM_Address_Extra: string
  City: string
  Commission: string
  ATM_Type: string
  ATM_Location: string
  Handicap_Access: string
  X_Coordinate: number
  Y_Coordinate: number
}

