import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Destination } from '../types';
import { DESTINATIONS as INITIAL_DESTINATIONS } from '../constants';

interface DestinationContextType {
  destinations: Destination[];
  addDestination: (dest: Destination) => void;
  updateDestination: (id: string, dest: Partial<Destination>) => void;
  deleteDestination: (id: string) => void;
  getDestinationById: (id: string) => Destination | undefined;
}

const DestinationContext = createContext<DestinationContextType | undefined>(undefined);

export const DestinationProvider = ({ children }: { children: ReactNode }) => {
  const [destinations, setDestinations] = useState<Destination[]>(() => {
    const saved = localStorage.getItem('safarsathi_destinations');
    return saved ? JSON.parse(saved) : INITIAL_DESTINATIONS;
  });

  useEffect(() => {
    localStorage.setItem('safarsathi_destinations', JSON.stringify(destinations));
  }, [destinations]);

  const addDestination = (dest: Destination) => {
    setDestinations(prev => [...prev, dest]);
  };

  const updateDestination = (id: string, updatedFields: Partial<Destination>) => {
    setDestinations(prev => prev.map(d => d.id === id ? { ...d, ...updatedFields } as Destination : d));
  };

  const deleteDestination = (id: string) => {
    setDestinations(prev => prev.filter(d => d.id !== id));
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

export const useDestinations = () => {
  const context = useContext(DestinationContext);
  if (context === undefined) {
    throw new Error('useDestinations must be used within a DestinationProvider');
  }
  return context;
};
