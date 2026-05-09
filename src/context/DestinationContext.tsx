import React, { createContext, useContext, useState, useEffect } from 'react';
import { Destination } from '../types';

interface ContextType {
  destinations: Destination[];
  addDestination: (d: Destination) => void;
  updateDestination: (id: string, d: Destination) => void;
  deleteDestination: (id: string) => void;
  getDestinationById: (id: string) => Destination | undefined;
}

const DestinationContext = createContext<ContextType>({} as ContextType);

export const DestinationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [destinations, setDestinations] = useState<Destination[]>(() => {
    const data = localStorage.getItem('destinations');
    return data ? JSON.parse(data) : [];
  });

  /* SAVE TO LOCAL STORAGE */
  useEffect(() => {
    localStorage.setItem('destinations', JSON.stringify(destinations));
  }, [destinations]);

  const addDestination = (d: Destination) => {
    setDestinations(prev => [...prev, d]);
  };

  const updateDestination = (id: string, updated: Destination) => {
    setDestinations(prev =>
      prev.map(item => (item.id === id ? updated : item))
    );
  };

  const deleteDestination = (id: string) => {
    setDestinations(prev => prev.filter(item => item.id !== id));
  };

  const getDestinationById = (id: string) => {
    return destinations.find(d => d.id === id);
  };

  return (
    <DestinationContext.Provider value={{
      destinations,
      addDestination,
      updateDestination,
      deleteDestination,
      getDestinationById
    }}>
      {children}
    </DestinationContext.Provider>
  );
};

export const useDestinations = () => useContext(DestinationContext);