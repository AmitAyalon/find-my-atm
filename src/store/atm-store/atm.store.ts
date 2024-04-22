import { makeAutoObservable } from 'mobx';
import { AtmApi } from './atm.api';
import { IAtmRecord, IGovernmentData } from './atm.interface';
import { IRestApiResonse } from '../../services/rest-api.interface';

const BANK_CODE_LIST = [
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
  geoMarkers: { geocode: [number, number]; popUp: string }[] = [];
  userLocation: {lat: number, lng: number} = {
    lat: 0,
    lng: 0,
  };

  constructor() {
    makeAutoObservable(this);
    this.atmApi = new AtmApi();
  }

  handleAtmDataSuccess(res: IRestApiResonse<IGovernmentData>) {
    this.governmentData = res.data as IGovernmentData; 
    this.setAtmDataByBankCode();   
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

  setAtmDataByBankCode() {
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
  

  createGeoMarkers() {
    return this.atmData
      .filter(record => 
        record.X_Coordinate !== null && record.Y_Coordinate !== null &&
        !(record.X_Coordinate === 0 && record.Y_Coordinate === 0)
      )
      .map(record => ({
        geocode: [record.X_Coordinate, record.Y_Coordinate],
        popUp: `${record.Bank_Name} - ${record.ATM_Address} - ${record.X_Coordinate} - ${record.Y_Coordinate}`,
        type: record.ATM_Type,
        id: record._id,
      }));  
  }
  

  async getAtmByCity(city: string) {
    return this.atmApi
      .getAtmByCity(city)
      .then((res) => {
        this.governmentData = res.data!;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  setUserLocation(lat: number, lng: number) {
    this.userLocation = { lat, lng };
  }

  isUserLocationEmpty() {
    return this.userLocation.lat === 0 && this.userLocation.lng === 0;
  }
}

export default AtmStore;
