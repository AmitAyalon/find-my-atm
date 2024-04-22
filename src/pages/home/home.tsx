import './home.scss';
import { observer } from 'mobx-react-lite';
import rootStore from '../../store/root-store';
import { useEffect } from 'react';
import NoLocation from '../../components/no-location/no-location';
import Map from '../../components/map/map';
import FilterPanel from '../../components/filter-panel/filter-panel';

const HomePage = observer(() => {
  const { atmStore } = rootStore;

  useEffect(() => {
    const fetchInitialData = async () => {
      await atmStore.getAtmData();
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            atmStore.setUserLocation(latitude, longitude);
          },
          (error) => {
            console.error('Error getting user location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    getUserLocation();
  }, []);

  return (
    <div id="home-page">
      {!atmStore.isUserLocationEmpty() ? (
        <div className="weather-data-container">
          <div className="weather-data-forecast">
            <div className="left-panel">
              {atmStore.governmentData && atmStore.governmentData.result ? (
                <Map />
              ) : null}
            </div>
            <div className="right-panel">
              <FilterPanel />
            </div>
          </div>
        </div>
      ) : (
        <NoLocation />
      )}
    </div>
  );
});

export default HomePage;
