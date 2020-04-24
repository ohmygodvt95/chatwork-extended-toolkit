import Setting from './pages/Setting';

export default [
  {
    path: '/',
    component: Setting,
  },
  {
    path: '*',
    redirect: '/',
  },
];
