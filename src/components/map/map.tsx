import { observer } from 'mobx-react-lite';
import rootStore from '../../store/root-store';
import { TileLayer, MapContainer, GeoJSON, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
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
const center = { lat: 31.0461, lng: 34.8516 };

const Map = observer(() => {
  const { atmStore } = rootStore;

  return (
    <MapContainer
      style={{ height: '90vh', width: '65vw' }}
      center={center}
      zoom={7}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {atmStore.createGeoMarkers()?.map((item, index) => (
        <Marker
          key={index}
          position={item?.geocode as [number, number]}
          icon={item?.type === 'משיכת מזומן' ? withdrawalIcon : informationIcon}
        >
          <Popup>
            <h3>{item?.popUp}</h3>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
});

export default Map;
