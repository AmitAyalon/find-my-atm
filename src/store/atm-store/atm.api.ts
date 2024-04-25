import axios from "axios";
import { IGovernmentData } from "./atm.interface";

const API_URL='https://data.gov.il/api/3/action/datastore_search?resource_id=b9d690de-0a9c-45ef-9ced-3e5957776b26'
export class AtmApi {
  async getAtmData(): Promise<IGovernmentData> {
    return axios.get(API_URL)
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        console.error(error);
        return error;
      });
  }
}