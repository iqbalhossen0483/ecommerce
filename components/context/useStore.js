import { useContext } from "react";
import { Context } from "./StoreProvider";

const useStore = () => {
  return useContext(Context);
};

export default useStore;
