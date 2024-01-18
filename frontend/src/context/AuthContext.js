// context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [turn, setturn] = useState(2);
  const [dummyData, setdummyData] = useState([]);
 
  
  return (
    <AuthContext.Provider
      value={{
        turn, setturn, dummyData, setdummyData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
