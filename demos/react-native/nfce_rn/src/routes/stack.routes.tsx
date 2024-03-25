import { createNativeStackNavigator } from '@react-navigation/native-stack';
const { Screen, Navigator } = createNativeStackNavigator();

import Dashboard from '../screens/Dashboard';
import AddPedido from '../screens/AddPedido';
import ViewPedido from '../screens/ViewPedido';
import Config from '../screens/Config';
import ViewXML from '../screens/ViewXML';
import ConfigSoftwareHouse from "../screens/ConfigSoftwareHouse";
import ConfigNumeracao from "../screens/ConfigNumeracao";
import Utility from "../screens/Utility";

export function StackRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        animation: 'none',
      }}
    >
      <Screen name="Dashboard" component={Dashboard} />
      <Screen name="AddPedido" component={AddPedido} />
      <Screen name="ViewPedido" component={ViewPedido} />
      <Screen name="Config" component={Config} />
      <Screen name="ViewXML" component={ViewXML} />
      <Screen name="ConfigSoftwareHouse" component={ConfigSoftwareHouse} />
      <Screen name="ConfigNumeracao" component={ConfigNumeracao} />
      <Screen name="Utility" component={Utility} />
    </Navigator>
  );
}
