// routes/index.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import { AuthRoutes } from './auth.routes';
import { AppRoutes } from './app.routes';

// Adicionar lógica de verificação

export function Routes() {
  const userIsLoggedIn = true;

  return (
    <NavigationContainer>
      {userIsLoggedIn ? <AppRoutes /> : <AuthRoutes />}
    </NavigationContainer>
  );
}