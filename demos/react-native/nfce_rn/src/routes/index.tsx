import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaView, StatusBar} from 'react-native';
import {StackRoutes} from './stack.routes';

export function Routes() {
  return (
    <NavigationContainer>
      <SafeAreaView style={{flex: 0, backgroundColor: 'red'}} />
      <SafeAreaView style={{flex: 1, backgroundColor: 'gray'}}>
        <StatusBar />
        <StackRoutes />
      </SafeAreaView>
    </NavigationContainer>
  );
}
