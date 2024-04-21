import './home.scss';
import { observer } from 'mobx-react-lite';
import rootStore from '../../store/root-store';
import { useEffect } from 'react';
import NoLocation from '../../components/no-location/no-location';
import { toJS } from 'mobx';

const HomePage = observer(() => {
  const { atmStore } = rootStore;

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

  useEffect(() => {
    const fetchAtmData = async () => {
      await atmStore.getAtmData(5);
    };

    fetchAtmData();
  }, []);

  useEffect(() => {
    console.log('ATM Data:', toJS(atmStore.atmData));
  }, [atmStore.atmData]);

  return (
    <div id="home-page">
      {!atmStore.isUserLocationEmpty() ? (
        <div className="weather-data-container">
          <div className="weather-data-forecast">
            <div className="left-panel">Hello World</div>
            <div className="right-panel">Hey little Mama</div>
          </div>
        </div>
      ) : (
        <NoLocation />
      )}
    </div>
  );
});

export default HomePage;
