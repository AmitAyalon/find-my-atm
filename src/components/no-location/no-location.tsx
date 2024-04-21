import './no-location.scss';
import LogoImg from '../../assets/images/logo.png';

export const NoLocation = () => {
  return (
    <div className="empty-screen-container">
      <div className="logo-container d-flex-column align-items justify-content">
        <div className="logo-wrapper">
          <img
            id="logo-img"
            className="logo-img"
            src={LogoImg}
            alt="logo img"
            width="200px"
            height="200px"
          />
        </div>
        <div className="msg-wrapper">
          allow location access or search via city name.
        </div>
      </div>
    </div>
  );
};
export default NoLocation;
