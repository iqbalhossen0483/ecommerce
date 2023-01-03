import React, { createContext } from "react";
import Store from "./Store";

export const Context = createContext(null);

const StoreProvider = ({ children }) => {
  const store = Store();

  return <Context.Provider value={store}>{children}</Context.Provider>;
};

export default StoreProvider;
