import { makeAutoObservable } from 'mobx';
import { AtmApi } from './atm.api';
import { IAtmRecord, IGovernmentData, atmType, bankCode } from './atm.interface';
import { IRestApiResonse } from '../../services/rest-api.interface';

export const BANK_CODE_LIST = [
  { code: 11, name: 'בנק דיסקונט' },
  { code: 12, name: 'בנק הפועלים' },
  { code: 13, name: 'בנק אגוד' },
  { code: 14, name: 'בנק אוצר החייל' },
  { code: 31, name: 'בנק הבינלאומי' },
];

const OVERSEAS_BANK_LIST = [
  { code: 11, address: 'קיבוץ גלויות 5' },
  {code: 12, address: 'אפטר 9' },
  {code: 12, address: 'רחוב ראשי  1692000' },
  { code: 13, address: 'ניסנבאום 33' },
];

class AtmStore {
  atmApi: AtmApi;

  governmentData: IGovernmentData = {} as IGovernmentData;
  atmData: IAtmRecord[] = [];

  selectedAtmType: atmType = 'all';
  selectedBankCode: bankCode = 'all';
  selectedInput: string = '';

  geoMarkers: { geocode: [number, number]; popUp: string }[] = [];
  userLocation: {lat: number, lng: number} | null = null;

  mapCenter: {lat: number; lng: number} = { lat: 31.0461, lng: 34.8516 };
  mapZoom: number = 7;

  isLoading: boolean = false;

  constructor() {
    makeAutoObservable(this);
    this.atmApi = new AtmApi();
  }

  handleAtmDataSuccess(res: IRestApiResonse<IGovernmentData>) {
    this.governmentData = res.data as IGovernmentData; 
    this.setAtmData();   
  }

  handleAtmDataError(error: Error) {
    console.error(error);
  }

  async getAtmData() {
    return this.atmApi.getAtmData()
      .then((res) => {        
        this.handleAtmDataSuccess(res);
      })
      .catch((error) => {
        this.handleAtmDataError(error);
      });
  }

  setAtmData() {
    this.atmData = this.governmentData.result.records
      .filter((record, index, self) => {
        const isUniqueLocation = index === self.findIndex(r =>
          r.X_Coordinate === record.X_Coordinate && r.Y_Coordinate === record.Y_Coordinate
        );
        const isInAllowedBanks = BANK_CODE_LIST.some(bank => bank.code === record.Bank_Code);
        const isNotOverseasBank = !OVERSEAS_BANK_LIST.some(bank => bank.address === record.ATM_Address);
  
        return isUniqueLocation && isInAllowedBanks && isNotOverseasBank;
      });
  }

  filteredAtmData() {
    return this.atmData
      .filter(record => {
        const isInput = this.selectedInput === '' || record.City.includes(this.selectedInput);
        const isAtmType = this.selectedAtmType === 'all' || record.ATM_Type === this.selectedAtmType;
        const isBankCode = this.selectedBankCode === 'all' || record.Bank_Code === this.selectedBankCode;
        return isInput && isAtmType && isBankCode;
      });
  }

  createGeoMarkers() {
    return this.filteredAtmData()
      .filter(record => 
        record.X_Coordinate !== null && record.Y_Coordinate !== null &&
        record.X_Coordinate !== 0 && record.Y_Coordinate !== 0
      )
      .map(record => ({
        geocode: [record.X_Coordinate, record.Y_Coordinate],
        popUp: `${record.Bank_Name} - ${record.ATM_Address}`,
        type: record.ATM_Type,
        id: record._id,
      }));  
  }

  setSelectedAtmType(type: atmType) {
    this.selectedAtmType = type;
  }

  setSelectedBankCode(code: bankCode) {
    this.selectedBankCode = code;
  }

  setSelectedInput(input: string) {
    this.selectedInput = input;
  }

  setUserLocation(lat: number, lng: number) {
    this.userLocation = { lat, lng };
  }

  setMapCenter(lat: number, lng: number) {
    this.mapCenter = { lat, lng };
  }

  setMapZoom(zoom: number) {
    this.mapZoom = zoom;
  }

  setIsLoading(value: boolean) {
    this.isLoading = value;
  }

}

export default AtmStore;
