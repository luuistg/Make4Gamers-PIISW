import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * Envuelve la aplicación con todos los proveedores globales.
 * Añade aquí futuros proveedores (AuthProvider, ThemeProvider, QueryClientProvider, etc.)
 */
export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
}
