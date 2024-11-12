"use client";

import { Provider } from "react-redux";

import store from "@/reduxStore/store";
import { AuthProvider } from "@/components/authContext/AuthContext";

const StoreProvider = ({ children }) => {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
};

export default StoreProvider;
