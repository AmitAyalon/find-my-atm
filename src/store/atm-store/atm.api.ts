import { IPromiseResponse } from "../../services/rest-api.interface";
import RestApi from "../../services/rest-api.service";
import { IGovernmentData } from "./atm.interface";

export class AtmApi extends RestApi {
  constructor() {
    super("https://data.gov.il/api/3/action/datastore_search?resource_id=b9d690de-0a9c-45ef-9ced-3e5957776b26");
  }

  getAtmByCity(city: string): IPromiseResponse<IGovernmentData> {
    return this.get(`&q?=${city}`);
  }

  getAtmData(): IPromiseResponse<IGovernmentData> {
    return this.get("");
  }
}