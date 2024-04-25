import { createBrowserRouter } from 'react-router-dom';
import PathConstants from './constants/pathConstants';
import HomePage from './pages/home/home';
import Page404 from './pages/not-found/not-found';
import Layout from './components/layout/layout';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#F6993A',
    },
  },
});

const children = [
  {
    path: PathConstants.HOME,
    element: (
      <ThemeProvider theme={theme}>
        <HomePage />
      </ThemeProvider>
    ),
  },
];

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <Page404 />,
    children: children,
  },
]);

export default router;
