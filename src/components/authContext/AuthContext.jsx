"use client";

import React, { createContext, useState, useEffect } from "react";

import initializeSocket from "@/utils/socket";
import initializeAxios from "@/services/axios.service";
import { getUser } from "@/helpers/user.helper";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useEffect(() => {
  //   console.log("=> updateAuth executing");
  //   if (typeof window !== "undefined") {
  //     const user = getUser();
  //     console.log("=> user ", user);
  //     const token = user?.token;
  //     const refreshToken = user?.refreshToken;
  //     setToken(token || null);
  //     setIsLoggedIn(!!token);
  //     setLoading(false);
  //     initializeSocket(user?._id || null);
  //     initializeAxios(token || null, refreshToken || null);
  //   }
  // }, [typeof window !== "undefined" && localStorage.getItem("user")]);

  const updateAuth = () => {
    const user = getUser();
    const token = user?.token;
    const refreshToken = user?.refreshToken;
    setToken(token || null);
    setIsLoggedIn(!!token);
    setLoading(false);
    initializeSocket(user?._id || null);
    initializeAxios(token || null, refreshToken || null);
  };

  useEffect(() => {
    typeof window !== "undefined" && updateAuth();

    const handleStorageChange = (event) => {
      if (event.key === "user") {
        updateAuth();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    const handleCustomEvent = () => {
      updateAuth();
    };

    window.addEventListener("localStorageUpdate", handleCustomEvent);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("localStorageUpdate", handleCustomEvent);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken, loading, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};
