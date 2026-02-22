import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';

import './index.css';

import { ApplicationPage } from '@/pages/ApplicationPage';
import { LoginPage } from '@/pages/LoginPage';

import { AuthInit } from '@/components/auth/AuthInit';
import { ProtectAuth } from '@/components/auth/ProtectAuth';

import { initAuth } from '@/auth';
import { authConfig } from '@/auth/auth.config';
import { ROUTE } from '@/constants/route';

initAuth(authConfig);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

const router = createBrowserRouter([
  {
    path: ROUTE.LOGIN,
    element: (
      <ProtectAuth protect={false} loginPath={ROUTE.LOGIN} mainPath={ROUTE.HOME}>
        <LoginPage />
      </ProtectAuth>
    ),
  },
  {
    path: ROUTE.HOME,
    element: (
      <ProtectAuth protect loginPath={ROUTE.LOGIN} mainPath={ROUTE.HOME}>
        <ApplicationPage />
      </ProtectAuth>
    ),
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <AuthInit>
          <RouterProvider router={router} />
        </AuthInit>
      </QueryClientProvider>
    </JotaiProvider>
  </StrictMode>
);
