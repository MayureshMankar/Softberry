import React from 'react';

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthData {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

class AuthStore {
  private data: AuthData = {
    user: null,
    token: null,
    isAuthenticated: false,
  };

  private listeners: Set<() => void> = new Set();

  constructor() {
    // Load from localStorage on initialization
    this.loadFromStorage();
  }

  private loadFromStorage() {
    try {
      const stored = localStorage.getItem('auth-storage');
      if (stored) {
        const parsed = JSON.parse(stored);
        this.data = {
          user: parsed.user || null,
          token: parsed.token || null,
          isAuthenticated: !!(parsed.user && parsed.token),
        };
      }
    } catch (error) {
      console.error('Failed to load auth data from storage:', error);
    }
  }

  private saveToStorage() {
    try {
      localStorage.setItem('auth-storage', JSON.stringify(this.data));
    } catch (error) {
      console.error('Failed to save auth data to storage:', error);
    }
  }

  private notify() {
    this.listeners.forEach(listener => listener());
  }

  getState(): AuthData {
    return { ...this.data };
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  login(user: User, token: string) {
    this.data = {
      user,
      token,
      isAuthenticated: true,
    };
    this.saveToStorage();
    this.notify();
  }

  logout() {
    this.data = {
      user: null,
      token: null,
      isAuthenticated: false,
    };
    this.saveToStorage();
    this.notify();
  }

  setUser(user: User) {
    this.data.user = user;
    this.data.isAuthenticated = true;
    this.saveToStorage();
    this.notify();
  }

  updateUser(userData: Partial<User>) {
    if (this.data.user) {
      this.data.user = { ...this.data.user, ...userData };
      this.saveToStorage();
      this.notify();
    }
  }
}

// Create singleton instance
const authStore = new AuthStore();

// Helper functions
export const getAuthToken = (): string | null => {
  return authStore.getState().token;
};

export const getAuthUser = (): User | null => {
  return authStore.getState().user;
};

export const isUserAuthenticated = (): boolean => {
  const state = authStore.getState();
  return state.isAuthenticated && !!state.token;
};

// Hook for React components
export const useAuthStore = () => {
  const [state, setState] = React.useState(authStore.getState());

  React.useEffect(() => {
    const unsubscribe = authStore.subscribe(() => {
      setState(authStore.getState());
    });
    return unsubscribe;
  }, []);

  return {
    ...state,
    login: authStore.login.bind(authStore),
    logout: authStore.logout.bind(authStore),
    setUser: authStore.setUser.bind(authStore),
    updateUser: authStore.updateUser.bind(authStore),
  };
};

export default authStore;