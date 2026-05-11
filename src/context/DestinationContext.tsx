import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";
import { Destination } from "../types";

interface ContextType {
  destinations: Destination[];

  addDestination: (d: Destination) => Promise<void>;

  updateDestination: (
    id: string,
    d: Destination
  ) => Promise<void>;

  deleteDestination: (
    id: string
  ) => Promise<void>;

  getDestinationById: (
    id: string
  ) => Destination | undefined;
}

const DestinationContext =
  createContext<ContextType>(
    {} as ContextType
  );

export const DestinationProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {

  const [destinations, setDestinations] =
    useState<Destination[]>([]);

  // REALTIME FETCH
  useEffect(() => {

    const unsubscribe = onSnapshot(
      collection(db, "trips"),
      (snapshot) => {

        const data = snapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        ) as Destination[];

        setDestinations(data);
      }
    );

    return () => unsubscribe();

  }, []);

  // ADD
  const addDestination = async (
  d: Destination
) => {

  const { id, ...tripData } = d;

  await addDoc(
    collection(db, "trips"),
    tripData
  );
};

  // UPDATE
  const updateDestination = async (
    id: string,
    updated: Destination
  ) => {

    const ref = doc(db, "trips", id);

    await updateDoc(ref, {
      ...updated,
    });
  };

  // DELETE
  const deleteDestination = async (
    id: string
  ) => {

    await deleteDoc(
      doc(db, "trips", id)
    );
  };

  // GET SINGLE
  const getDestinationById = (
    id: string
  ) => {

    return destinations.find(
      (d) => d.id === id
    );
  };

  return (
    <DestinationContext.Provider
      value={{
        destinations,
        addDestination,
        updateDestination,
        deleteDestination,
        getDestinationById,
      }}
    >
      {children}
    </DestinationContext.Provider>
  );
};

export const useDestinations = () =>
  useContext(DestinationContext);