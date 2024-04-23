import './home.scss';
import { observer } from 'mobx-react-lite';
import rootStore from '../../store/root-store';
import { useEffect } from 'react';
import Map from '../../components/map/map';
import FilterPanel from '../../components/filter-panel/filter-panel';
import { GridLoader } from 'react-spinners';

const HomePage = observer(() => {
  const { atmStore } = rootStore;

  useEffect(() => {
    const fetchInitialData = async () => {
      await atmStore.getAtmData();
    };

    fetchInitialData();
  }, []);

  return (
    <div id="home-page">
      {!atmStore.isLoading ? (
        <div className="map-data-container">
          <div className="map-data-view">
            <div className="left-view">
              {atmStore.governmentData && atmStore.governmentData.result ? (
                <Map />
              ) : null}
            </div>
            <div className="right-view">
              <FilterPanel />
            </div>
          </div>
        </div>
      ) : (
        <GridLoader color="#F6993A" />
      )}
    </div>
  );
});

export default HomePage;
