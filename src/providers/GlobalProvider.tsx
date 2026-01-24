import { type ReactNode } from 'react';
import { Toaster } from 'sonner';

interface GlobalProviderProps {
  children: ReactNode;
}

const GlobalProvider = ({ children }: GlobalProviderProps) => {
  return (
    <>
      {children}
      <Toaster position="bottom-right" />
    </>
  );
};

export default GlobalProvider;