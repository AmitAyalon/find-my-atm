import './filter-panel.scss';
import { observer } from 'mobx-react-lite';
import rootStore from '../../store/root-store';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { FormControl, InputLabel } from '@mui/material';
import { BANK_CODE_LIST } from '../../store/atm-store/atm.store';
import { atmType, bankCode } from '../../store/atm-store/atm.interface';

const FilterPanel = observer(() => {
  const { atmStore } = rootStore;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    atmStore.setSelectedInput(event.target.value);
  };

  const handleBankChange = (event: SelectChangeEvent) => {
    atmStore.setSelectedBankCode(event.target.value as bankCode);
  };

  const handleTypeChange = (event: SelectChangeEvent) => {
    atmStore.setSelectedAtmType(event.target.value as atmType);
  };

  const handleAtmClick = (center: { lat: number; lng: number }) => {
    if (
      atmStore.mapCenter.lat === center.lat &&
      atmStore.mapCenter.lng === center.lng
    ) {
      atmStore.setMapCenter(31.0461, 34.8516, 'atmLocation');
      atmStore.setMapZoom(7);
      return;
    }
    atmStore.setMapCenter(center.lat, center.lng, 'atmLocation');
    atmStore.setMapZoom(14);
  };

  return (
    <div id="filter-panel">
      <div className="atm-filters">
        <Paper
          className="search-bar"
          elevation={0}
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <InputBase
            sx={{ mr: 1, flex: 1 }}
            dir="rtl"
            placeholder="חיפוש לפי עיר"
            onChange={handleInputChange}
          />
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
          <IconButton type="button" sx={{ p: '8px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>
        <div className="select-container">
          <FormControl sx={{ width: '100%' }} size="small" dir="rtl">
            <InputLabel id="select-type-label">כל סוגי הבנקטים</InputLabel>
            <Select
              labelId="select-type-label"
              id="mui-select"
              value={atmStore.selectedAtmType}
              label="כל סוגי הבנקטים"
              onChange={handleTypeChange}
            >
              <MenuItem value="all">
                <em>הכל</em>
              </MenuItem>
              <MenuItem value="מכשיר מידע/או מתן הוראות">
                מכשיר מידע/או מתן הוראות
              </MenuItem>
              <MenuItem value="משיכת מזומן">משיכת מזומן</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ width: '100%' }} size="small" dir="rtl">
            <InputLabel id="select-bank-label">כל הבנקים</InputLabel>
            <Select
              labelId="select-bank-label"
              id="mui-select"
              value={atmStore.selectedBankCode as string}
              label="כל הבנקים"
              onChange={handleBankChange}
            >
              <MenuItem value="all">
                <em>הכל</em>
              </MenuItem>
              {BANK_CODE_LIST.map((item, index) => (
                <MenuItem key={index} value={item.code}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <Divider sx={{ height: 6, mb: 2 }} orientation="horizontal" />
      </div>

      <div className="atm-list">
        {atmStore.filteredAtmData().map((item, index) => (
          <Paper
            key={index}
            className="atm-item"
            elevation={0}
            onClick={() =>
              handleAtmClick({ lat: item.X_Coordinate, lng: item.Y_Coordinate })
            }
          >
            <div className="item-container">
              <div className="item-content">
                <div className="item-title">
                  {item.Bank_Name} - {item.Atm_Num}
                </div>
                <div className="item-address">
                  {item.ATM_Address} | {item.ATM_Type}
                </div>
              </div>
              <div className="item-img">
                <img
                  src={`/location-${
                    item.ATM_Type === 'משיכת מזומן' ? 'orange' : 'blue'
                  }.png`}
                  alt="location"
                />
              </div>
            </div>
          </Paper>
        ))}
      </div>
    </div>
  );
});

export default FilterPanel;
