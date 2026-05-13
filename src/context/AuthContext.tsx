import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { auth, signInWithGoogle, logoutUser, db } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, onSnapshot, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  wishlist: string[];
  toggleWishlist: (destinationId: string) => Promise<void>;
  loginAsAdmin: (password: string) => boolean;
  clearAdmin: () => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    let unsubWishlist: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      // Clean up previous wishlist listener if it exists
      if (unsubWishlist) {
        unsubWishlist();
        unsubWishlist = null;
      }

      if (currentUser) {
        // Subscribe to user's wishlist in Firestore
        const userRef = doc(db, 'users', currentUser.uid);
        unsubWishlist = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            setWishlist(docSnap.data().wishlist || []);
          }
          setLoading(false);
        }, (error) => {
          console.error("Wishlist listener error:", error);
          // Handle Firestore error as per system instructions
          const errInfo = {
            error: error.message,
            operationType: 'get',
            path: `users/${currentUser.uid}`,
            authInfo: {
              userId: currentUser.uid,
              email: currentUser.email,
              emailVerified: currentUser.emailVerified,
              isAnonymous: currentUser.isAnonymous,
            }
          };
          console.error('Firestore Error: ', JSON.stringify(errInfo));
          setLoading(false);
        });
      } else {
        setWishlist([]);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubWishlist) unsubWishlist();
    };
  }, []);

  const toggleWishlist = async (destinationId: string) => {
    if (!user) return;
    
    const userRef = doc(db, 'users', user.uid);
    const isFavorited = wishlist.includes(destinationId);
    
    try {
      if (isFavorited) {
        await updateDoc(userRef, {
          wishlist: arrayRemove(destinationId)
        });
      } else {
        await updateDoc(userRef, {
          wishlist: arrayUnion(destinationId)
        });
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      // If document doesn't exist, create it
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        wishlist: [destinationId]
      }, { merge: true });
    }
  };

  const loginAsAdmin = useCallback((password: string): boolean => {
    const ADMIN_PASSWORD = 'PRAN@123#aw';
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const clearAdmin = useCallback(() => {
    setIsAdmin(false);
  }, []);

  const loginWithGoogle = useCallback(async () => {
    await signInWithGoogle();
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setIsAdmin(false);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAdmin, 
      wishlist,
      toggleWishlist,
      loginAsAdmin, 
      clearAdmin,
      loginWithGoogle, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
