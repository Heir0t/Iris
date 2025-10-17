import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Index from '../app/Index';
import Notifications from '../app/Notifications';
import Info from '../app/Info';
import Settings from '../app/Settings';

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  return (
    <Navigator screenOptions={{ headerShown: false }}>
      <Screen name="Home" component={Index} />
      <Screen name="Notifications" component={Notifications} />
      <Screen name="Info" component={Info} />
      <Screen name="Settings" component={Settings} />
    </Navigator>
  );
}