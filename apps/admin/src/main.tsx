import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';
import { ApplicationPage } from '@/pages/ApplicationPage';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApplicationPage />
  </StrictMode>
);
