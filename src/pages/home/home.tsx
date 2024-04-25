import { styled } from '@mui/material/styles';
import { observer } from 'mobx-react-lite';
import rootStore from '../../store/root-store';
import { useEffect } from 'react';
import Map from '../../components/map/map';
import FilterPanel from '../../components/filter-panel/filter-panel';
import CircularProgress from '@mui/material/CircularProgress';

const HomePageContainer = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '3rem',
}));

const MapDataContainer = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '1rem',
  border: `4px solid #202b3b`,
  borderRadius: '1rem',
}));

const MapDataView = styled('div')(() => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  height: '90vh',
  width: '90vw',
}));

const LeftView = styled('div')({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const RightView = styled('div')(() => ({
  height: '100%',
  backgroundColor: 'white',
  width: '25vw',
  padding: '0.75rem',
  boxShadow: '-30px 0px 20px -60px rgba(255,255,255,0.45)',
}));

const HomePage = observer(() => {
  const { atmStore } = rootStore;

  useEffect(() => {
    const fetchInitialData = async () => {
      await atmStore.getAtmData();
    };

    fetchInitialData();
  }, []);

  return (
    <HomePageContainer>
      {!atmStore.isLoading ? (
        <MapDataContainer>
          <MapDataView>
            <LeftView>
              {atmStore.governmentData && atmStore.governmentData.result ? (
                <Map />
              ) : null}
            </LeftView>
            <RightView>
              <FilterPanel />
            </RightView>
          </MapDataView>
        </MapDataContainer>
      ) : (
        <CircularProgress color="primary" />
      )}
    </HomePageContainer>
  );
});

export default HomePage;
