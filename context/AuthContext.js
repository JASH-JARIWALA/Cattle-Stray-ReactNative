import React, { createContext } from 'react';

export const AuthUser = createContext({
     isLoggedIn: false,
     uid: null,
     name: "",
});