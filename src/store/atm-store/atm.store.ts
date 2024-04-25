import { makeAutoObservable } from 'mobx';
import { AtmApi } from './atm.api';
import { IAtmRecord, IGovernmentData, atmType, bankCode } from './atm.interface';

export const BANK_CODE_LIST = [
  { code: 11, name: 'בנק דיסקונט' },
  { code: 12, name: 'בנק הפועלים' },
  { code: 13, name: 'בנק אגוד' },
  { code: 14, name: 'בנק אוצר החייל' },
  { code: 31, name: 'בנק הבינלאומי' },
];

const OVERSEAS_BANK_LIST = [
  { code: 11, atm_num: '372009' },
  { code: 12, atm_num: '9748' },
  { code: 12, atm_num: '2156' },
  { code: 13, atm_num: '731' },
  { code: 14, atm_num: '3172' },
  { code: 14, atm_num: '3772' }
];

class AtmStore {
  atmApi: AtmApi;

  governmentData: IGovernmentData = {} as IGovernmentData;
  atmData: IAtmRecord[] = [];

  selectedAtmType: atmType = 'all';
  selectedBankCode: bankCode = 'all';
  selectedInput: string = '';

  userLocation: {lat: number, lng: number} | null = null;
  lastCenterSource: 'userLocation' | 'atmLocation' | null = null;

  mapCenter: {lat: number; lng: number} = { lat: 31.0461, lng: 34.8516 };
  mapZoom: number = 7;
  
  isLoading: boolean = true;
  isFilterChanged: boolean = false;

  constructor() {
    makeAutoObservable(this);
    this.atmApi = new AtmApi();
  }

  handleAtmDataSuccess(res: IGovernmentData ) {
    this.governmentData = res; 
    this.setAtmData();   
    this.setIsLoading(false);
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
        const isNotOverseasBank = !OVERSEAS_BANK_LIST.some(bank => Number(bank.atm_num) === record.Atm_Num);
  
        return isUniqueLocation && isInAllowedBanks && isNotOverseasBank;
      });
  }

  filteredAtmData() {
    return this.atmData.filter(record => {
      const matchesInput = this.selectedInput === '' || record.City.includes(this.selectedInput);
      const matchesAtmType = this.selectedAtmType === 'all' || record.ATM_Type === this.selectedAtmType;
      const matchesBankCode = this.selectedBankCode === 'all' || record.Bank_Code === this.selectedBankCode;
      return matchesInput && matchesAtmType && matchesBankCode;
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

  setMapCenter(lat: number, lng: number, source: 'userLocation' | 'atmLocation') {
    if (this.mapCenter.lat !== lat || this.mapCenter.lng !== lng) {
      this.mapCenter = { lat, lng };
      this.lastCenterSource = source;
    }
  }
  
  setMapZoom(zoom: number) {
    if (this.mapZoom !== zoom) {
      this.mapZoom = zoom;
    }
  }
  
  setIsFilterChanged(value: boolean) {
    this.isFilterChanged = value;
  }

  setIsLoading(value: boolean) {
    this.isLoading = value;
  }

}

export default AtmStore;
