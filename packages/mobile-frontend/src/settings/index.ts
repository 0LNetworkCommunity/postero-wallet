import { useContext } from "react";
import { settingsContext } from "./context";

export const useSettings = () => useContext(settingsContext);
