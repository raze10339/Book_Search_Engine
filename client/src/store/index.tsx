import { useState, useEffect, useContext, createContext, Dispatch, SetStateAction } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER } from '../../graphql/queries';

interface StoreProviderProps {
  children: React.ReactNode;
}

interface StateValue {
  loading: boolean;
  user: any;
}

interface ContextValue {
  state: StateValue;
  setState: Dispatch<SetStateAction<StateValue>>;
}

const StoreContext = createContext<ContextValue | undefined>(undefined);

const initialState: StateValue = {
  loading: true,
  user: null,
};

export function StoreProvider({ children }: StoreProviderProps) {
  const [state, setState] = useState<StateValue>(initialState);

  const { data, loading, error } = useQuery(GET_USER);

  useEffect(() => {
    if (!loading && data) {
      setState({
        loading: false,
        user: data.getUser || null, 
      });
    } else if (!loading && error) {
      setState({
        loading: false,
        user: null, 
      });
    }
  }, [data, loading, error]);

  return (
    <StoreContext.Provider
      value={{
        state,
        setState,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

// Custom hook for accessing the store
export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
