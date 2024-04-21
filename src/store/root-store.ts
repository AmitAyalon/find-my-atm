import AtmStore from './atm-store/atm.store';

export interface IRootStore {
  atmStore: AtmStore;
}
class RootStore implements IRootStore {
  atmStore: AtmStore;
  constructor() {
    this.atmStore = new AtmStore();
  }
}

const rootStore = new RootStore();
export default rootStore;
