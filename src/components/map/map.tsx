import { observer } from 'mobx-react-lite';
import rootStore from '../../store/root-store';
import { TileLayer, MapContainer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect } from 'react';

const withdrawalIcon = new L.Icon({
  iconUrl: './location-orange.png',
  iconSize: [28, 28],
});
const informationIcon = new L.Icon({
  iconUrl: './location-blue.png',
  iconSize: [28, 28],
});

const Map = observer(() => {
  const { atmStore } = rootStore;

  useEffect(() => {
    const fetchUserLocation = () => {
      if (!navigator.geolocation) {
        console.error('Geolocation is not supported by this browser.');
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          atmStore.setUserLocation(latitude, longitude);
          atmStore.setMapCenter(latitude, longitude, 'userLocation');
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    };

    fetchUserLocation();
  }, []);

  const MapEffect = () => {
    const map = useMap();

    useEffect(() => {
      if (!atmStore.mapCenter.lat && !atmStore.mapCenter.lng) {
        return;
      }

      switch (atmStore.lastCenterSource) {
        case 'userLocation':
          console.log('user location set');
          map.setView(
            [
              atmStore.userLocation?.lat as number,
              atmStore.userLocation?.lng as number,
            ],
            14
          );
          break;
        case 'atmLocation':
          console.log('atm location set');
          map.setView(
            [atmStore.mapCenter.lat, atmStore.mapCenter.lng],
            atmStore.mapZoom
          );
          break;
        default:
          map.setView(
            [atmStore.mapCenter.lat, atmStore.mapCenter.lng],
            atmStore.mapZoom
          );
      }
    }, [atmStore.mapCenter, atmStore.lastCenterSource]);

    return null;
  };

  return (
    <MapContainer
      style={{ height: '90vh', width: '65vw' }}
      center={atmStore.mapCenter}
      zoom={atmStore.mapZoom}
      scrollWheelZoom={true}
    >
      <MapEffect />
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {atmStore.createGeoMarkers()?.map((item, index) => {
        return (
          <Marker
            key={index}
            position={item?.geocode as [number, number]}
            icon={
              item?.type === 'משיכת מזומן' ? withdrawalIcon : informationIcon
            }
          >
            <Popup>
              <h3>{item?.popUp}</h3>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
});

export default Map;
