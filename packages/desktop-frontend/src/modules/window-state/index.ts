import { useContext } from "react";
import { windowStateContext } from "./context";

export const useWindowState = () => useContext(windowStateContext);
