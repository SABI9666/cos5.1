import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthChange } from '../services/api';

var AuthContext = createContext(null);

export function AuthProvider(props) {
  var children = props.children;
  
  var userState = useState(null);
  var user = userState[0];
  var setUser = userState[1];
  
  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];
  
  var mountedState = useState(false);
  var isMounted = mountedState[0];
  var setIsMounted = mountedState[1];

  useEffect(function() {
    setIsMounted(true);
    
    var unsubscribe = onAuthChange(function(currentUser) {
      setUser(currentUser);
      setLoading(false);
    });

    return function() {
      unsubscribe();
    };
  }, []);

  var value = {
    user: user,
    loading: loading,
    isAuthenticated: !!user,
    isMounted: isMounted
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  var context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
