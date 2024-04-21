import './layout.scss';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div id="layout-wrapper">
      <div className="layout-container">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
