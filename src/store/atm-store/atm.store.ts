import { makeAutoObservable } from 'mobx';
import { AtmApi } from './atm.api';
import { IGovResponse } from './atm.interface';

class AtmStore {
  atmApi: AtmApi;

  atmData: any = {};
  userLocation: {lat: number, lng: number} = {
    lat: 0,
    lng: 0,
  };

  constructor() {
    makeAutoObservable(this);
    this.atmApi = new AtmApi();
  }

  async getAtmData(limit: number) {
    return this.atmApi.getAtmData(limit)
      .then((res) => {        
        this.atmData = res.data;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async getAtmByCity(city: string) {
    return this.atmApi
      .getAtmByCity(city)
      .then((res) => {
        this.atmData = res.data!;
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
