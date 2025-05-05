
import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  updateProfile,
  User
} from 'firebase/auth';
import { auth } from '../config/firebase';

export type UserType = 'individual' | 'company';

interface AuthUser extends User {
  userType?: UserType;
  companyName?: string;
  bio?: string;
  location?: string;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  userType: UserType | null;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string, displayName: string, userType: UserType, companyName?: string) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (data: {displayName?: string, photoURL?: string, userType?: UserType, companyName?: string, bio?: string, location?: string}) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [userType, setUserType] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  async function login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  async function register(email: string, password: string, displayName: string, userType: UserType, companyName?: string) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Update profile with display name
    await updateProfile(result.user, { displayName });
    
    // Save additional user data to Firestore or localStorage for now
    localStorage.setItem(`user_${result.user.uid}_type`, userType);
    if (companyName && userType === 'company') {
      localStorage.setItem(`user_${result.user.uid}_company`, companyName);
    }
    
    return result;
  }

  async function logout() {
    return signOut(auth);
  }

  async function resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

  async function updateUserProfile(data: {displayName?: string, photoURL?: string, userType?: UserType, companyName?: string, bio?: string, location?: string}) {
    if (!currentUser) return;

    const updateData: {displayName?: string, photoURL?: string} = {};
    if (data.displayName) updateData.displayName = data.displayName;
    if (data.photoURL) updateData.photoURL = data.photoURL;
    
    await updateProfile(currentUser, updateData);

    // Update additional user data
    if (data.userType) {
      localStorage.setItem(`user_${currentUser.uid}_type`, data.userType);
      setUserType(data.userType);
    }
    if (data.companyName) {
      localStorage.setItem(`user_${currentUser.uid}_company`, data.companyName);
    }
    if (data.bio) {
      localStorage.setItem(`user_${currentUser.uid}_bio`, data.bio);
    }
    if (data.location) {
      localStorage.setItem(`user_${currentUser.uid}_location`, data.location);
    }

    // Refresh the user object
    setCurrentUser({
      ...currentUser,
      ...updateData,
      userType: data.userType || currentUser.userType,
      companyName: data.companyName || currentUser.companyName,
      bio: data.bio || (currentUser as any).bio,
      location: data.location || (currentUser as any).location,
    });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Get additional user data from Firestore or localStorage
        const userTypeFromStorage = localStorage.getItem(`user_${user.uid}_type`) as UserType | null;
        const companyNameFromStorage = localStorage.getItem(`user_${user.uid}_company`) || undefined;
        const bioFromStorage = localStorage.getItem(`user_${user.uid}_bio`) || undefined;
        const locationFromStorage = localStorage.getItem(`user_${user.uid}_location`) || undefined;

        const enhancedUser = {
          ...user,
          userType: userTypeFromStorage || undefined,
          companyName: companyNameFromStorage,
          bio: bioFromStorage,
          location: locationFromStorage
        };

        setCurrentUser(enhancedUser);
        setUserType(userTypeFromStorage);
      } else {
        setCurrentUser(null);
        setUserType(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userType,
    login,
    register,
    logout,
    resetPassword,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
