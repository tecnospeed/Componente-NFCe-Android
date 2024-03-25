import { Routes } from './src/routes/index';
import { AlertNotificationRoot } from 'react-native-alert-notification';
import './global.css';

export default function App() {
  return (
    <AlertNotificationRoot>
      <Routes />
    </AlertNotificationRoot>
  );
}
